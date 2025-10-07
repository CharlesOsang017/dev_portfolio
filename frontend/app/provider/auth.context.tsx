import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";
import { useRouter } from "next/navigation";
import { queryClient } from "./react-query-provider";
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const token = Cookies.get("token");
      const userInfo = Cookies.get("user");
      if (token && userInfo) {
        setUser(JSON.parse(userInfo));
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  // handling force log out functionality
  useEffect(() => {
    const handleForceLogout = () => {
      logout();
      router.push("/sign-in");
    };
    window.addEventListener("force-logout", handleForceLogout);
    return () => {
      window.removeEventListener("force-logout", handleForceLogout);
    };
  }, []);

  const login = async (data: any) => {
    Cookies.set("token", data.token);
    Cookies.set("user", JSON.stringify(data.user));
    setUser(data?.user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setUser(null);
    setIsAuthenticated(false);
    queryClient.clear();
  };

  const values = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

// This function ensures the useAuth hook is used within a AuthProvider
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};