import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { categoryService } from '@/lib/category-service';
import { Category } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const { cart } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const allCategories = await categoryService.getAllCategories();
        setCategories(allCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  const totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold text-primary">DELICIAS DE MI PATRIA</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-primary">
            Inicio
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="link" className="text-sm font-medium p-0">
                Categorías
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              {categories.map((category) => (
                <DropdownMenuItem key={category.id}>
                  <Link 
                    to={`/categorias/${category.slug}`}
                    className="w-full"
                  >
                    {category.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/nosotros" className="text-sm font-medium hover:text-primary">
            Nosotros
          </Link>
          
          <Link to="/contacto" className="text-sm font-medium hover:text-primary">
            Contacto
          </Link>
        </nav>

        {/* Search, Cart, and Account */}
        <div className="hidden md:flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="Buscar productos..."
              className="w-[200px] lg:w-[300px] pr-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              aria-label="Buscar"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAuthenticated ? (
                <>
                  <DropdownMenuItem disabled className="font-medium">
                    {user?.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/cuenta" className="w-full">
                      Mi Cuenta
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/pedidos" className="w-full">
                      Mis Pedidos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logout()}>
                    Cerrar Sesión
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem>
                    <Link to="/iniciar-sesion" className="w-full">
                      Iniciar Sesión
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/registro" className="w-full">
                      Crear Cuenta
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate('/carrito')}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-2">
          {/* Mobile Login/Register Icons - only show when NOT authenticated */}
          {!isAuthenticated && (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/iniciar-sesion">
                  <LogIn className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/registro">
                  <UserPlus className="h-4 w-4" />
                </Link>
              </Button>
            </>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate('/carrito')}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t p-4">
          <form onSubmit={handleSearch} className="relative mb-4">
            <Input
              type="search"
              placeholder="Buscar productos..."
              className="w-full pr-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              aria-label="Buscar"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
          
          <nav className="flex flex-col space-y-4">
            <Link
              to="/"
              className="text-sm font-medium p-2 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            
            <div className="text-sm font-medium p-2">
              Categorías
              <div className="pl-4 mt-2 flex flex-col space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/categorias/${category.slug}`}
                    className="text-sm p-1 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <Link
              to="/nosotros"
              className="text-sm font-medium p-2 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Nosotros
            </Link>
            
            <Link
              to="/contacto"
              className="text-sm font-medium p-2 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/cuenta"
                  className="text-sm font-medium p-2 hover:bg-gray-100 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mi Cuenta
                </Link>
                <Link
                  to="/pedidos"
                  className="text-sm font-medium p-2 hover:bg-gray-100 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mis Pedidos
                </Link>
                <button
                  className="text-sm font-medium text-left p-2 hover:bg-gray-100 rounded"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/iniciar-sesion"
                  className="text-sm font-medium p-2 hover:bg-gray-100 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className="text-sm font-medium p-2 hover:bg-gray-100 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Crear Cuenta
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}