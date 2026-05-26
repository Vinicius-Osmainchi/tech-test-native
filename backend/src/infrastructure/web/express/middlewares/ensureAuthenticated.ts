import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    response.status(401).json({ error: "Token is missing" });
    return;
  }

  const [, token] = authHeader.split(" ");

  try {
    const secret = process.env.JWT_SECRET as string;
    jwt.verify(token, secret);

    next();
  } catch (err) {
    response.status(401).json({ error: "Token invalid" });
    return;
  }
}
