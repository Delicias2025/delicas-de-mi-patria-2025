import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import MainLayout from '@/components/layout/main-layout';
import { useCart } from '@/context/cart-context';
import { getActiveShippingOptions } from '@/lib/shipping-service';
import { useAuth } from '@/context/auth-context';
import { promotionService } from '@/lib/promotion-service';
import { paymentService } from '@/lib/payment-service';
import { processPayment, PaymentData, initializeStripe } from '@/lib/checkout-payment-service';
import { processRealStripePayment, validateStripeConfig } from '@/lib/real-stripe-service';
import { taxService } from '@/lib/tax-service';
import { createOrder } from '@/lib/orders-service';
import { PaymentMethod, PaymentProcessorData } from '@/types';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, subtotal, shippingCost, total, clearCart, removeFromCart, updateQuantity, setShippingMethod } = useCart();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [appliedPromotion, setAppliedPromotion] = useState<{name: string, code: string, discountType: string, discountAmount: number} | null>(null);
  const [taxAmount, setTaxAmount] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [dynamicShippingOptions, setDynamicShippingOptions] = useState<Array<{id: string, name: string, price: number, estimatedDays: string}>>([]);
  
  const getStatesForCountry = (country: string) => {
    const statesByCountry: Record<string, string[]> = {
      Mexico: [
        'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua',
        'Coahuila', 'Colima', 'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'México',
        'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro',
        'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas',
        'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas', 'Ciudad de México'
      ],
      USA: [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
        'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
        'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
        'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
        'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
        'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
        'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
      ],
      Canada: [
        'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
        'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
        'Quebec', 'Saskatchewan', 'Yukon'
      ],
      Colombia: [
        'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá', 'Caldas', 'Caquetá',
        'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare',
        'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo',
        'Quindío', 'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima',
        'Valle del Cauca', 'Vaupés', 'Vichada', 'Bogotá D.C.'
      ]
    };
    
    return statesByCountry[country] || [];
  };
  
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    state: '',
    country: 'Mexico',
    postalCode: '',
    paymentMethodId: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    paypalEmail: '',
    paypalPassword: '',
    notes: ''
  });

  useEffect(() => {
    // Initialize Stripe when component mounts
    initializeStripe();
    
    // Load available payment methods
    const loadPaymentMethods = async () => {
      try {
        // Validate Stripe configuration
        if (!validateStripeConfig()) {
          console.warn('⚠️ Stripe not properly configured');
          toast({
            title: 'Configuración de pagos',
            description: 'Los métodos de pago están en modo demo',
          });
        }
        
        const methods = await paymentService.getAllPaymentMethods();
        setPaymentMethods(methods);
        
        // Set a default payment method if available
        if (methods.length > 0) {
          setFormData(prev => ({ ...prev, paymentMethodId: methods[0].id }));
          setSelectedPaymentMethod(methods[0]);
        }
      } catch (error) {
        console.error('Error loading payment methods:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los métodos de pago',
          variant: 'destructive',
        });
      }
    };
    
    // Load dynamic shipping options and update cart context
    const loadShippingOptions = async () => {
      try {
        const options = await getActiveShippingOptions();
        // Map the options to include all necessary fields
        const mappedOptions = options.map(option => ({
          id: option.id,
          name: option.name,
          price: option.price,
          estimatedDays: option.estimatedDays
        }));
        setDynamicShippingOptions(mappedOptions);
        console.log('✅ Loaded dynamic shipping options:', mappedOptions);
        
        // Update cart context with new shipping options
        if (mappedOptions.length > 0 && cart.updateShippingOptions) {
          cart.updateShippingOptions(mappedOptions);
        }
        
        // Force refresh of cart context shipping data
        window.dispatchEvent(new CustomEvent('shippingOptionsUpdated'));
      } catch (error) {
        console.error('❌ Error loading shipping options:', error);
      }
    };
    
    loadPaymentMethods();
    loadShippingOptions();
  }, [toast]);

  // Calculate taxes when state changes
  useEffect(() => {
    if (formData.state) {
      const rate = taxService.getTaxRate(formData.state);
      setTaxRate(rate);
      const calculatedTax = taxService.calculateTax(formData.state, subtotal);
      setTaxAmount(calculatedTax);
    } else {
      setTaxRate(0);
      setTaxAmount(0);
    }
  }, [formData.state, subtotal]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Reset state when country changes
    if (name === 'country') {
      setFormData((prev) => ({ ...prev, state: '' }));
    }
    
    // If payment method changed, update the selected payment method
    if (name === 'paymentMethodId') {
      const method = paymentMethods.find(m => m.id === value) || null;
      setSelectedPaymentMethod(method);
    }
  };

  // Check for registration promotion
  useEffect(() => {
    const checkRegistrationPromotion = async () => {
      if (user) {
        const registrationPromoData = localStorage.getItem('registrationPromotion');
        if (registrationPromoData) {
          const promoData = JSON.parse(registrationPromoData);
          // Check if this promo belongs to the current user
          if (promoData.userId === user.id) {
            setDiscount(promoData.discountAmount);
            setAppliedPromotion(promoData.promotion);
            toast({
              title: "¡Promoción aplicada!",
              description: `Se aplicó un descuento de $${promoData.discountAmount} por tu registro.`,
            });
          }
        }
      }
    };

    checkRegistrationPromotion();
  }, [user, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!selectedPaymentMethod) {
      toast({
        title: "Error de pago",
        description: "Por favor selecciona un método de pago válido",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Validate payment method and form data
      if (selectedPaymentMethod.processor === 'stripe') {
        // Validate credit card fields for Stripe
        if (!formData.cardNumber || !formData.cardName || !formData.expiry || !formData.cvv) {
          toast({
            title: "Error de pago",
            description: "Por favor completa todos los campos de la tarjeta de crédito",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      } else if (selectedPaymentMethod.processor === 'paypal') {
        // Validate PayPal credentials
        if (!formData.paypalEmail || !formData.paypalPassword) {
          toast({
            title: "Error de pago",
            description: "Por favor completa todos los campos de PayPal",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.paypalEmail)) {
          toast({
            title: "Error de pago",
            description: "Por favor ingresa un email válido de PayPal",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        
        // Simulate PayPal authentication
        toast({
          title: "Procesando con PayPal...",
          description: "Verificando tus credenciales de PayPal",
        });
        
        // Simulate PayPal processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate PayPal authentication success
        toast({
          title: "PayPal autenticado",
          description: "Procesando tu pago...",
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Process payment details
      const paymentDetails = selectedPaymentMethod.processor === 'stripe' ? {
        cardNumber: formData.cardNumber,
        cardName: formData.cardName,
        expiry: formData.expiry,
        cvv: formData.cvv
      } : {
        paypalEmail: formData.paypalEmail,
        paypalPassword: '****' // Don't store actual password
      };
      
      // Calculate final total with tax and discounts
      const finalTotal = subtotal + shippingCost + taxAmount - discount;
      
      // Process REAL payment with Stripe - ONLY create order if payment is successful
      let paymentResult;
      try {
        if (selectedPaymentMethod.processor === 'stripe' && validateStripeConfig()) {
          // Use real Stripe processing
          paymentResult = await processRealStripePayment(
            finalTotal,
            'usd',
            paymentDetails
          );
          
          toast({
            title: "💳 Pago real procesado",
            description: `Transacción: ${paymentResult.transactionId}`,
          });
        } else {
          // Fallback to mock processing
          paymentResult = await paymentService.processPayment(
            selectedPaymentMethod.id,
            finalTotal,
            'usd',
            paymentDetails
          );
        }
        
        // Check if payment was actually successful
        if (!paymentResult || paymentResult.status !== 'completed') {
          throw new Error('El pago no se pudo completar. Por favor intenta nuevamente.');
        }
      } catch (paymentError) {
        console.error('Payment failed:', paymentError);
        throw new Error('Error al procesar el pago: ' + (paymentError instanceof Error ? paymentError.message : 'Error desconocido'));
      }
      
      // Create shipping address object from form data
      const shippingAddress = {
        fullName: `${formData.firstName} ${formData.lastName}`,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country || 'Mexico',
        phone: formData.phone
      };

      // Create the order ONLY after successful payment
      const newOrder = await createOrder(
        user.id,
        cart.items,
        shippingAddress,
        selectedPaymentMethod.id,
        subtotal,
        shippingCost,
        taxAmount,
        discount,
        paymentResult
      );
      
      console.log('Order created successfully after payment:', newOrder.id, 'Payment ID:', paymentResult.transactionId);
      
      // Remove used promotion if applied
      if (appliedPromotion && user) {
        localStorage.removeItem('registrationPromotion');
      }
      
      // Store the order ID for the completion page
      localStorage.setItem('lastOrderId', newOrder.id);
      
      toast({
        title: "¡Pago procesado exitosamente!",
        description: `Tu pedido #${newOrder.id} ha sido confirmado. Recibirás un correo con los detalles.`,
      });
      
      clearCart();
      navigate('/pedido-completado');
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Error de pago",
        description: "Hubo un problema al procesar tu pago. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate final total
  const finalTotal = total + taxAmount - discount;

  // Check if cart is empty, but don't redirect to prevent infinite loop
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Información de Envío</CardTitle>
                  <CardDescription>
                    Ingresa tus datos para el envío de tu pedido
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección Completa</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Ej: Av. Juárez #123, Col. Centro"
                      required
                    />
                    <div className="text-xs text-gray-500">
                      Incluye calle, número, colonia y referencias
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <Select
                      value={formData.country || 'Mexico'}
                      onValueChange={(value) => handleSelectChange('country', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar país" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mexico">México</SelectItem>
                        <SelectItem value="USA">Estados Unidos</SelectItem>
                        <SelectItem value="Canada">Canadá</SelectItem>
                        <SelectItem value="Colombia">Colombia</SelectItem>
                        <SelectItem value="Argentina">Argentina</SelectItem>
                        <SelectItem value="Chile">Chile</SelectItem>
                        <SelectItem value="Peru">Perú</SelectItem>
                        <SelectItem value="Spain">España</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Select
                        value={formData.state}
                        onValueChange={(value) => handleSelectChange('state', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {getStatesForCountry(formData.country || 'Mexico').map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Código Postal</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas adicionales (opcional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Instrucciones especiales para la entrega, etc."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Método de Pago</CardTitle>
                  <CardDescription>
                    Selecciona tu método de pago preferido
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {paymentMethods.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No hay métodos de pago disponibles</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {paymentMethods.map((method) => (
                          <div 
                            key={method.id}
                            className={`flex items-start p-4 rounded-lg border-2 cursor-pointer ${
                              formData.paymentMethodId === method.id 
                                ? 'border-primary bg-primary/5' 
                                : 'border-gray-200'
                            }`}
                            onClick={() => handleSelectChange('paymentMethodId', method.id)}
                          >
                            <div className="flex-1">
                              <div className="flex items-center">
                                {method.processor === 'stripe' ? (
                                  <CreditCard className="w-5 h-5 mr-2" />
                                ) : (
                                  <div className="w-5 h-5 mr-2 flex items-center justify-center font-bold text-blue-500">P</div>
                                )}
                                <h3 className="font-medium">{method.name}</h3>
                                {formData.paymentMethodId === method.id && (
                                  <Check className="w-5 h-5 ml-2 text-primary" />
                                )}
                              </div>
                              {method.description && (
                                <p className="text-sm text-gray-500 mt-1">{method.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {selectedPaymentMethod?.processor === 'stripe' && (
                        <div className="space-y-4 mt-6 p-4 rounded-lg border">
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                            <Input
                              id="cardNumber"
                              name="cardNumber"
                              value={formData.cardNumber}
                              onChange={handleChange}
                              placeholder="0000 0000 0000 0000"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                            <Input
                              id="cardName"
                              name="cardName"
                              value={formData.cardName}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiry">Fecha de Expiración</Label>
                              <Input
                                id="expiry"
                                name="expiry"
                                value={formData.expiry}
                                onChange={handleChange}
                                placeholder="MM/YY"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv">CVV</Label>
                              <Input
                                id="cvv"
                                name="cvv"
                                value={formData.cvv}
                                onChange={handleChange}
                                placeholder="123"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedPaymentMethod?.processor === 'paypal' && (
                        <div className="space-y-4 mt-6 p-4 rounded-lg border bg-blue-50">
                          <div className="flex items-center justify-center mb-4">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">P</div>
                            <h3 className="text-lg font-semibold text-blue-800">Inicia sesión en PayPal</h3>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="paypalEmail" className="text-blue-800">Email de PayPal</Label>
                              <Input
                                id="paypalEmail"
                                name="paypalEmail"
                                type="email"
                                value={formData.paypalEmail}
                                onChange={handleChange}
                                placeholder="tu@email.com"
                                className="border-blue-200 focus:border-blue-500"
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="paypalPassword" className="text-blue-800">Contraseña de PayPal</Label>
                              <Input
                                id="paypalPassword"
                                name="paypalPassword"
                                type="password"
                                value={formData.paypalPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="border-blue-200 focus:border-blue-500"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="text-center mt-4 p-3 bg-blue-100 rounded">
                            <p className="text-sm text-blue-700">
                              🔒 Tus datos de PayPal están protegidos con cifrado de extremo a extremo
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting || paymentMethods.length === 0}
                >
                  {isSubmitting ? "Procesando..." : "Confirmar Pedido"}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Resumen de tu Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Products */}
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={item.product.id} className="p-3 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-md border">
                          <img
                            src={item.product.image || '/images/placeholder.jpg'}
                            alt={item.product.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm sm:text-base truncate">{item.product.name}</div>
                          <div className="text-xs sm:text-sm text-gray-500 mb-2">
                            ${item.product.price.toFixed(2)} cada uno
                          </div>
                          
                          {/* Mobile: Super small buttons, Desktop: normal */}
                          <div className="flex items-center gap-1 mb-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                              className="w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center border rounded text-xs bg-white hover:bg-gray-50"
                            >
                              -
                            </button>
                            <span className="text-xs font-medium px-1 min-w-[12px] text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center border rounded text-xs bg-white hover:bg-gray-50"
                            >
                              +
                            </button>
                          </div>
                          
                          <button
                            onClick={() => {
                              console.log('🗑️ Removing product from checkout:', item.product.id);
                              removeFromCart(item.product.id);
                            }}
                            className="text-red-500 hover:text-red-700 text-xs underline block"
                          >
                            Eliminar
                          </button>
                          

                        </div>
                        
                        <div className="text-right">
                          <div className="font-medium text-sm sm:text-base">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  {taxAmount > 0 && (
                    <div className="flex justify-between">
                      <span>Impuestos ({(taxRate * 100).toFixed(2)}%)</span>
                      <span className="font-medium">${taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {/* Selectable Shipping Options */}
                  <div className="border-t pt-4">
                    <div className="text-sm font-medium mb-3">Seleccionar Método de Envío:</div>
                    {dynamicShippingOptions.length > 0 ? (
                      <div className="space-y-2">
                        {dynamicShippingOptions.map((option) => (
                          <label key={option.id} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="shippingMethod"
                                value={option.id}
                                checked={cart.shippingMethod === option.id}
                                onChange={() => setShippingMethod(option.id)}
                                className="mr-3"
                              />
                              <div>
                                <div className="font-medium text-sm">{option.name}</div>
                                <div className="text-xs text-gray-500">Entrega estimada: {option.estimatedDays || '3-5 días'}</div>
                              </div>
                            </div>
                            <div className="font-medium">
                              {option.price === 0 ? 'Gratis' : `$${option.price.toFixed(2)}`}
                            </div>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="flex justify-between p-3 border rounded-lg">
                        <span>Envío Estándar</span>
                        <span className="font-medium">
                          {shippingCost === 0 ? 'Gratis' : `$${shippingCost.toFixed(2)}`}
                        </span>
                      </div>
                    )}
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2 font-bold">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                  {appliedPromotion && (
                    <div className="text-sm text-green-600 mt-2">
                      Promoción aplicada: {appliedPromotion.name}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}