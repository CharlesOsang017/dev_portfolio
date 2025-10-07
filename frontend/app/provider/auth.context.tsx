// import type { User } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";
import { useRouter } from "next/navigation";
import { queryClient } from "./react-query-provider";
// import { useQueryClient } from "@tanstack/react-query";
// import { queryClient } from "./react-query-provider";
// import { useLocation, useNavigate } from "react-router";
// import { publicRoutes } from "@/lib";

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
//   const queryClient = useQueryClient();

//   const navigate = useNavigate();
//   const currentPath = useLocation().pathname;
//   const isPublicRoute = publicRoutes.includes(currentPath);

  // check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const userInfo = localStorage.getItem("user");
      if (userInfo) {
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
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data?.user);
    setIsAuthenticated(true);
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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