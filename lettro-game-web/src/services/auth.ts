import apiClient, { LoginRequest, LoginResponse, ApiError } from '../lib/axios';

export class AuthService {
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        username: credentials.username,
        password: credentials.password,
        expiresInMins: credentials.expiresInMins || 60,
      });
      
      // Store token if needed (consider using httpOnly cookies instead)
      if (typeof window !== 'undefined' && response.data.token) {
        localStorage.setItem('accessToken', response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      const apiError: ApiError = {
        message: error.response?.data?.message || 'Login failed',
        status: error.response?.status,
      };
      throw apiError;
    }
  }

  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
      }
    }
  }

  static async refreshToken(): Promise<string> {
    try {
      const response = await apiClient.post<{ token: string }>('/auth/refresh');
      const newToken = response.data.token;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', newToken);
      }
      
      return newToken;
    } catch (error: any) {
      throw new Error('Token refresh failed');
    }
  }
}