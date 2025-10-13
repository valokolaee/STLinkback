// src/types/auth.types.ts
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  clientType: 'individual' | 'financial_entities' | 'business';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: any;
}