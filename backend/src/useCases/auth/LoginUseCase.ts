import jwt from "jsonwebtoken";

interface LoginDTO {
  email?: string;
  password?: string;
}

export class LoginUseCase {
  async execute({ email, password }: LoginDTO) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email !== adminEmail || password !== adminPassword) {
      throw new Error("Invalid credentials");
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign({ role: "admin" }, secret, {
      expiresIn: "1d",
    });

    return { token };
  }
}
