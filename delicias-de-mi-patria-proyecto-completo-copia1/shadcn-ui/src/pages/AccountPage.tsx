import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/main-layout';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { AlertCircle, Package, Calendar, DollarSign } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getOrdersByUserId } from '@/lib/orders-service';
import { Order } from '@/types';

export default function AccountPage() {
  const { user, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const handleProfileUpdate = async () => {
    try {
      setIsUpdating(true);
      setUpdateError(null);
      await updateUserProfile({ name });
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateError('No se pudo actualizar el perfil. Intente nuevamente.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Load user orders
  useEffect(() => {
    const loadOrders = async () => {
      if (user) {
        try {
          setLoadingOrders(true);
          const userOrders = await getOrdersByUserId(user.id);
          setOrders(userOrders);
        } catch (error) {
          console.error('Error loading orders:', error);
          toast.error('No se pudieron cargar los pedidos');
        } finally {
          setLoadingOrders(false);
        }
      }
    };
    
    loadOrders();
  }, [user]);

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { label: 'Pendiente', variant: 'secondary' as const },
      confirmed: { label: 'Confirmado', variant: 'default' as const },
      processing: { label: 'Procesando', variant: 'default' as const },
      shipped: { label: 'Enviado', variant: 'default' as const },
      delivered: { label: 'Entregado', variant: 'default' as const },
      cancelled: { label: 'Cancelado', variant: 'destructive' as const }
    };
    
    const config = statusConfig[status] || { label: 'Desconocido', variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Redirect to login if not authenticated
  if (!user) {
    navigate('/iniciar-sesion');
    return null;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mi Cuenta</h1>

        <div className="grid gap-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="orders">Mis Pedidos</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>
                    Actualiza tu información personal
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {updateError && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{updateError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input id="email" value={user.email} disabled />
                    <p className="text-sm text-muted-foreground">
                      El correo electrónico no se puede cambiar
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      placeholder="Tu nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleProfileUpdate} 
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Actualizando...' : 'Actualizar perfil'}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Seguridad de la cuenta</CardTitle>
                  <CardDescription>
                    Opciones de seguridad para tu cuenta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Para cambiar tu contraseña, primero cierra sesión y usa la opción de recuperar contraseña.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      logout();
                      navigate('/iniciar-sesion');
                    }}
                  >
                    Cerrar sesión
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Pedidos</CardTitle>
                  <CardDescription>
                    Revisa el estado de tus pedidos recientes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingOrders ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Cargando pedidos...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-lg text-muted-foreground mb-2">
                        No hay pedidos recientes para mostrar.
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        ¡Realiza tu primera compra y aparecerá aquí!
                      </p>
                      <Button 
                        onClick={() => navigate('/')}
                      >
                        Ir a comprar
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Card key={order.id} className="border-l-4 border-l-primary">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-lg">Pedido {order.id}</h3>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <Calendar className="mr-1 h-4 w-4" />
                                  {new Date(order.createdAt).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </div>
                              </div>
                              <div className="text-right">
                                {getStatusBadge(order.status)}
                                <div className="flex items-center text-lg font-bold mt-2">
                                  <DollarSign className="mr-1 h-4 w-4" />
                                  ${order.total.toFixed(2)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm text-muted-foreground">Productos:</h4>
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>{item.quantity}x {item.productName}</span>
                                  <span>${item.total.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                            
                            <Separator className="my-4" />
                            
                            <div className="flex justify-between items-center">
                              <div className="text-sm text-muted-foreground">
                                Estado del pago: <span className="font-medium capitalize">{order.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}