import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import MainLayout from '@/components/layout/main-layout';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { shippingOptions } from '@/data/products';
import { ShippingMethod } from '@/types';

export default function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    setShippingMethod,
    subtotal,
    shippingCost,
    total
  } = useCart();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    updateQuantity(productId, quantity);
  };

  const handleShippingMethodChange = (value: string) => {
    setShippingMethod(value as ShippingMethod);
  };

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/registro', { state: { from: '/checkout' } });
    }
  };

  const isEmpty = cart.items.length === 0;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Carrito de Compra</h1>

        {isEmpty ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-300" />
            <h2 className="text-2xl font-medium mt-4 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-500 mb-8">
              ¡Agrega productos a tu carrito para comenzar a comprar!
            </p>
            <Button asChild>
              <Link to="/categorias/todos">Ver Productos</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 text-gray-600 text-sm border-b">
                    <tr>
                      <th className="px-6 py-4 text-left font-medium">Producto</th>
                      <th className="px-6 py-4 text-center font-medium">Cantidad</th>
                      <th className="px-6 py-4 text-right font-medium">Precio</th>
                      <th className="px-6 py-4 text-right font-medium">Subtotal</th>
                      <th className="px-6 py-4 text-center font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {cart.items.map((item) => (
                      <tr key={item.product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                              <img
                                src={item.product.image || '/images/placeholder.jpg'}
                                alt={item.product.name}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="ml-4">
                              <Link 
                                to={`/producto/${item.product.id}`}
                                className="font-medium text-gray-900 hover:text-primary"
                              >
                                {item.product.name}
                              </Link>
                              <div className="text-sm text-gray-500 mt-1">
                                ${item.product.price.toFixed(2)} / unidad
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                              className="p-1 rounded-full hover:bg-gray-200"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <Input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val)) {
                                  handleQuantityChange(item.product.id, val);
                                }
                              }}
                              className="w-16 mx-2 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                              onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                              className="p-1 rounded-full hover:bg-gray-200"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          ${item.product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right font-medium">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                            aria-label="Eliminar producto"
                            title="Eliminar producto"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cart Actions */}
              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  asChild
                >
                  <Link to="/categorias/todos">Continuar Comprando</Link>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={clearCart}
                >
                  Vaciar Carrito
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-6">Resumen de Compra</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {/* Shipping Options */}
                  <div className="border-t pt-4">
                    <div className="mb-2">Método de Envío</div>
                    <Select
                      value={cart.shippingMethod}
                      onValueChange={handleShippingMethodChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un método de envío" />
                      </SelectTrigger>
                      <SelectContent>
                        {shippingOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            <div>
                              <div className="font-medium">{option.name}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {option.price === 0 ? 'Gratis' : `$${option.price.toFixed(2)}`} - {option.estimatedDelivery}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-between border-t pt-4">
                    <span>Costo de envío</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? 'Gratis' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between border-t border-dashed pt-4 font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                >
                  {isAuthenticated ? "Proceder al Pago" : "Crear Cuenta para Comprar"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}