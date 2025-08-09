import { useEffect, useRef } from 'react';
import { initializePayPal, PAYPAL_CONFIG } from '@/lib/paypal-config';

interface PayPalButtonProps {
  amount: number;
  currency?: string;
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
  onCancel?: () => void;
}

export default function PayPalButton({
  amount,
  currency = 'USD',
  onSuccess,
  onError,
  onCancel
}: PayPalButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderPayPalButton = async () => {
      try {
        const paypal = await initializePayPal();
        
        if (!paypal || !paypalRef.current) {
          return;
        }

        // Clear any existing PayPal buttons
        paypalRef.current.innerHTML = '';

        paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  currency_code: currency,
                  value: amount.toFixed(2)
                }
              }]
            });
          },
          onApprove: async (data: any, actions: any) => {
            try {
              const details = await actions.order.capture();
              onSuccess(details);
            } catch (error) {
              onError(error);
            }
          },
          onError: (error: any) => {
            console.error('PayPal error:', error);
            onError(error);
          },
          onCancel: (data: any) => {
            console.log('PayPal payment cancelled:', data);
            if (onCancel) onCancel();
          },
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal'
          }
        }).render(paypalRef.current);

      } catch (error) {
        console.error('Error rendering PayPal button:', error);
        onError(error);
      }
    };

    renderPayPalButton();
  }, [amount, currency, onSuccess, onError, onCancel]);

  return (
    <div className="paypal-button-container">
      <div ref={paypalRef} />
    </div>
  );
}