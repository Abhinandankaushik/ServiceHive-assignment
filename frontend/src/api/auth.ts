import api from "./axios";
import { ApiResponse, User } from "../types";

export interface AuthPayload {
  token: string;
  user: User;
}

export const loginApi = async (email: string, password: string) => {
  const { data } = await api.post<ApiResponse<AuthPayload>>("/auth/login", { email, password });
  return data.data;
};

export const registerApi = async (name: string, email: string, password: string, role?: "admin" | "sales") => {
  const { data } = await api.post<ApiResponse<AuthPayload>>("/auth/register", { name, email, password, role });
  return data.data;
};

export const meApi = async () => {
  const { data } = await api.get<ApiResponse<User>>("/auth/me");
  return data.data;
};
