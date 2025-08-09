import { useEffect, useState } from "react";
// Removed AdminLayout import as we're using Outlet now
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { productService } from "@/lib/product-service";
import { categoryService } from "@/lib/category-service";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { Product, Category } from "@/types";

// Define the type for category statistics
interface CategoryStat {
  name: string;
  totalItems: number;
  stockValue: number;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await productService.getAllProducts();
        const categoriesData = await categoryService.getAllCategories();
        
        setProducts(productsData);
        setCategories(categoriesData);

        // Prepare category statistics
        const stats = categoriesData.map(category => {
          const categoryProducts = productsData.filter(p => p.categoryId === category.id);
          const totalItems = categoryProducts.length;
          const stockValue = categoryProducts.reduce((sum, product) => sum + (product.price * (product.stock || 0)), 0);
          
          return {
            name: category.name,
            totalItems,
            stockValue: parseFloat(stockValue.toFixed(2))
          };
        });
        
        setCategoryStats(stats);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate some statistics
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalStock = products.reduce((sum, product) => sum + (product.stock || 0), 0);
  const inventoryValue = products.reduce((sum, product) => sum + (product.price * (product.stock || 0)), 0);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-500">Cargando datos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      {/* Stats Overview */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <Package className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Productos</p>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Categorías</p>
              <p className="text-2xl font-bold">{totalCategories}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
              <Users className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Stock</p>
              <p className="text-2xl font-bold">{totalStock} unidades</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
              <TrendingUp className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Inventario</p>
              <p className="text-2xl font-bold">${inventoryValue.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Resumen por Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryStats}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 120,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value, name) => {
                  if (name === "stockValue") return [`$${value}`, "Valor de Stock"];
                  return [value, "Total Productos"];
                }} />
                <Legend />
                <Bar yAxisId="left" dataKey="totalItems" name="Total Productos" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="stockValue" name="Valor de Stock" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Products */}
      <Card>
        <CardHeader>
          <CardTitle>Productos con Bajo Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products
                  .filter(product => (product.stock || 0) < 20)
                  .sort((a, b) => (a.stock || 0) - (b.stock || 0))
                  .slice(0, 5)
                  .map(product => {
                    const category = categories.find(c => c.id === product.categoryId);
                    return (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img 
                                className="h-10 w-10 rounded-full object-cover" 
                                src={product.image} 
                                alt={product.name} 
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {category?.name || "Sin categoría"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            (product.stock || 0) < 10 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {product.stock || 0}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}