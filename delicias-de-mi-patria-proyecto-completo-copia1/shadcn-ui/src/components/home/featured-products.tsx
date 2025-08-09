import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { productService } from '@/lib/product-service';
import { Product } from '@/types';
import ProductCard from '@/components/products/product-card';

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const allProducts = await productService.getAllProducts();
        const featured = allProducts.filter(product => product.featured);
        console.log('📍 Featured products loaded:', featured.length);
        console.log('📍 Featured products:', featured.map(p => ({ id: p.id, name: p.name, featured: p.featured })));
        setFeaturedProducts(featured);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading featured products:', error);
        setIsLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-xl text-gray-500">Cargando productos destacados...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Productos Destacados</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre nuestros productos más populares y mejor valorados
          </p>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay productos destacados disponibles</p>
          </div>
        )}
        
        <div className="text-center mt-10">
          <Link 
            to="/categorias/todos" 
            className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium"
          >
            Ver todos los productos
          </Link>
        </div>
      </div>
    </section>
  );
}