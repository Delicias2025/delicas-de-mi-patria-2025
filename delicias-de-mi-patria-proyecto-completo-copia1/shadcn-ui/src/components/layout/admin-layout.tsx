import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ShoppingCart,
  LayoutDashboard,
  Package,
  Users,
  Settings,
  Menu,
  X,
  Tag,
  BarChart3,
  FileText,
  CreditCard,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/auth-context";
import OrderNotification from "@/components/admin/OrderNotification";

interface AdminLayoutProps {
  children?: ReactNode;
  title?: string;
}

import { Navigate, Outlet } from "react-router-dom";

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  console.log("AdminLayout rendering, user:", user, "path:", location.pathname);

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md space-y-4">
          <h1 className="text-2xl font-bold">Acceso Restringido</h1>
          <p>
            No tienes permisos para acceder al panel de administración.
          </p>
          <Button asChild>
            <Link to="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    );
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
      exact: true,
    },
    {
      name: "Productos",
      href: "/admin/productos",
      icon: <Package className="h-5 w-5" />,
    },
    {
      name: "Categorías",
      href: "/admin/categorias",
      icon: <Tag className="h-5 w-5" />,
    },
    {
      name: "Pedidos",
      href: "/admin/pedidos",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      name: "Usuarios",
      href: "/admin/usuarios",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Promociones",
      href: "/admin/promociones",
      icon: <BarChart3 className="h-5 w-5" />,
    },

    {
      name: "Métodos de Pago",
      href: "/admin/pagos",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      name: "Opciones de Envío",
      href: "/admin/envios",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      name: "Configuración",
      href: "/admin/configuracion",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Admin Panel
          </h2>
        </div>
        <nav className="flex-1 px-4 pb-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-4 py-3 text-sm rounded-md",
                isActive(item.href, item.exact)
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
              {item.name === "Pedidos" && <OrderNotification className="ml-auto" />}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0 pt-10">
          <div className="flex flex-col h-full">
            <div className="p-6">
              <h2 className="text-xl font-bold">Admin Panel</h2>
            </div>
            <nav className="flex-1 px-4 pb-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm rounded-md",
                    isActive(item.href, item.exact)
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                  {item.name === "Pedidos" && <OrderNotification className="ml-auto" />}
                </Link>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 py-4 px-6 md:px-8 flex items-center justify-between">
          <div className="md:hidden">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
          <div className="flex-1 flex justify-end items-center space-x-4">
            <Link to="/" className="text-sm text-gray-600 dark:text-gray-300">
              Ver tienda
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children || <Outlet />}
          {title && !children && (
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">{title}</h1>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}