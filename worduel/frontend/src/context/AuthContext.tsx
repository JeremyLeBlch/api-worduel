import { createContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types/user';
import { useQuery, useApolloClient } from '@apollo/client';
import { GET_CURRENT_USER } from '../api/me';
import { LOGOUT_MUTATION } from '../api/logout';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  forceRevalidate: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  isLoading: false,
  logout: () => {},
  forceRevalidate: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = user !== null;

  const { data, loading, error } = useQuery(GET_CURRENT_USER, {
    fetchPolicy: "network-only",
    onError: (error) => {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      setUser(null);
    },
    errorPolicy: 'all'
  });

  const client = useApolloClient();

  useEffect(() => {
    if (loading) {
      setIsLoading(true);
    } else if (data) {
      setUser(data.me || null);
      setIsLoading(false);
    } else if (error) {
      if (error.message.includes('Non authentifié')) {
        setUser(null);
        setIsLoading(false);
      } else {
        console.error('Erreur lors de la récupération de l’utilisateur :', error);
        setIsLoading(false);
        setUser(null);
      }
    }
  }, [data, loading, error]);

  const forceRevalidate = async () => {
    try {
      const { data } = await client.query({
        query: GET_CURRENT_USER,
        fetchPolicy: "network-only",
      });
      setUser(data?.me || null);
    } catch (error) {
      console.error("Erreur lors de la revalidation :", error);
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await client.mutate({ mutation: LOGOUT_MUTATION });
      setUser(null);
      setIsLoading(false);
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        isLoading,
        logout,
        forceRevalidate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

