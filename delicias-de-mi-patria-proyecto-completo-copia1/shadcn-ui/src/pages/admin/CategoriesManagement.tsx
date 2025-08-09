import { useEffect, useState, ChangeEvent } from "react";
// Removed AdminLayout import as it's now handled by the parent route
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, FileImage, Package, Upload, Link } from "lucide-react";
import { Category } from "@/types";
import { categoryService } from "@/lib/category-service";
import { productService } from "@/lib/product-service";
import { useToast } from "@/components/ui/use-toast";

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [productCounts, setProductCounts] = useState<Record<number, number>>({});
  const [imageTab, setImageTab] = useState<"url" | "upload">("url");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<boolean>(false);
  const { toast } = useToast();

  // Fetch categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);
        
        // Get product counts for each category
        const products = await productService.getAllProducts();
        const counts = categoriesData.reduce((acc: Record<number, number>, category) => {
          acc[category.id] = products.filter(p => p.categoryId === category.id).length;
          return acc;
        }, {});
        
        setProductCounts(counts);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las categorías."
        });
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Reset form
  const resetForm = () => {
    setCurrentCategory({});
    setIsEditing(false);
    setImagePreview("");
    setImageTab("url");
  };

  // Open dialog for adding a category
  const handleAddCategory = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  // Open dialog for editing a category
  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category);
    setIsEditing(true);
    setImagePreview(category.image || "");
    setIsDialogOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentCategory(prev => ({ ...prev, [name]: value }));
    
    // Update image preview when changing image URL
    if (name === "image" && imageTab === "url") {
      setImagePreview(value);
    }
  };
  
  // Handle file upload
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    // Check file size (limit to 1MB)
    if (file.size > 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "La imagen es demasiado grande. El tamaño máximo es 1MB."
      });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Solo se permiten archivos de imagen."
      });
      return;
    }
    
    setUploadProgress(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      
      // Set the image in state
      setImagePreview(base64String);
      setCurrentCategory(prev => ({ ...prev, image: base64String }));
      setUploadProgress(false);
    };
    
    reader.onerror = () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cargar la imagen."
      });
      setUploadProgress(false);
    };
    
    reader.readAsDataURL(file);
  };

  // Save category
  const handleSaveCategory = async () => {
    if (!currentCategory.name || !currentCategory.description) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, completa el nombre y la descripción."
      });
      return;
    }

    try {
      let updatedCategory;
      
      if (isEditing && currentCategory.id) {
        // Update existing category
        updatedCategory = await categoryService.updateCategory(currentCategory.id, currentCategory);
        
        // Update the categories array with the updated category
        setCategories(prevCategories => 
          prevCategories.map(c => c.id === currentCategory.id ? updatedCategory! : c)
        );
        
        toast({
          title: "Categoría actualizada",
          description: `${currentCategory.name} ha sido actualizada con éxito.`
        });
      } else {
        // Create new category
        updatedCategory = await categoryService.createCategory(currentCategory as Omit<Category, 'id'>);
        
        // Add the new category to the categories array
        setCategories(prevCategories => [...prevCategories, updatedCategory]);
        
        // Initialize product count for this category
        setProductCounts(prev => ({
          ...prev,
          [updatedCategory.id]: 0
        }));
        
        toast({
          title: "Categoría agregada",
          description: `${currentCategory.name} ha sido agregada con éxito.`
        });
      }
      
      // Close the dialog and reset form
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar la categoría."
      });
    }
  };

  // Delete category
  const handleDeleteCategory = async (id: number) => {
    // Check if category has products
    if (productCounts[id] > 0) {
      toast({
        variant: "destructive",
        title: "No se puede eliminar",
        description: "Esta categoría tiene productos asociados. Elimine o reasigne los productos primero."
      });
      return;
    }

    try {
      await categoryService.deleteCategory(id);
      
      // Remove the deleted category from the categories array
      setCategories(prevCategories => prevCategories.filter(c => c.id !== id));
      
      toast({
        title: "Categoría eliminada",
        description: "La categoría ha sido eliminada con éxito."
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la categoría."
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gestión de Categorías</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-500">Cargando categorías...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Categorías</h1>
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-800">
            Total: {categories.length} categorías
          </h2>
        </div>
        <Button onClick={handleAddCategory} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" /> Agregar Categoría
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <div className="h-40 bg-gray-100 relative">
              {category.image ? (
                <img 
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x150?text=Sin+Imagen';
                  }}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <FileImage className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="mb-2 flex justify-between items-start">
                <h3 className="font-semibold text-lg text-gray-900">{category.name}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Package className="h-4 w-4 mr-1" />
                  <span>{productCounts[category.id] || 0} productos</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {category.description}
              </p>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-blue-600 hover:text-blue-900 border-blue-200"
                  onClick={() => handleEditCategory(category)}
                >
                  <Pencil className="h-4 w-4 mr-1" /> Editar
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-900 border-red-200"
                      disabled={productCounts[category.id] > 0}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar la categoría "{category.name}"?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-red-600 hover:bg-red-700" 
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full flex justify-center items-center h-40 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <h3 className="text-gray-500 mb-1">No hay categorías</h3>
              <p className="text-sm text-gray-400 mb-3">Añade una nueva categoría para comenzar</p>
              <Button onClick={handleAddCategory} size="sm">
                <Plus className="h-4 w-4 mr-1" /> Agregar Categoría
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Categoría" : "Agregar Nueva Categoría"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre de la Categoría</Label>
              <Input
                id="name"
                name="name"
                value={currentCategory.name || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={currentCategory.description || ""}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>Imagen de Categoría</Label>
              <Tabs value={imageTab} onValueChange={(value) => setImageTab(value as "url" | "upload")} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url" className="flex items-center gap-2">
                    <Link className="h-4 w-4" /> URL
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" /> Subir
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="url" className="mt-2">
                  <Input
                    id="image"
                    name="image"
                    value={currentCategory.image || ""}
                    onChange={handleInputChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ingresa la URL de una imagen existente
                  </p>
                </TabsContent>
                <TabsContent value="upload" className="mt-2">
                  <div className="grid gap-2">
                    <Input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploadProgress}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-gray-500">
                      Formatos permitidos: JPG, PNG, WebP, GIF. Tamaño máximo: 1MB.
                    </p>
                    {uploadProgress && (
                      <div className="flex items-center justify-center p-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></div>
                        <span className="ml-2 text-sm text-gray-500">Procesando imagen...</span>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              
              {imagePreview && (
                <div className="mt-2">
                  <p className="text-xs font-medium mb-1">Vista previa:</p>
                  <div className="relative bg-gray-100 rounded-md overflow-hidden" style={{ height: "150px" }}>
                    <img 
                      src={imagePreview} 
                      alt="Vista previa" 
                      className="h-full w-full object-contain"
                      onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x150?text=Error'} 
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Identificador URL (Slug)</Label>
              <Input
                id="slug"
                name="slug"
                value={currentCategory.slug || ""}
                onChange={handleInputChange}
                placeholder="identificador-url"
              />
              <p className="text-xs text-gray-500">
                Identificador único para URLs. Use solo letras minúsculas, números y guiones.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCategory}>
              {isEditing ? "Actualizar" : "Crear"} Categoría
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}