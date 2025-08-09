import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  ShippingOption, 
  getAllShippingOptions, 
  createShippingOption, 
  updateShippingOption, 
  deleteShippingOption 
} from '@/lib/shipping-service';

export default function ShippingManagement() {
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<ShippingOption | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    estimatedDays: '',
    active: true
  });

  useEffect(() => {
    loadShippingOptions();
  }, []);

  const loadShippingOptions = async () => {
    try {
      console.log('📦 Cargando opciones de envío...');
      const options = await getAllShippingOptions();
      console.log('📋 Opciones cargadas:', options.length, options);
      setShippingOptions(options);
    } catch (error) {
      console.error('Error loading shipping options:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las opciones de envío',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('💾 Guardando opción de envío:', formData);
      
      if (editingOption) {
        const updatedOption = await updateShippingOption(editingOption.id, formData);
        console.log('✅ Opción actualizada:', updatedOption);
        toast({
          title: 'Opción actualizada',
          description: 'La opción de envío ha sido actualizada exitosamente.',
        });
      } else {
        const newOption = await createShippingOption(
          formData.name,
          formData.description,
          formData.price,
          formData.estimatedDays
        );
        console.log('✅ Nueva opción creada:', newOption);
        toast({
          title: 'Opción creada',
          description: 'La nueva opción de envío ha sido creada exitosamente.',
        });
      }
      
      // Force refresh the shipping options list
      console.log('🔄 Recargando lista de opciones...');
      await loadShippingOptions();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving shipping option:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la opción de envío',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (option: ShippingOption) => {
    setEditingOption(option);
    setFormData({
      name: option.name,
      description: option.description,
      price: option.price,
      estimatedDays: option.estimatedDays,
      active: option.active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta opción de envío?')) {
      try {
        await deleteShippingOption(id);
        toast({
          title: 'Opción eliminada',
          description: 'La opción de envío ha sido eliminada exitosamente.',
        });
        await loadShippingOptions();
      } catch (error) {
        console.error('Error deleting shipping option:', error);
        toast({
          title: 'Error',
          description: 'No se pudo eliminar la opción de envío',
          variant: 'destructive',
        });
      }
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      console.log('🔄 Cambiando estado de opción:', id, 'a', active);
      const updatedOption = await updateShippingOption(id, { active });
      console.log('✅ Estado actualizado:', updatedOption);
      
      // Force refresh the shipping options list
      await loadShippingOptions();
      toast({
        title: 'Estado actualizado',
        description: `La opción de envío ha sido ${active ? 'activada' : 'desactivada'}.`,
      });
    } catch (error) {
      console.error('Error updating shipping option status:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado de la opción de envío',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      estimatedDays: '',
      active: true
    });
    setEditingOption(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando opciones de envío...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Envíos</h2>
          <p className="text-muted-foreground">
            Administra las opciones de envío disponibles para los clientes
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Opción de Envío
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingOption ? 'Editar Opción de Envío' : 'Nueva Opción de Envío'}
                </DialogTitle>
                <DialogDescription>
                  {editingOption 
                    ? 'Modifica los detalles de la opción de envío' 
                    : 'Agrega una nueva opción de envío para tus clientes'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="ej. Envío Express"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="ej. Entrega en 2-3 días hábiles"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Precio ($)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="estimatedDays">Tiempo Estimado</Label>
                    <Input
                      id="estimatedDays"
                      name="estimatedDays"
                      value={formData.estimatedDays}
                      onChange={handleChange}
                      placeholder="ej. 2-3 días"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                  />
                  <Label htmlFor="active">Opción activa</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingOption ? 'Actualizar' : 'Crear'} Opción
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="w-5 h-5 mr-2" />
            Opciones de Envío ({shippingOptions.length})
          </CardTitle>
          <CardDescription>
            Lista de todas las opciones de envío disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Tiempo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shippingOptions.map((option) => (
                <TableRow key={option.id}>
                  <TableCell className="font-medium">{option.name}</TableCell>
                  <TableCell>{option.description}</TableCell>
                  <TableCell>
                    {option.price === 0 ? 'Gratis' : `$${option.price.toFixed(2)}`}
                  </TableCell>
                  <TableCell>{option.estimatedDays}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={option.active}
                        onCheckedChange={(checked) => handleToggleActive(option.id, checked)}
                      />
                      <Badge variant={option.active ? 'default' : 'secondary'}>
                        {option.active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(option)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(option.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {shippingOptions.length === 0 && (
            <div className="text-center py-8">
              <Truck className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay opciones de envío</h3>
              <p className="text-gray-500 mb-4">
                Crea tu primera opción de envío para empezar a ofrecer diferentes alternativas a tus clientes.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Opción
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}