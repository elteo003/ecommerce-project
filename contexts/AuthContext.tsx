// contexts/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { useRouter } from "next/router";

export interface AuthContextType {
  user: {
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string, role?: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const defaultContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isAdmin: false,
  login: async () => {
    throw new Error("AuthProvider non inizializzato");
  },
  register: async () => {
    throw new Error("AuthProvider non inizializzato");
  },
  logout: async () => {
    throw new Error("AuthProvider non inizializzato");
  },
};

export const AuthContext = createContext<AuthContextType>(defaultContext);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Al mount, interroga /api/auth/me con cookie
    (async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include", // importante per includere i cookie
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          const u = data.user ?? data;
          setUser({
            email: u.email,
            role: u.role,
            firstName: u.firstName,
            lastName: u.lastName,
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Errore /api/auth/me:", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (
    email: string,
    password: string,
    role?: string
  ): Promise<void> => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error("Login fallito: " + err);
    }
    const data = await res.json();
    setUser({
      email: data.email,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
    });
    // redirect in base al ruolo
    router.replace(data.role.toUpperCase() === "ARTISAN" ? "/dashboard" : "/");
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role?: string
  ): Promise<void> => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, firstName, lastName, role }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error("Registrazione fallita: " + err);
    }
    const data = await res.json();
    setUser({
      email: data.email,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
    });
    router.replace("/");
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      router.replace("/login");
    }
  };

  const isAuthenticated = !!user && !isLoading;
  const isAdmin = user?.role.toUpperCase() === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
