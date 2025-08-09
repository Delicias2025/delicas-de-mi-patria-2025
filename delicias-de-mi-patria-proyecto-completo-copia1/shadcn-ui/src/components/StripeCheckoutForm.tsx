import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { hybridPaymentService } from '@/lib/hybrid-payment-service';
import { useCart } from '@/context/cart-context';
import { useNavigate } from 'react-router-dom';

interface StripeCheckoutFormProps {
  orderData: any;
  total: number;
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

export function StripeCheckoutForm({ orderData, total }: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { clearCart } = useCart();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error('Error', { description: 'Stripe no está cargado correctamente' });
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error('Error', { description: 'Elemento de tarjeta no encontrado' });
      return;
    }

    setIsProcessing(true);

    try {
      // Create order first
      const { success, orderNumber } = await hybridPaymentService.createPaymentIntent(orderData);

      if (!success) {
        throw new Error('Error creating order');
      }

      // Process payment with Stripe
      const paymentResult = await hybridPaymentService.processStripePayment(
        cardElement, 
        orderData, 
        stripe
      );

      if (paymentResult.success) {
        // Clear cart
        clearCart();
        
        toast.success('¡Pago realizado con éxito!', {
          description: `Tu número de pedido es: ${orderNumber}`
        });
        
        // Show important notice about live payments
        toast.info('⚠️ PAGOS REALES ACTIVADOS', {
          description: 'Este sistema procesa pagos reales con tus claves de Stripe live',
          duration: 5000
        });
        
        navigate('/account');
      }
    } catch (error: any) {
      console.error('Error processing payment:', error);
      toast.error('Error al procesar el pago', {
        description: error.message || 'Por favor, inténtalo de nuevo'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de Pago</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 border rounded-lg">
            <CardElement options={cardElementOptions} />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Pagos seguros procesados por Stripe</p>
            <p>Total a pagar: <strong>${total.toFixed(2)} USD</strong></p>
          </div>

          <Button 
            type="submit" 
            disabled={!stripe || isProcessing} 
            className="w-full"
          >
            {isProcessing ? 'Procesando...' : `Pagar $${total.toFixed(2)}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}