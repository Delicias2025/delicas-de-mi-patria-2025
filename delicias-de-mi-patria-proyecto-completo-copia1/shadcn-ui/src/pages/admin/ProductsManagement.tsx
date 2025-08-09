import { useEffect, useState } from "react";
// Removed AdminLayout import as it's now handled by the parent route
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Product, Category } from "@/types";
import { productService } from "@/lib/product-service";
import { categoryService } from "@/lib/category-service";
import { useToast } from "@/components/ui/use-toast";

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<number | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await productService.getAllProducts();
        const categoriesData = await categoryService.getAllCategories();
        
        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(categoriesData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los productos."
        });
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Filter products when search term or category filter changes
  useEffect(() => {
    let result = products;
    
    // Apply category filter
    if (filterCategory !== "all") {
      result = result.filter(product => product.categoryId === filterCategory);
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredProducts(result);
  }, [products, searchTerm, filterCategory]);

  // Reset form
  const resetForm = () => {
    setCurrentProduct({});
    setIsEditing(false);
  };

  // Open dialog for adding a product
  const handleAddProduct = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  // Open dialog for editing a product
  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({ ...prev, [name]: value }));
  };

  // Handle number input changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  // Handle category select
  const handleCategoryChange = (value: string) => {
    setCurrentProduct(prev => ({ ...prev, categoryId: parseInt(value) }));
  };

  // Save product
  const handleSaveProduct = async () => {
    if (!currentProduct.name || !currentProduct.description || !currentProduct.price || !currentProduct.categoryId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, completa todos los campos requeridos."
      });
      return;
    }

    try {
      let updatedProduct;
      
      if (isEditing && currentProduct.id) {
        // Update existing product
        updatedProduct = await productService.updateProduct(currentProduct.id, currentProduct);
        
        // Update the products array with the updated product
        setProducts(prevProducts => 
          prevProducts.map(p => p.id === currentProduct.id ? updatedProduct! : p)
        );
        
        toast({
          title: "Producto actualizado",
          description: `${currentProduct.name} ha sido actualizado con éxito.`
        });
      } else {
        // Create new product
        updatedProduct = await productService.createProduct(currentProduct as Omit<Product, 'id'>);
        
        // Add the new product to the products array
        setProducts(prevProducts => [...prevProducts, updatedProduct]);
        
        toast({
          title: "Producto agregado",
          description: `${currentProduct.name} ha sido agregado con éxito.`
        });
      }
      
      // Close the dialog and reset form
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar el producto."
      });
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: number) => {
    try {
      await productService.deleteProduct(id);
      
      // Remove the deleted product from the products array
      setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
      
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado con éxito."
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el producto."
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gestión de Productos</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-500">Cargando productos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Productos</h1>
      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-full md:w-64">
              <Select 
                value={filterCategory.toString()} 
                onValueChange={(value) => setFilterCategory(value === "all" ? "all" : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddProduct} className="flex items-center">
              <Plus className="h-4 w-4 mr-2" /> Agregar Producto
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
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
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => {
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
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {product.description}
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
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.stock || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600 hover:text-blue-900 mr-2"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar el producto "{product.name}"?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-red-600 hover:bg-red-700" 
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  );
                })}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No se encontraron productos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Producto" : "Agregar Nuevo Producto"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del Producto</Label>
              <Input
                id="name"
                name="name"
                value={currentProduct.name || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={currentProduct.description || ""}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentProduct.price || ""}
                  onChange={handleNumberChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={currentProduct.stock || ""}
                  onChange={(e) => handleNumberChange(e)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Categoría</Label>
              <Select 
                value={currentProduct.categoryId?.toString() || ""} 
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Imagen del Producto</Label>
              <div className="flex flex-col gap-4">
                {/* URL de imagen */}
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-muted-foreground">Opción 1: URL de imagen</div>
                  <Input
                    id="image"
                    name="image"
                    value={currentProduct.image || ""}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                {/* Separador */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">O</span>
                  </div>
                </div>
                
                {/* Subir archivo */}
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-muted-foreground">Opción 2: Subir archivo</div>
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Convertir imagen a base64
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setCurrentProduct({
                            ...currentProduct,
                            image: reader.result as string
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
                
                {/* Vista previa */}
                {currentProduct.image && (
                  <div className="mt-2">
                    <div className="text-sm font-medium mb-2">Vista previa:</div>
                    <img 
                      src={currentProduct.image} 
                      alt="Vista previa" 
                      className="h-32 w-32 object-cover rounded-md border border-gray-300"
                      onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error'} 
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <input
                id="featured"
                name="featured"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={currentProduct.featured || false}
                onChange={(e) => setCurrentProduct({...currentProduct, featured: e.target.checked})}
              />
              <Label htmlFor="featured" className="ml-2">
                Destacado en la página principal
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveProduct}>
              {isEditing ? "Actualizar" : "Crear"} Producto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}