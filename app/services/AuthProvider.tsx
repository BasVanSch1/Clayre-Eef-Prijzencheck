import { createContext, useContext } from "react";
import { useLoaderData } from "react-router";
import type { Route } from "../+types/root";

type AuthContextType = {
  user: any | null;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user } = useLoaderData() as Route.ComponentProps["loaderData"] & {
    user: any | null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
