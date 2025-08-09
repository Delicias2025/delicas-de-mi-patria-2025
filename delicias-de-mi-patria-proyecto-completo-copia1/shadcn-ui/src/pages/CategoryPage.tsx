import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { productService } from '@/lib/product-service';
import { categoryService } from '@/lib/category-service';
import MainLayout from '@/components/layout/main-layout';
import ProductCard from '@/components/products/product-card';
import { Product, Category } from '@/types';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  
  // Load dynamic data from services
  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        console.log('CategoryPage Debug - slug:', slug);
        console.log('CategoryPage Debug - typeof slug:', typeof slug);

        // Always reset error state first
        setError(null);
        
        const [allProducts, allCategories] = await Promise.all([
          productService.getAllProducts(),
          categoryService.getAllCategories()
        ]);

        console.log('CategoryPage Debug - products count:', allProducts.length);
        console.log('CategoryPage Debug - categories count:', allCategories.length);
        
        // Special case for "todos" - show all products (handle even if slug is undefined)
        if (slug === "todos" || (!slug && window.location.pathname === "/categorias/todos")) {
          console.log('CategoryPage Debug - showing all products for todos');
          setCategory({ 
            id: "todos", 
            name: "Todos los Productos", 
            slug: "todos", 
            description: "Explora todos nuestros productos disponibles",
            image: ""
          });
          setCategoryProducts(allProducts);
          setIsLoading(false);
          return;
        }

        // Check for empty slug after handling "todos"
        if (!slug) {
          setError('URL inválida');
          setIsLoading(false);
          return;
        }

        // Try to find by slug first
        let foundCategory = allCategories.find(c => c.slug === slug);
        
        // If not found, try by ID (convert to number if needed)
        if (!foundCategory && !isNaN(Number(slug))) {
          foundCategory = allCategories.find(c => c.id === Number(slug));
        }
        
        if (!foundCategory) {
          setError('Categoría no encontrada');
          setIsLoading(false);
          return;
        }

        setCategory(foundCategory);
        
        // Filter products belonging to this category
        const filteredProducts = allProducts.filter(p => {
          // Handle both string and number comparison for categoryId
          return p.categoryId == foundCategory?.id || p.categoryId === foundCategory?.id;
        });
        setCategoryProducts(filteredProducts);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading category:', err);
        setError('Ha ocurrido un error al cargar la categoría');
        setIsLoading(false);
      }
    };

    loadCategoryData();
  }, [slug]);

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="text-center py-8">
            <button 
              onClick={() => window.history.back()}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
            >
              Volver atrás
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-pulse">
            <div className="h-8 w-1/3 bg-gray-200 rounded mx-auto mb-4"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded mx-auto mb-12"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-64 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!category) {
    return <Navigate to="/productos" />;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {category.description}
          </p>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-medium mb-2">No se encontraron productos</h2>
            <p className="text-gray-500">
              Actualmente no hay productos disponibles en esta categoría
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}