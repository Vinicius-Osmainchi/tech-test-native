import { Request, Response } from "express";
import { ListCustomersByCityUseCase } from "../../../useCases/ListCustomersByCityUseCase";

export class ListCustomersByCityController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { city } = request.query;

    try {
      const useCase = new ListCustomersByCityUseCase();

      const cityValue = city ? String(city) : "";

      const result = await useCase.execute(cityValue);

      return response.status(200).json(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: "Internal server error" });
    }
  }
}
