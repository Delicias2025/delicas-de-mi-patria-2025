import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit, Plus, UserCog } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/types";

// Mock user service functions since we don't have actual backend implementation
const getUsers = async (): Promise<User[]> => {
  // This would normally be a fetch to your backend
  return [
    {
      id: "1",
      email: "admin@tienda.com",
      name: "Administrador",
      isAdmin: true,
      createdAt: new Date(2023, 0, 15).toISOString(),
    },
    {
      id: "2",
      email: "cliente@ejemplo.com",
      name: "Cliente Ejemplo",
      isAdmin: false,
      createdAt: new Date(2023, 1, 20).toISOString(),
    },
    {
      id: "3",
      email: "usuario@test.com",
      name: "Usuario Test",
      isAdmin: false,
      createdAt: new Date(2023, 2, 5).toISOString(),
    }
  ];
};

const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
  // This would normally update the user in your backend
  console.log(`Updating user ${id}`, data);
  return { ...data, id } as User;
};

const deleteUser = async (id: string): Promise<void> => {
  // This would normally delete the user from your backend
  console.log(`Deleting user ${id}`);
};

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    isAdmin: false,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setIsLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function openEditDialog(user: User) {
    setEditingUser(user);
    setFormData({
      id: user.id,
      name: user.name || "",
      email: user.email,
      isAdmin: user.isAdmin || false,
    });
    setIsDialogOpen(true);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleSwitchChange(checked: boolean) {
    setFormData(prev => ({ ...prev, isAdmin: checked }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      await updateUser(formData.id, formData);
      toast({
        title: "Usuario actualizado",
        description: `El usuario ${formData.email} ha sido actualizado correctamente.`
      });
      setIsDialogOpen(false);
      loadUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario",
        variant: "destructive",
      });
    }
  }

  async function handleDelete(id: string, email: string) {
    if (window.confirm(`¿Estás seguro que deseas eliminar el usuario "${email}"?`)) {
      try {
        await deleteUser(id);
        toast({
          title: "Usuario eliminado",
          description: `El usuario ${email} ha sido eliminado correctamente.`
        });
        loadUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        toast({
          title: "Error",
          description: "No se pudo eliminar el usuario",
          variant: "destructive",
        });
      }
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Table>
          <TableCaption>Lista de usuarios registrados</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Fecha de registro</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  No hay usuarios registrados
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name || "Sin nombre"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isAdmin ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.isAdmin ? 'Administrador' : 'Cliente'}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => openEditDialog(user)}
                    >
                      <UserCog className="h-4 w-4" />
                    </Button>
                    {!user.isAdmin && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleDelete(user.id, user.email)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Modifique los detalles del usuario a continuación.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email"
                value={formData.email} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isAdmin"
                checked={formData.isAdmin}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isAdmin">Permisos de administrador</Label>
            </div>
            
            <DialogFooter>
              <Button type="submit">
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}