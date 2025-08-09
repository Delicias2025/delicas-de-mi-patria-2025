import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/context/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, you would validate credentials with a backend
      // This is just a demo implementation using localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
      
      console.log('Attempting login for:', email);
      
      // Log available users for debugging
      console.log('Available users:', users.map(u => ({email: u.email, hasPassword: !!u.password})));
      
      // First try exact match for both email and password
      let foundUser = users.find(u => u.email === email && u.password === password);
      
      // Special case for admin
      if (!foundUser && email === 'admin@tienda.com' && password === 'admin123') {
        console.log('Admin login attempt, checking if admin exists');
        
        // Check if admin exists but password is wrong
        const adminExists = users.some(u => u.email === 'admin@tienda.com');
        
        if (adminExists) {
          console.log('Admin exists but password is incorrect');
        } else {
          // Create admin user if it doesn't exist
          console.log('Creating admin user');
          const adminUser: User = {
            id: 'admin-' + Date.now(),
            name: 'Administrador',
            email: 'admin@tienda.com',
            password: 'admin123',
            isAdmin: true
          };
          
          users.push(adminUser);
          localStorage.setItem('users', JSON.stringify(users));
          foundUser = adminUser;
        }
      }
      
      if (foundUser) {
        console.log('Login successful for user:', foundUser.email, 'isAdmin:', foundUser.isAdmin);
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        return true;
      }
      
      console.log('Login failed: Invalid credentials');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, you would send this to a backend
      // This is just a demo implementation using localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
      
      console.log('Attempting to register with email:', email, 'password length:', password?.length || 0);
      
      // Check if user already exists
      if (users.some((u) => u.email === email)) {
        console.log('User already exists with email:', email);
        return false;
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        name: email.split('@')[0], // Default name from email
        email,
        password, // Add password for login functionality
        isAdmin: false
        // In a real app, never store plain text passwords
      };
      
      // Apply registration discount if available
      // Skip this during initial development to reduce complexity
      // This will be re-enabled once core auth functionality works
      /*
      try {
        const { promotionService } = await import('@/lib/promotion-service');
        const registrationPromo = await promotionService.applyRegistrationPromotion();
        if (registrationPromo) {
          // Store promotion info in localStorage to apply in checkout
          localStorage.setItem('registrationPromotion', JSON.stringify({
            userId: newUser.id,
            discountAmount: registrationPromo.discountAmount,
            promotion: registrationPromo.promotion
          }));
        }
      } catch (error) {
        console.error('Error applying registration promotion:', error);
        // Continue with registration even if promotion fails
      }
      */
      
      console.log('Adding new user to users array:', newUser);
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Verify the user was actually added to localStorage
      const updatedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      console.log('Updated users list:', updatedUsers.map((u: User) => u.email));
      
      // Auto login after registration
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Verify the user was actually stored in localStorage
      const storedUser = localStorage.getItem('user');
      console.log('Stored user:', storedUser);
      
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