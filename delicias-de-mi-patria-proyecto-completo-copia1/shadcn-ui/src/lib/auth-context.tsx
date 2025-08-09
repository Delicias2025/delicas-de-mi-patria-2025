import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = !!user;
  const isAdmin = isAuthenticated && user?.email === 'admin@delicias.com';

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, you would validate credentials with a backend
      // This is just a demo implementation using localStorage
      
      // Special case for admin
      if (email === 'admin@delicias.com' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin',
          name: 'Administrador',
          email: 'admin@delicias.com',
          isAdmin: true
        };
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        return true;
      }
      
      const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
      const foundUser = users.find((u) => u.email === email);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, you would send this to a backend
      // This is just a demo implementation using localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
      
      // Check if user already exists
      if (users.some((u) => u.email === email)) {
        return false;
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        isAdmin: false
        // In a real app, never store plain text passwords
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Auto login after registration
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUserProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;
      
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update in users array too
      const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
      const updatedUsers = users.map((u) => 
        u.id === user.id ? updatedUser : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        login,
        register,
        logout,
        updateUserProfile,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};