import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowPathIcon, 
  PlusCircleIcon, 
  CreditCardIcon, 
  BanknotesIcon, 
  CheckCircleIcon, 
  XCircleIcon 
} from '@heroicons/react/24/outline';

// Removed AdminLayout import as we're using Outlet now
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

import { PaymentMethod, PaymentProcessor } from '@/types';
import { paymentService } from '@/lib/payment-service';

export default function PaymentMethodsManagement() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    processor: PaymentProcessor;
    active: boolean;
    stripePublishableKey: string;
    stripeSecretKey: string;
    paypalClientId: string;
    paypalClientSecret: string;
    paypalSandbox: boolean;
  }>({
    name: '',
    description: '',
    processor: 'stripe',
    active: true,
    stripePublishableKey: '',
    stripeSecretKey: '',
    paypalClientId: '',
    paypalClientSecret: '',
    paypalSandbox: true
  });

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    setLoading(true);
    try {
      const methods = await paymentService.getAllPaymentMethodsAdmin();
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los métodos de pago',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      processor: 'stripe',
      active: true,
      stripePublishableKey: '',
      stripeSecretKey: '',
      paypalClientId: '',
      paypalClientSecret: '',
      paypalSandbox: true
    });
    setEditingMethod(null);
  };

  const handleOpenDialog = (method?: PaymentMethod) => {
    if (method) {
      setEditingMethod(method);
      setFormData({
        name: method.name,
        description: method.description || '',
        processor: method.processor,
        active: method.active,
        stripePublishableKey: method.config.stripe?.publishableKey || '',
        stripeSecretKey: method.config.stripe?.secretKey || '',
        paypalClientId: method.config.paypal?.clientId || '',
        paypalClientSecret: method.config.paypal?.clientSecret || '',
        paypalSandbox: method.config.paypal?.sandbox || true
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      await paymentService.updatePaymentMethod(id, { active });
      loadPaymentMethods();
      toast({
        title: 'Éxito',
        description: active 
          ? 'Método de pago activado correctamente' 
          : 'Método de pago desactivado correctamente',
      });
    } catch (error) {
      console.error('Error toggling payment method:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el método de pago',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const config = {
        ...(formData.processor === 'stripe' ? {
          stripe: {
            publishableKey: formData.stripePublishableKey,
            secretKey: formData.stripeSecretKey,
            paymentMethods: ['card']
          }
        } : {}),
        ...(formData.processor === 'paypal' ? {
          paypal: {
            clientId: formData.paypalClientId,
            clientSecret: formData.paypalClientSecret,
            sandbox: formData.paypalSandbox
          }
        } : {})
      };
      
      if (editingMethod) {
        await paymentService.updatePaymentMethod(editingMethod.id, {
          name: formData.name,
          description: formData.description,
          processor: formData.processor,
          active: formData.active,
          config
        });
        toast({
          title: 'Éxito',
          description: 'Método de pago actualizado correctamente',
        });
      } else {
        await paymentService.createPaymentMethod(
          formData.name,
          formData.processor,
          config,
          formData.description
        );
        toast({
          title: 'Éxito',
          description: 'Método de pago creado correctamente',
        });
      }
      
      loadPaymentMethods();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving payment method:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el método de pago',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este método de pago?')) {
      return;
    }
    
    try {
      await paymentService.deletePaymentMethod(id);
      loadPaymentMethods();
      toast({
        title: 'Éxito',
        description: 'Método de pago eliminado correctamente',
      });
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el método de pago',
        variant: 'destructive',
      });
    }
  };

  const getProcessorIcon = (processor: PaymentProcessor) => {
    switch (processor) {
      case 'stripe':
        return <CreditCardIcon className="w-5 h-5" />;
      case 'paypal':
        return <BanknotesIcon className="w-5 h-5" />;
      default:
        return <CreditCardIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Métodos de Pago</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadPaymentMethods}
            disabled={loading}
          >
            <ArrowPathIcon className="w-4 h-4 mr-1" />
            Actualizar
          </Button>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircleIcon className="w-4 h-4 mr-1" />
            Nuevo Método
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <ArrowPathIcon className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-gray-500">No hay métodos de pago configurados</p>
              <Button onClick={() => handleOpenDialog()} className="mt-4">
                <PlusCircleIcon className="w-4 h-4 mr-1" />
                Añadir método de pago
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left pb-4">Nombre</th>
                    <th className="text-left pb-4">Procesador</th>
                    <th className="text-left pb-4">Estado</th>
                    <th className="text-right pb-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentMethods.map((method) => (
                    <tr key={method.id} className="border-t">
                      <td className="py-4">
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-gray-500">
                          {method.description}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center">
                          {getProcessorIcon(method.processor)}
                          <span className="ml-2 capitalize">{method.processor}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center">
                          {method.active ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircleIcon className="w-4 h-4 mr-1" />
                              Activo
                            </div>
                          ) : (
                            <div className="flex items-center text-red-600">
                              <XCircleIcon className="w-4 h-4 mr-1" />
                              Inactivo
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleActive(method.id, !method.active)}
                          >
                            {method.active ? 'Desactivar' : 'Activar'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDialog(method)}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(method.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMethod ? 'Editar' : 'Añadir'} Método de Pago
            </DialogTitle>
            <DialogDescription>
              Configura los detalles del método de pago aquí.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nombre
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tarjeta de Crédito"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="processor" className="text-sm font-medium">
                    Procesador
                  </label>
                  <Select
                    value={formData.processor}
                    onValueChange={(value) => handleSelectChange('processor', value as PaymentProcessor)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar procesador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Descripción
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descripción del método de pago"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => handleSwitchChange('active', checked)}
                />
                <label htmlFor="active" className="text-sm font-medium">
                  Activo
                </label>
              </div>
              
              <Separator className="my-4" />
              
              <Tabs defaultValue={formData.processor} value={formData.processor}>
                <TabsList>
                  <TabsTrigger value="stripe">Configuración de Stripe</TabsTrigger>
                  <TabsTrigger value="paypal">Configuración de PayPal</TabsTrigger>
                </TabsList>
                
                <TabsContent value="stripe" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label htmlFor="stripePublishableKey" className="text-sm font-medium">
                      Clave Publicable (Publishable Key)
                    </label>
                    <Input
                      id="stripePublishableKey"
                      name="stripePublishableKey"
                      value={formData.stripePublishableKey}
                      onChange={handleChange}
                      placeholder="pk_test_..."
                      required={formData.processor === 'stripe'}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="stripeSecretKey" className="text-sm font-medium">
                      Clave Secreta (Secret Key)
                    </label>
                    <Input
                      id="stripeSecretKey"
                      name="stripeSecretKey"
                      type="password"
                      value={formData.stripeSecretKey}
                      onChange={handleChange}
                      placeholder="sk_test_..."
                      required={formData.processor === 'stripe'}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="paypal" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label htmlFor="paypalClientId" className="text-sm font-medium">
                      Client ID
                    </label>
                    <Input
                      id="paypalClientId"
                      name="paypalClientId"
                      value={formData.paypalClientId}
                      onChange={handleChange}
                      placeholder="Client ID"
                      required={formData.processor === 'paypal'}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="paypalClientSecret" className="text-sm font-medium">
                      Client Secret
                    </label>
                    <Input
                      id="paypalClientSecret"
                      name="paypalClientSecret"
                      type="password"
                      value={formData.paypalClientSecret}
                      onChange={handleChange}
                      placeholder="Client Secret"
                      required={formData.processor === 'paypal'}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="paypalSandbox"
                      checked={formData.paypalSandbox}
                      onCheckedChange={(checked) => handleSwitchChange('paypalSandbox', checked)}
                    />
                    <label htmlFor="paypalSandbox" className="text-sm font-medium">
                      Modo Sandbox (Pruebas)
                    </label>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingMethod ? 'Guardar Cambios' : 'Crear Método'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}