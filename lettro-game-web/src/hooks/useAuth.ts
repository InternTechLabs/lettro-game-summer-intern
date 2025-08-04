import { useState, useCallback } from 'react';
import { AuthService, LoginRequest, LoginResponse, ApiError } from '../services/auth';

interface UseAuthReturn {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useAuth = (): UseAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      await AuthService.login(credentials);
      // Handle successful login (redirect, update state, etc.)
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await AuthService.logout();
      // Handle successful logout
    } catch (err: any) {
      setError(err.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  }, []);

  return { login, logout, loading, error };
};
