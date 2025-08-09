import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { categoryService } from '@/lib/category-service';
import { Category } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const allCategories = await categoryService.getAllCategories();
        setCategories(allCategories);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading categories:', error);
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nuestras Categorías</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cargando categorías...
            </p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nuestras Categorías</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explora nuestra variedad de productos clasificados por categoría
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link key={category.id} to={`/categorias/${category.slug}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="aspect-square relative">
                  <img 
                    src={category.image || "/images/placeholder.jpg"} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-medium text-lg">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
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