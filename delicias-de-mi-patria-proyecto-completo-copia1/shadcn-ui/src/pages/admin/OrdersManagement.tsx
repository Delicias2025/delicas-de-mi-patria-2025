import { useEffect, useState } from "react";
// Removed AdminLayout import as we're using Outlet now
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Package, TruckIcon, AlertTriangle, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Order } from "@/types";
import { hybridPaymentService } from '@/lib/hybrid-payment-service';
import { useToast } from "@/components/ui/use-toast";

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await hybridPaymentService.getAllOrders();
        setOrders(ordersData);
        setFilteredOrders(ordersData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los pedidos."
        });
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  // Filter orders when search term or status filter changes
  useEffect(() => {
    let result = orders;
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(term) || 
        order.shippingAddress.fullName.toLowerCase().includes(term) ||
        order.shippingAddress.city.toLowerCase().includes(term)
      );
    }
    
    // Sort by date, newest first
    result = [...result].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter]);

  // View order details
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  // Update order status
  const handleUpdateStatus = async (orderId: string, newStatus: Order['status'], trackingNumber?: string) => {
    setProcessingOrder(orderId);
    try {
      const updatedOrder = await hybridPaymentService.updateOrderStatus(orderId, newStatus);
      
      if (updatedOrder) {
        // Update the orders array with the updated order
        setOrders(prevOrders => 
          prevOrders.map(o => o.id === orderId ? updatedOrder : o)
        );
        
        toast({
          title: "Estado actualizado",
          description: `El pedido #${orderId} ha sido actualizado a "${getStatusText(newStatus)}".`
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el estado del pedido."
      });
    } finally {
      setProcessingOrder(null);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status icon
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case "pending":
        return <AlertTriangle className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <TruckIcon className="h-4 w-4" />;
      case "completed":
        return <Check className="h-4 w-4" />;
      case "cancelled":
        return <X className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Get status text
  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "processing":
        return "En proceso";
      case "shipped":
        return "Enviado";
      case "completed":
        return "Completado";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gestión de Pedidos</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-500">Cargando pedidos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Pedidos</h1>
      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar pedidos por ID o cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-full md:w-64">
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="processing">En proceso</SelectItem>
                  <SelectItem value="completed">Completados</SelectItem>
                  <SelectItem value="cancelled">Cancelados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.id}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items.length} producto{order.items.length !== 1 ? "s" : ""}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {order.shippingAddress.fullName}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {order.shippingAddress.city}, {order.shippingAddress.country}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(order.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusBadgeVariant(order.status)}>
                        <span className="flex items-center">
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{getStatusText(order.status)}</span>
                        </span>
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mr-2"
                        onClick={() => handleViewOrder(order)}
                      >
                        Ver detalles
                      </Button>
                      {order.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-200 text-blue-600 hover:text-blue-700 hover:border-blue-300"
                          onClick={() => handleUpdateStatus(order.id, "processing")}
                          disabled={processingOrder === order.id}
                        >
                          Procesar
                        </Button>
                      )}
                      {order.status === "processing" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-purple-200 text-purple-600 hover:text-purple-700 hover:border-purple-300 mr-2"
                            onClick={() => {
                              const trackingNumber = window.prompt("Ingrese el número de seguimiento (opcional):");
                              handleUpdateStatus(order.id, "shipped", trackingNumber || undefined);
                            }}
                            disabled={processingOrder === order.id}
                          >
                            <TruckIcon className="h-4 w-4 mr-1" /> Enviar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-200 text-green-600 hover:text-green-700 hover:border-green-300"
                            onClick={() => handleUpdateStatus(order.id, "completed")}
                            disabled={processingOrder === order.id}
                          >
                            Completar
                          </Button>
                        </>
                      )}
                      
                      {order.status === "shipped" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-200 text-green-600 hover:text-green-700 hover:border-green-300"
                          onClick={() => handleUpdateStatus(order.id, "completed")}
                          disabled={processingOrder === order.id}
                        >
                          Completar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No se encontraron pedidos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalle del Pedido #{selectedOrder.id}</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <Badge className={getStatusBadgeVariant(selectedOrder.status)}>
                    {getStatusText(selectedOrder.status)}
                  </Badge>
                  <div className="text-sm text-gray-500 mt-1">
                    {formatDate(selectedOrder.createdAt)}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-500">Total del pedido</div>
                  <div className="text-lg font-bold">${selectedOrder.total.toFixed(2)}</div>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Productos</h3>
                <div className="bg-gray-50 rounded-md p-4">
                  <ul className="divide-y divide-gray-200">
                    {selectedOrder.items.map((item, index) => (
                      <li key={index} className="py-3 flex justify-between">
                        <div className="flex items-start">
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-3">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{item.product.name}</div>
                            <div className="text-sm text-gray-500">Cantidad: {item.quantity}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div>${item.product.price.toFixed(2)}</div>
                          <div className="text-sm text-gray-500">
                            Subtotal: ${(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-medium mb-2">Información del cliente</h3>
                  <div className="bg-gray-50 rounded-md p-4">
                    <p className="text-gray-800 font-medium">{selectedOrder.shippingAddress.fullName}</p>
                    <p className="text-gray-600">{selectedOrder.shippingAddress.phone}</p>
                  </div>
                </div>
                
                {/* Shipping Address */}
                <div>
                  <h3 className="font-medium mb-2">Dirección de envío</h3>
                  <div className="bg-gray-50 rounded-md p-4">
                    <p className="text-gray-800">{selectedOrder.shippingAddress.address}</p>
                    <p className="text-gray-800">
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}
                    </p>
                    <p className="text-gray-800">{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
                
                {/* Payment Method */}
                <div>
                  <h3 className="font-medium mb-2">Método de pago</h3>
                  <div className="bg-gray-50 rounded-md p-4">
                    <p className="text-gray-800">{selectedOrder.paymentMethod}</p>
                  </div>
                </div>

                {/* Shipping Information (if shipped) */}
                {selectedOrder.status === "shipped" && (
                  <div>
                    <h3 className="font-medium mb-2">Información de envío</h3>
                    <div className="bg-gray-50 rounded-md p-4">
                      <p className="text-gray-800">
                        <span className="font-medium">Fecha de envío:</span>{" "}
                        {selectedOrder.shippedAt ? formatDate(selectedOrder.shippedAt) : "N/A"}
                      </p>
                      {selectedOrder.trackingNumber && (
                        <p className="text-gray-800 mt-1">
                          <span className="font-medium">Número de seguimiento:</span>{" "}
                          {selectedOrder.trackingNumber}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Order Status */}
                <div>
                  <h3 className="font-medium mb-2">Cambiar estado</h3>
                  <div className="bg-gray-50 rounded-md p-4 flex space-x-2">
                    {selectedOrder.status !== "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleUpdateStatus(selectedOrder.id, "pending");
                          setSelectedOrder({...selectedOrder, status: "pending"});
                        }}
                        disabled={processingOrder === selectedOrder.id}
                        className="flex-1"
                      >
                        <AlertTriangle className="h-4 w-4 mr-1" /> Pendiente
                      </Button>
                    )}
                    
                    {selectedOrder.status !== "processing" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleUpdateStatus(selectedOrder.id, "processing");
                          setSelectedOrder({...selectedOrder, status: "processing"});
                        }}
                        disabled={processingOrder === selectedOrder.id}
                        className="flex-1"
                      >
                        <Package className="h-4 w-4 mr-1" /> En proceso
                      </Button>
                    )}
                    
                    {selectedOrder.status !== "shipped" && selectedOrder.status !== "completed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Open shipping dialog with tracking number
                          const trackingNumber = window.prompt("Ingrese el número de seguimiento (opcional):");
                          handleUpdateStatus(selectedOrder.id, "shipped", trackingNumber || undefined);
                          setSelectedOrder({
                            ...selectedOrder, 
                            status: "shipped",
                            shippedAt: new Date().toISOString(),
                            trackingNumber: trackingNumber || undefined
                          });
                        }}
                        disabled={processingOrder === selectedOrder.id}
                        className="flex-1"
                      >
                        <TruckIcon className="h-4 w-4 mr-1" /> Enviado
                      </Button>
                    )}
                    
                    {selectedOrder.status !== "completed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleUpdateStatus(selectedOrder.id, "completed");
                          setSelectedOrder({...selectedOrder, status: "completed"});
                        }}
                        disabled={processingOrder === selectedOrder.id}
                        className="flex-1"
                      >
                        <Check className="h-4 w-4 mr-1" /> Completado
                      </Button>
                    )}
                    
                    {selectedOrder.status !== "cancelled" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleUpdateStatus(selectedOrder.id, "cancelled");
                          setSelectedOrder({...selectedOrder, status: "cancelled"});
                        }}
                        disabled={processingOrder === selectedOrder.id}
                        className="flex-1 text-red-600 border-red-200 hover:text-red-700 hover:border-red-300"
                      >
                        <X className="h-4 w-4 mr-1" /> Cancelado
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}