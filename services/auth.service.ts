import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: 'USER' | 'ARTIST' | 'ADMIN';
  avatarUrl?: string;
  bio?: string;
  genre?: string;
}

export enum Role {
  USER = 'USER',
  ARTIST = 'ARTIST',
  ADMIN = 'ADMIN',
}

export interface RegisterData {
  name: string;
  email: string;
  username: string;
  password: string;
  role?: Role;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string
  name: string
  email: string
  username: string
  role: string
  avatarUrl?: string
}

export interface LoginResponse {
  success: boolean
  data: {
    accessToken: string
    user: AuthUser
  }
  message: string
}

export const authService = {
  register(data: RegisterData): Promise<LoginResponse> {
    return api.post<LoginResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data,
    );
  },

  login(data: LoginData): Promise<LoginResponse> {
    return api.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      data,
    );
  },

  me() {
    return api.get(
      API_ENDPOINTS.AUTH.ME,
      {
        auth: true,
      },
    );
  },
};