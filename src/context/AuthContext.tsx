import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, currency?: string) => Promise<boolean>;
  updateUserCurrency: (currency: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      // Add default currency if not present (for existing users)
      if (!userData.currency) {
        userData.currency = 'USD';
      }
      setUser(userData);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        const loggedInUser = { ...user };
        delete loggedInUser.password;
        // Add default currency if not present
        if (!loggedInUser.currency) {
          loggedInUser.currency = 'USD';
        }
        setUser(loggedInUser);
        localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const register = async (email: string, password: string, name: string, currency: string = 'USD'): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (users.find((u: any) => u.email === email)) {
        return false; // User already exists
      }

      const newUser = {
        id: crypto.randomUUID(),
        email,
        password,
        name,
        currency,
        createdAt: new Date()
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      const userWithoutPassword = { ...newUser };
      delete userWithoutPassword.password;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateUserCurrency = (currency: string) => {
    if (!user) return;
    
    const updatedUser = { ...user, currency };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update user in users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === user.id ? { ...u, currency } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateUserCurrency, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};