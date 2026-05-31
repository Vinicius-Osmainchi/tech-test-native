import jwt from "jsonwebtoken";
import { AppError } from "../../../shared/errors/AppError";
import { apiErrorCodes } from "../../../shared/errors/apiErrorCodes";

interface LoginRequest {
  email: string;
  password?: string;
}

export class LoginUseCase {
  async execute({ email, password }: LoginRequest) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const secret = process.env.JWT_SECRET;

    if (!adminEmail || !adminPassword) {
      throw new AppError("ADMIN_EMAIL or ADMIN_PASSWORD is not defined", 500);
    }

    if (!secret) {
      throw new AppError("JWT_SECRET is not defined", 500);
    }

    if (email !== adminEmail || password !== adminPassword) {
      throw new AppError("Invalid credentials", 401, apiErrorCodes.INVALID_CREDENTIALS);
    }

    const token = jwt.sign({ email, role: "admin" }, secret, {
      expiresIn: "1d",
    });

    return { token };
  }
}
