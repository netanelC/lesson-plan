import { useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "@repo/types";
import { api } from "../../../lib/axios";
import { AuthContext } from "./AuthContext"; // Import from the new file

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved != null ? (JSON.parse(saved) as User) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken !== null) {
      api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }
    return savedToken;
  });

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    // Set axios header immediately
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    void navigate("/login");
  };

  // Sync axios on app load and listen for unauthorized events
  useEffect(() => {
    if (token != null && token !== "") {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ user: user!, token, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
