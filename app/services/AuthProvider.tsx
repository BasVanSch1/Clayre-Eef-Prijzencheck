import { createContext, useContext } from "react";
import { useLoaderData } from "react-router";
import type { Route } from "../+types/root";

type AuthContextType = {
  user: any | null;
  isAuthenticated: boolean;
};

/**
 * React context for authentication state and user info.
 */
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
});

/**
 * Provides authentication context to child components using loader data.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {JSX.Element} The provider component.
 */
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

/**
 * Custom hook to access authentication context.
 * @returns {AuthContextType} The authentication context value.
 */
export function useAuth() {
  return useContext(AuthContext);
}
