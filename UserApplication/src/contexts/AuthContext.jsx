import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Mock user object for guest/non-authenticated state
const mockUser = null;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Simple localStorage-based auth for demo purposes
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Mock login - creates a simple user object
      const mockUserData = {
        uid: `user-${Date.now()}`,
        email: email,
        displayName: email.split('@')[0]
      };
      localStorage.setItem('user', JSON.stringify(mockUserData));
      setUser(mockUserData);
    } catch (error) {
      throw new Error(error.message || 'Failed to log in');
    }
  };

  const register = async (email, password) => {
    try {
      // Mock registration - creates a simple user object
      const mockUserData = {
        uid: `user-${Date.now()}`,
        email: email,
        displayName: email.split('@')[0]
      };
      localStorage.setItem('user', JSON.stringify(mockUserData));
      setUser(mockUserData);
    } catch (error) {
      throw new Error(error.message || 'Failed to create account');
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      throw new Error(error.message || 'Failed to log out');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
