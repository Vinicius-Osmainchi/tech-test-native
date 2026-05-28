import jwt from "jsonwebtoken";

interface LoginRequest {
  email: string;
  password?: string;
}

export class LoginUseCase {
  async execute({ email, password }: LoginRequest) {
    if (email !== "admin@email.com" || password !== "admin") {
      throw new Error("Invalid credentials");
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign({ email, role: "admin" }, secret, {
      expiresIn: "1d",
    });

    return { token };
  }
}
