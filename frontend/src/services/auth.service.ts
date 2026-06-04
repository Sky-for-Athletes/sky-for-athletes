import api from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface RegisterResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
  };
}

export async function login(data: LoginRequest) {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
}

export async function register(data: RegisterRequest) {
  const response = await api.post<RegisterResponse>("/auth/register", data);
  return response.data;
}
