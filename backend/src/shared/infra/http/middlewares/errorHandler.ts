import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../errors/AppError";

export function errorHandler(
  err: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({ error: err.message });
  }

  return response.status(500).json({ error: "Internal server error" });
}
