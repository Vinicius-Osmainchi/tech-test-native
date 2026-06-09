import { api } from "./api";
import type { AuthToken } from "../../domain/models/AuthToken";

export const AuthService = {
  async login(email: string, password: string): Promise<AuthToken> {
    const response = await api.post<AuthToken>("/login", {
      email,
      password,
    });
    return response.data;
  },
};
