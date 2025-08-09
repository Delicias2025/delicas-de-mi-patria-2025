import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import StripeCheckoutPage from './pages/StripeCheckoutPage';
import NotFound from './pages/NotFound';
import PoliticasPrivacidad from './pages/PoliticasPrivacidad';
import PoliticasEnvio from './pages/PoliticasEnvio';
import CheckoutPage from './pages/CheckoutPage';
import AccountPage from './pages/AccountPage';
import CategoryPage from './pages/CategoryPage';
import PaymentMethodsManagement from './pages/admin/PaymentMethodsManagement';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Politicas from './pages/Politicas';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductPage from './pages/ProductPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import OrderCompletedPage from './pages/OrderCompletedPage';
import AdminLayout from './components/layout/admin-layout';
import ProductsManagement from './pages/admin/ProductsManagement';
import OrdersManagement from './pages/admin/OrdersManagement';
import ContentManagement from './pages/admin/ContentManagement';
import CategoriesManagement from './pages/admin/CategoriesManagement';
import PromotionsManagement from './pages/admin/PromotionsManagement';
import UsersManagement from './pages/admin/UsersManagement';
import ShippingManagement from './pages/admin/ShippingManagement';
import { CartProvider } from './context/cart-context';
import { AuthProvider } from './context/auth-context';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/checkout" element={<StripeCheckoutPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/categorias/:slug" element={<CategoryPage />} />
              <Route path="/productos" element={<CategoryPage />} />
              <Route path="/categorias/todos" element={<CategoryPage />} />
              <Route path="/tienda" element={<CategoryPage />} />
              <Route path="/carrito" element={<CartPage />} />
              <Route path="/producto/:id" element={<ProductPage />} />
              <Route path="/producto-detalle/:id" element={<ProductDetailPage />} />
              <Route path="/pedido-completado" element={<OrderCompletedPage />} />
              <Route path="/nosotros" element={<AboutPage />} />
              <Route path="/contacto" element={<ContactPage />} />
              <Route path="/politicas" element={<Politicas />} />
              <Route path="/politicas-privacidad" element={<PoliticasPrivacidad />} />
              <Route path="/politicas-envio" element={<PoliticasEnvio />} />
              <Route path="/cuenta" element={<AccountPage />} />
              <Route path="/pedidos" element={<AccountPage />} />
              <Route path="/iniciar-sesion" element={<LoginPage />} />
              <Route path="/registro" element={<RegisterPage />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<ProductsManagement />} />
                <Route path="productos" element={<ProductsManagement />} />
                <Route path="pedidos" element={<OrdersManagement />} />
                <Route path="ordenes" element={<OrdersManagement />} />
                <Route path="categorias" element={<CategoriesManagement />} />
                <Route path="promociones" element={<PromotionsManagement />} />
                <Route path="pagos" element={<PaymentMethodsManagement />} />
                <Route path="envios" element={<ShippingManagement />} />
                <Route path="usuarios" element={<UsersManagement />} />
                <Route path="configuracion" element={<ContentManagement />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </HelmetProvider>
  </QueryClientProvider>
);

export default App;