export interface User {
  id: number;
  email: string;
  first_name: string;
  date_joined: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  first_name: string;
  password: string;
}

export interface TokenRefreshRequest {
  refresh: string;
}

export interface TokenRefreshResponse {
  access: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}
