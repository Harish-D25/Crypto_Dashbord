
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  email: string;
  name: string;
  id: string;
} | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateUserProfile: (data: { name?: string }) => Promise<boolean>;
};

// Key for localStorage
const USER_STORAGE_KEY = 'cryptonxt_user';
const USERS_DB_KEY = 'cryptonxt_users_db';

// Interface for stored user data
interface StoredUser {
  id: string;
  email: string;
  name: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize or get users database from localStorage
  const getUsersDB = (): StoredUser[] => {
    const storedUsers = localStorage.getItem(USERS_DB_KEY);
    if (storedUsers) {
      try {
        return JSON.parse(storedUsers);
      } catch (error) {
        console.error('Error parsing users DB from localStorage:', error);
        return [];
      }
    }
    return [];
  };

  // Save users database to localStorage
  const saveUsersDB = (users: StoredUser[]) => {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  };

  useEffect(() => {
    // Check if user is stored in localStorage on mount
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Get users from "database"
    const users = getUsersDB();
    
    // Find user with matching email and password
    const matchedUser = users.find(
      (user) => user.email === email && user.password === password
    );
    
    if (matchedUser) {
      // Don't include password in the user state
      const { password: _, ...userWithoutPassword } = matchedUser;
      setUser(userWithoutPassword);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Get existing users
    const users = getUsersDB();
    
    // Check if user with this email already exists
    if (users.some(user => user.email === email)) {
      return false; // User already exists
    }
    
    // Create new user with a unique ID
    const newUser: StoredUser = {
      id: Date.now().toString(),
      email,
      name,
      password
    };
    
    // Add to "database"
    users.push(newUser);
    saveUsersDB(users);
    
    // Set current user (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithoutPassword));
    
    return true;
  };

  const updateUserProfile = async (data: { name?: string }): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Get users database
      const users = getUsersDB();
      
      // Find and update the current user
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) return false;
      
      // Update user data
      users[userIndex] = {
        ...users[userIndex],
        ...(data.name && { name: data.name }),
      };
      
      // Save updated users database
      saveUsersDB(users);
      
      // Update current user state
      const updatedUser = {
        ...user,
        ...(data.name && { name: data.name }),
      };
      
      setUser(updatedUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isLoading,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
