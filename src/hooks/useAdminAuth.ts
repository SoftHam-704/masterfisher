import { useState, useEffect } from 'react';

interface AdminSession {
  authenticated: boolean;
  timestamp: number;
  expiresAt: number;
}

const ADMIN_SESSION_KEY = 'admin_session';
const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 horas em milissegundos

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar sess�o ao carregar
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = () => {
    try {
      const sessionData = localStorage.getItem(ADMIN_SESSION_KEY);
      
      if (!sessionData) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const session: AdminSession = JSON.parse(sessionData);
      const now = Date.now();

      // Verificar se a sess�o expirou
      if (now > session.expiresAt) {
        logout();
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Erro ao verificar sess�o admin:', error);
      logout();
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (password: string): boolean => {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (password === adminPassword) {
      const now = Date.now();
      const session: AdminSession = {
        authenticated: true,
        timestamp: now,
        expiresAt: now + SESSION_DURATION,
      };

      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      setIsAuthenticated(true);
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
  };

  const extendSession = () => {
    if (isAuthenticated) {
      const now = Date.now();
      const session: AdminSession = {
        authenticated: true,
        timestamp: now,
        expiresAt: now + SESSION_DURATION,
      };
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    }
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    extendSession,
    checkSession,
  };
};
