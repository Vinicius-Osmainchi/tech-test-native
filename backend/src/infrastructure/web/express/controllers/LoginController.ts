import { Request, Response } from "express";
import { LoginUseCase } from "../../../../useCases/auth/LoginUseCase";

export class LoginController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    try {
      const loginUseCase = new LoginUseCase();
      const result = await loginUseCase.execute({ email, password });

      return response.status(200).json(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return response.status(401).json({ error: error.message });
      }
      return response.status(500).json({ error: "Internal server error" });
    }
  }
}
