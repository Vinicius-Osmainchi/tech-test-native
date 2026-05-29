import { Request, Response } from "express";
import { GetCustomersTotalByCityUseCase } from "../../../useCases/GetCustomersTotalByCityUseCase";

export class GetCustomersTotalByCityController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const useCase = new GetCustomersTotalByCityUseCase();

      const result = await useCase.execute();

      return response.status(200).json(result);
    } catch {
      return response.status(500).json({ error: "Internal server error" });
    }
  }
}
