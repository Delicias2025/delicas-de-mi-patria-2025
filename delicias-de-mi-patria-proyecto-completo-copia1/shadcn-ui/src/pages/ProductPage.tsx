import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, AlertCircle } from 'lucide-react';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/cart-context';
import { productService } from '@/lib/product-service';
import { categoryService } from '@/lib/category-service';
import { Product, Category } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProductData = async () => {
      if (!id) {
        setError('URL inválida');
        setIsLoading(false);
        return;
      }

      try {
        const [allProducts, allCategories] = await Promise.all([
          productService.getAllProducts(),
          categoryService.getAllCategories()
        ]);

        setCategories(allCategories);

        const productId = parseInt(id);
        const foundProduct = allProducts.find(p => p.id === productId);
        
        if (!foundProduct) {
          setError('Producto no encontrado');
          setIsLoading(false);
          return;
        }

        setProduct(foundProduct);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Ha ocurrido un error al cargar el producto');
        setIsLoading(false);
      }
    };

    loadProductData();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="text-center py-8">
            <Button 
              onClick={() => window.history.back()}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
            >
              Volver atrás
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2 bg-gray-200 aspect-square rounded"></div>
              <div className="md:w-1/2 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4 mt-4"></div>
                <div className="h-24 bg-gray-200 rounded w-full mt-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full mt-8"></div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-lg overflow-hidden border">
            <img
              src={product.image || "/images/placeholder.jpg"}
              alt={product.name}
              className="w-full h-auto object-cover aspect-square"
            />
          </div>

          <div className="flex flex-col space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <Link 
                to={`/categorias/${categories.find(c => c.id === product.categoryId)?.slug || product.categoryId}`} 
                className="text-sm text-blue-500 hover:underline"
              >
                {categories.find(c => c.id === product.categoryId)?.name || 'Categoría'}
              </Link>
            </div>

            <p className="text-3xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </p>

            <Separator />

            <div>
              <p className="text-gray-700 mb-6">{product.description}</p>
              
              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center">
                  <label htmlFor="quantity" className="mr-3 font-medium">
                    Cantidad:
                  </label>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    max={product.stock || 99}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-20 text-center"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {product.stock > 0 
                    ? `${product.stock} disponibles` 
                    : 'Agotado'}
                </p>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full mt-6 gap-2"
                size="lg"
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="h-5 w-5" />
                Añadir al Carrito
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}