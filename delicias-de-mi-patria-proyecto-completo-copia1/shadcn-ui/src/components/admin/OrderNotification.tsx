import { useEffect, useState } from "react";
import { Order } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BellIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function OrderNotification() {
  const [hasNewOrders, setHasNewOrders] = useState(false);
  const [notifications, setNotifications] = useState<Order[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Add listener for new orders
    const handleNewOrder = (event: Event) => {
      const order = (event as CustomEvent<Order>).detail;
      
      // Add to notifications
      setNotifications(prev => [order, ...prev]);
      setHasNewOrders(true);
      
      // Show toast notification
      toast.success("¡Nueva orden recibida!", {
        description: `Orden #${order.id} por $${order.total.toFixed(2)}`,
        action: {
          label: "Ver detalles",
          onClick: () => navigate(`/admin/orders/${order.id}`),
        },
      });
    };
    
    // Register event listener
    window.addEventListener('newOrder', handleNewOrder as EventListener);
    
    // Clean up
    return () => {
      window.removeEventListener('newOrder', handleNewOrder as EventListener);
    };
  }, [navigate]);
  
  const handleClearNotifications = () => {
    setNotifications([]);
    setHasNewOrders(false);
  };
  
  const viewOrder = (orderId: string) => {
    navigate(`/admin/orders/${orderId}`);
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          {hasNewOrders && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative text-white text-xs font-bold">
                {notifications.length}
              </span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Notificaciones</h3>
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearNotifications}
                className="h-auto py-1 px-2 text-xs"
              >
                Borrar todo
              </Button>
            )}
          </div>
        </div>
        
        <div className="max-h-80 overflow-auto">
          {notifications.length > 0 ? (
            notifications.map((order) => (
              <div
                key={order.id}
                className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={() => viewOrder(order.id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-sm">Orden #{order.id}</h4>
                  <Badge
                    variant={
                      order.status === "completed"
                        ? "default"
                        : order.status === "processing"
                        ? "outline"
                        : "secondary"
                    }
                    className={cn(
                      "ml-2",
                      order.status === "pending" && "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
                      order.status === "processing" && "bg-blue-100 text-blue-800 hover:bg-blue-200",
                      order.status === "shipped" && "bg-purple-100 text-purple-800 hover:bg-purple-200",
                      order.status === "completed" && "bg-green-100 text-green-800 hover:bg-green-200",
                      order.status === "cancelled" && "bg-red-100 text-red-800 hover:bg-red-200"
                    )}
                  >
                    {order.status === "pending"
                      ? "Pendiente"
                      : order.status === "processing"
                      ? "En proceso"
                      : order.status === "shipped"
                      ? "Enviado"
                      : order.status === "completed"
                      ? "Completada"
                      : "Cancelada"}
                  </Badge>
                </div>
                
                <div className="text-xs text-gray-500 mb-2">
                  {new Date(order.createdAt).toLocaleString()}
                </div>
                
                <div className="flex justify-between">
                  <div className="text-sm">
                    <span className="text-gray-800 font-medium">Total:</span>{" "}
                    ${order.total.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.items.length} producto{order.items.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No hay notificaciones nuevas
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default OrderNotification;