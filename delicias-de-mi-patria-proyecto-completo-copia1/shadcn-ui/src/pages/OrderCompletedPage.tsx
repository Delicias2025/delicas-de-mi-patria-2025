import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/main-layout';
import { getOrderById } from '@/lib/orders-service';
import { Order } from '@/types';

export default function OrderCompletedPage() {
  const [order, setOrder] = useState<Order | null>(null);
  
  useEffect(() => {
    const loadOrder = async () => {
      const lastOrderId = localStorage.getItem('lastOrderId');
      if (lastOrderId) {
        try {
          const orderData = await getOrderById(lastOrderId);
          setOrder(orderData);
          // Clean up the stored order ID
          localStorage.removeItem('lastOrderId');
        } catch (error) {
          console.error('Error loading order:', error);
        }
      }
    };
    
    loadOrder();
  }, []);

  const orderNumber = order?.id || `ORD-${Math.floor(Math.random() * 100000)}`;
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="rounded-full bg-green-100 p-3 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">¡Gracias por tu compra!</h1>
          
          <p className="text-xl mb-2">
            Tu pedido ha sido recibido y está siendo procesado.
          </p>
          
          <p className="text-gray-600 mb-8">
            Te hemos enviado un correo con los detalles de tu pedido.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <p className="text-gray-600 mb-2">Número de Pedido</p>
            <p className="text-2xl font-bold">{orderNumber}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to="/cuenta">Ver mis pedidos</Link>
            </Button>
            <Button asChild>
              <Link to="/">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continuar comprando
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}