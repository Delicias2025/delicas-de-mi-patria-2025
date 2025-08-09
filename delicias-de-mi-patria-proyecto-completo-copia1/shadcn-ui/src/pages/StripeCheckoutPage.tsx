import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/cart-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { shippingService } from '@/lib/shipping-service';
import { stripePromise } from '@/lib/stripe';
import { Elements } from '@stripe/react-stripe-js';
import { StripeCheckoutForm } from '@/components/StripeCheckoutForm';
import MainLayout from '@/components/layout/main-layout';

export default function StripeCheckoutPage() {
  const navigate = useNavigate();
  const { cart, subtotal, clearCart } = useCart();
  const [shippingCost, setShippingCost] = useState(0);
  const [tax, setTax] = useState(0);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Mexico',
    notes: '',
    sameAsShipping: true,
    billingFirstName: '',
    billingLastName: '',
    billingAddress: '',
    billingApartment: '',
    billingCity: '',
    billingState: '',
    billingPostalCode: '',
    billingCountry: 'Mexico'
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    // Load shipping options
    const loadShippingOptions = async () => {
      try {
        const options = await shippingService.getActiveShippingOptions();
        if (options.length > 0) {
          setShippingCost(options[0].price);
        }
      } catch (error) {
        console.error('Error loading shipping options:', error);
        setShippingCost(0);
      }
    };
    
    loadShippingOptions();
    
    // Calculate tax (simplified - 10% for Mexico)
    if (formData.country === 'Mexico') {
      setTax(subtotal * 0.10);
    } else {
      setTax(0);
    }
  }, [subtotal, formData.country]);

  useEffect(() => {
    // Validate form
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'postalCode', 'country'];
    const isValid = requiredFields.every(field => formData[field as keyof typeof formData]?.toString().trim() !== '');
    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const total = subtotal + shippingCost + tax;

  // Prepare order data for Stripe checkout
  const getOrderData = () => {
    const orderNumber = `ORD-${Date.now()}`;
    
    return {
      orderNumber,
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      shippingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country
      },
      billingAddress: formData.sameAsShipping ? null : {
        firstName: formData.billingFirstName,
        lastName: formData.billingLastName,
        address: formData.billingAddress,
        apartment: formData.billingApartment,
        city: formData.billingCity,
        state: formData.billingState,
        postalCode: formData.billingPostalCode,
        country: formData.billingCountry
      },
      items: cart.items.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image
      })),
      subtotal,
      shippingCost,
      tax,
      total,
      notes: formData.notes
    };
  };

  if (cart.items.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
          <p className="mb-6">No hay productos en tu carrito de compras.</p>
          <Button onClick={() => navigate('/')}>
            Volver a la tienda
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Form */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Información de Envío</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nombre *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Apellido *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Dirección *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="apartment">Apartamento (opcional)</Label>
                  <Input
                    id="apartment"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">Ciudad *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Código Postal *</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="country">País *</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => handleSelectChange('country', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mexico">México</SelectItem>
                      <SelectItem value="USA">Estados Unidos</SelectItem>
                      <SelectItem value="Canada">Canadá</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Notas adicionales</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Instrucciones especiales para la entrega"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Section */}
            {!isFormValid ? (
              <Card>
                <CardHeader>
                  <CardTitle>Método de Pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Por favor, completa toda la información de envío antes de proceder con el pago.</p>
                </CardContent>
              </Card>
            ) : (
              <Elements stripe={stripePromise}>
                <StripeCheckoutForm 
                  orderData={getOrderData()}
                  total={total}
                />
              </Elements>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center py-2">
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.product.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Impuestos</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}