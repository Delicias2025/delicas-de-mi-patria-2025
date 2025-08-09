import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import { productService } from '@/lib/product-service';
import { categoryService } from '@/lib/category-service';
import { Product, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MainLayout from '@/components/layout/main-layout';
import { useCart } from '@/context/cart-context';
import ProductCard from '@/components/products/product-card';

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProductData = async () => {
      if (!productId) return;
      
      try {
        const [allProducts, allCategories] = await Promise.all([
          productService.getAllProducts(),
          categoryService.getAllCategories()
        ]);

        const foundProduct = allProducts.find(p => String(p.id) === productId);
        if (!foundProduct) {
          setIsLoading(false);
          return;
        }

        setProduct(foundProduct);
        
        // Find the category for this product
        const foundCategory = allCategories.find(c => c.id === foundProduct.categoryId);
        setCategory(foundCategory || null);
        
        // Find related products (same category, excluding current product)
        const related = allProducts
          .filter(p => p.categoryId === foundProduct.categoryId && String(p.id) !== productId)
          .slice(0, 4);
        setRelatedProducts(related);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading product data:', error);
        setIsLoading(false);
      }
    };

    loadProductData();
  }, [productId]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-xl text-gray-500">Cargando producto...</div>
        </div>
      </MainLayout>
    );
  }
  
  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-6">Producto no encontrado</h1>
          <p className="text-gray-600 mb-8">
            Lo sentimos, el producto que estás buscando no existe o ha sido eliminado.
          </p>
          <Button asChild>
            <Link to="/productos">Ver todos los productos</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    setQuantity(q => q + 1);
  };

  const decrementQuantity = () => {
    setQuantity(q => (q > 1 ? q - 1 : 1));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/carrito');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary">Inicio</Link>
          <span>/</span>
          <Link to="/productos" className="hover:text-primary">Productos</Link>
          <span>/</span>
          {category && (
            <>
              <Link to={`/categorias/${category.slug}`} className="hover:text-primary">
                {category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Back button for mobile */}
        <Button
          variant="ghost"
          className="mb-4 p-0 h-auto md:hidden"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>

        {/* Product details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Product image */}
          <div className="bg-white rounded-lg overflow-hidden border">
            <img
              src={product.image || "/images/placeholder.jpg"}
              alt={product.name}
              className="w-full h-auto object-contain aspect-square"
            />
          </div>

          {/* Product info */}
          <div className="space-y-6">
            <div>
              {category && (
                <Link 
                  to={`/categorias/${category.slug}`}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  {category.name}
                </Link>
              )}
              <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
              <p className="text-2xl font-bold text-primary mt-4">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-2">Descripción</h2>
              <p className="text-gray-600">{product.description || 'Sin descripción disponible'}</p>
            </div>

            {/* Quantity selector */}
            <div className="pt-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-r-none"
                    onClick={decrementQuantity}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-16 text-center rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-l-none"
                    onClick={incrementQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Añadir al Carrito
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}