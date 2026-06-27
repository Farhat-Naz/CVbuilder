import api from "@/lib/api";
import { AuthTokens, User } from "@/types";
import { setAuthData, clearAuthData } from "@/lib/auth";

export const authService = {
  async register(email: string, password: string, full_name?: string): Promise<User> {
    const { data } = await api.post("/auth/register", { email, password, full_name });
    return data;
  },

  async login(email: string, password: string): Promise<AuthTokens> {
    const { data } = await api.post<AuthTokens>("/auth/login", { email, password });
    setAuthData(data);
    return data;
  },

  async logout() {
    clearAuthData();
  },

  async forgotPassword(email: string) {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
  },

  async resetPassword(token: string, new_password: string) {
    const { data } = await api.post("/auth/reset-password", { token, new_password });
    return data;
  },

  async verifyEmail(token: string) {
    const { data } = await api.post("/auth/verify-email", { token });
    return data;
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<User>("/users/me");
    return data;
  },
};
