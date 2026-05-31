import { Request, Response } from "express";
import { LoginUseCase } from "../../../useCases/LoginUseCase";
import { AppError } from "../../../../../shared/errors/AppError";
import { apiErrorCodes } from "../../../../../shared/errors/apiErrorCodes";

export class LoginController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    try {
      const loginUseCase = new LoginUseCase();
      const result = await loginUseCase.execute({ email, password });

      return response.status(200).json(result);
    } catch (error: unknown) {
      if (error instanceof AppError && error.code === apiErrorCodes.INVALID_CREDENTIALS) {
        return response.status(401).json({ code: apiErrorCodes.INVALID_CREDENTIALS });
      }

      return response.status(500).json({ code: apiErrorCodes.INTERNAL_SERVER_ERROR });
    }
  }
}
