import { createContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const bootstrapSession = async () => {
    try {
      const profile = await axios.get(`${API_BASE_URL}/auth/profile`, { withCredentials: true });
      setUser(profile.data);
    } catch {
      try {
        const refreshed = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        setUser(refreshed.data);
      } catch {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      bootstrapSession();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API_BASE_URL}/auth/login`, { email, password }, { withCredentials: true });
    setUser(data);
    return data;
  };

  const register = async (payload) => {
    const { data } = await axios.post(`${API_BASE_URL}/auth/register`, payload, { withCredentials: true });
    setUser(data);
    return data;
  };

  const logout = () => {
    axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true }).finally(() => {
      setUser(null);
    });
  };

  const refreshUser = async () => {
    const profile = await axios.get(`${API_BASE_URL}/auth/profile`, { withCredentials: true });
    setUser(profile.data);
    return profile.data;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
