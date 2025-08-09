import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Edit, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Promotion, PromotionType } from "@/types";
import { 
  getPromotions,
  createPromotion, 
  updatePromotion, 
  deletePromotion 
} from "@/lib/promotion-service";

// Helper function to get a readable label for promotion types
function getPromotionTypeLabel(type: PromotionType): string {
  const labels = {
    'percentage_discount': 'Descuento Porcentual',
    'fixed_amount': 'Descuento Fijo',
    'registration_discount': 'Descuento por Registro',
    'shipping_discount': 'Descuento en Envío'
  };
  return labels[type] || type;
}

export default function PromotionsManagement() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    description: "",
    type: "percentage_discount" as PromotionType,
    value: 0,
    code: "",
    startDate: "",
    endDate: "",
    active: true,
    usageCount: 0,
    usageLimit: undefined as number | undefined,
    minimumPurchase: undefined as number | undefined
  });

  useEffect(() => {
    loadPromotions();
  }, []);

  async function loadPromotions() {
    setIsLoading(true);
    try {
      const data = await getPromotions();
      setPromotions(data);
    } catch (error) {
      console.error("Failed to load promotions:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las promociones",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function openCreateDialog() {
    setEditingPromotion(null);
    setFormData({
      id: 0,
      name: "",
      description: "",
      type: "percentage_discount" as PromotionType,
      value: 0,
      code: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      active: true,
      usageCount: 0,
      usageLimit: undefined,
      minimumPurchase: undefined
    });
    setIsDialogOpen(true);
  }

  function openEditDialog(promotion: Promotion) {
    setEditingPromotion(promotion);
    setFormData({
      id: promotion.id,
      name: promotion.name,
      description: promotion.description || "",
      type: promotion.type,
      value: promotion.value,
      code: promotion.code || "",
      startDate: promotion.startDate ? new Date(promotion.startDate).toISOString().split("T")[0] : "",
      endDate: promotion.endDate ? new Date(promotion.endDate).toISOString().split("T")[0] : "",
      active: promotion.active,
      usageCount: promotion.usageCount,
      usageLimit: promotion.usageLimit,
      minimumPurchase: promotion.minimumPurchase
    });
    setIsDialogOpen(true);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleSwitchChange(checked: boolean) {
    setFormData(prev => ({ ...prev, active: checked }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      if (editingPromotion) {
        await updatePromotion(formData.id.toString(), {
          ...formData,
          value: Number(formData.value)
        });
        toast({
          title: "Promoción actualizada",
          description: `La promoción ${formData.name} ha sido actualizada correctamente.`
        });
      } else {
        await createPromotion({
          ...formData,
          value: Number(formData.value)
        });
        toast({
          title: "Promoción creada",
          description: `La promoción ${formData.name} ha sido creada correctamente.`
        });
      }
      setIsDialogOpen(false);
      loadPromotions();
    } catch (error) {
      console.error("Error saving promotion:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la promoción",
        variant: "destructive",
      });
    }
  }

  async function handleDelete(id: string, name: string) {
    if (window.confirm(`¿Estás seguro que deseas eliminar la promoción "${name}"?`)) {
      try {
        await deletePromotion(id);
        toast({
          title: "Promoción eliminada",
          description: `La promoción ${name} ha sido eliminada correctamente.`
        });
        loadPromotions();
      } catch (error) {
        console.error("Error deleting promotion:", error);
        toast({
          title: "Error",
          description: "No se pudo eliminar la promoción",
          variant: "destructive",
        });
      }
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Promociones</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Promoción
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingPromotion ? "Editar Promoción" : "Nueva Promoción"}
              </DialogTitle>
              <DialogDescription>
                Complete los detalles de la promoción a continuación.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="code">Código promocional</Label>
                <Input 
                  id="code" 
                  name="code" 
                  value={formData.code} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Promoción</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as PromotionType }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage_discount">Descuento Porcentual</SelectItem>
                    <SelectItem value="fixed_amount">Descuento Fijo</SelectItem>
                    <SelectItem value="registration_discount">Descuento por Registro</SelectItem>
                    <SelectItem value="shipping_discount">Descuento en Envío</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="value">
                  {formData.type === 'percentage_discount' ? 'Descuento (%)' : 'Cantidad ($)'}
                </Label>
                <Input 
                  id="value" 
                  name="value" 
                  type="number" 
                  min="0"
                  max={formData.type === 'percentage_discount' ? "100" : undefined}
                  value={formData.value} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha inicio</Label>
                  <Input 
                    id="startDate" 
                    name="startDate" 
                    type="date" 
                    value={formData.startDate} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">Fecha fin</Label>
                  <Input 
                    id="endDate" 
                    name="endDate" 
                    type="date" 
                    value={formData.endDate} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="usageLimit">Límite de uso (opcional)</Label>
                <Input 
                  id="usageLimit" 
                  name="usageLimit" 
                  type="number" 
                  min="0"
                  value={formData.usageLimit || ""}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    usageLimit: e.target.value ? Number(e.target.value) : undefined 
                  }))}
                />
                <p className="text-sm text-muted-foreground">
                  Cantidad máxima de veces que se puede usar esta promoción
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimumPurchase">Compra mínima (opcional)</Label>
                <Input 
                  id="minimumPurchase" 
                  name="minimumPurchase" 
                  type="number" 
                  min="0"
                  value={formData.minimumPurchase || ""}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    minimumPurchase: e.target.value ? Number(e.target.value) : undefined 
                  }))}
                />
                <p className="text-sm text-muted-foreground">
                  Monto mínimo de compra para aplicar esta promoción
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="active">Promoción activa</Label>
              </div>
              
              <DialogFooter>
                <Button type="submit">
                  {editingPromotion ? "Actualizar" : "Crear"} Promoción
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Table>
          <TableCaption>Lista de promociones disponibles</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Periodo</TableHead>
              <TableHead>Límites</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  No hay promociones disponibles
                </TableCell>
              </TableRow>
            ) : (
              promotions.map((promotion) => (
                <TableRow key={promotion.id}>
                  <TableCell className="font-medium">{promotion.name}</TableCell>
                  <TableCell className="font-mono">{promotion.code || "-"}</TableCell>
                  <TableCell>{promotion.value}{promotion.type === 'percentage_discount' ? '%' : '$'}</TableCell>
                  <TableCell>
                    {getPromotionTypeLabel(promotion.type)}
                  </TableCell>
                  <TableCell>
                    {promotion.startDate && promotion.endDate ? 
                      `${new Date(promotion.startDate).toLocaleDateString()} - ${new Date(promotion.endDate).toLocaleDateString()}` : 
                      "Sin periodo definido"}
                  </TableCell>
                  <TableCell>
                    {promotion.usageLimit ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs">
                        Uso: {promotion.usageCount}/{promotion.usageLimit}
                      </span>
                    ) : "Sin límite"}
                    {promotion.minimumPurchase ? (
                      <span className="block text-xs mt-1">
                        Mínimo: ${promotion.minimumPurchase}
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      promotion.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {promotion.active ? 'Activa' : 'Inactiva'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openEditDialog(promotion)}
                        className="h-8 px-2"
                      >
                        <Edit className="h-4 w-4 mr-1" /> Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(promotion.id, promotion.name)}
                        className="h-8 px-2"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}