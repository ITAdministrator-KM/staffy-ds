import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};