import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layout/main-layout';
import ProductCard from '@/components/products/product-card';
import { productService } from '@/lib/product-service';
import { categoryService } from '@/lib/category-service';
import { Product, Category } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortOrder, setSortOrder] = useState<string>('featured');
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [products, cats] = await Promise.all([
          productService.getAllProducts(),
          categoryService.getAllCategories()
        ]);
        setAllProducts(products);
        setCategories(cats);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (allProducts.length === 0) return;

    let result = [...allProducts];

    // Filter by category if not "all"
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(product => String(product.categoryId) === selectedCategory);
    }

    // Filter by search query if provided
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query)
      );
    }

    // Sort products
    if (sortOrder === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default: featured first
      result.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
    }

    setFilteredProducts(result);
  }, [selectedCategory, sortOrder, searchQuery, allProducts]);

  // Calculate title based on current filters
  const getPageTitle = () => {
    if (searchQuery) {
      return `Resultados para "${searchQuery}"`;
    }
    
    if (selectedCategory !== 'all') {
      const category = categories.find(c => String(c.id) === selectedCategory);
      return category ? category.name : 'Productos';
    }
    
    return 'Todos los Productos';
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Cargando productos...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{getPageTitle()}</h1>

        {/* Filters section */}
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Ordenar por:</span>
            <Select
              value={sortOrder}
              onValueChange={setSortOrder}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Destacados</SelectItem>
                <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                <SelectItem value="name">Nombre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <p className="text-gray-600 mb-6">
          {filteredProducts.length} productos encontrados
        </p>

        {/* Products grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-medium mb-2">No se encontraron productos</h2>
            <p className="text-gray-500">
              Intenta con diferentes filtros o términos de búsqueda
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}