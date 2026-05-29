import { Request, Response } from "express";
import { ListCustomersByCityUseCase } from "../../../useCases/ListCustomersByCityUseCase";

export class ListCustomersByCityController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { city, page = 1, limit = 10 } = request.query;

    try {
      const useCase = new ListCustomersByCityUseCase();

      const cityValue = city ? String(city) : "";
      const pageValue = parseInt(String(page), 10);
      const limitValue = parseInt(String(limit), 10);

      const result = await useCase.execute(cityValue, pageValue, limitValue);

      return response.status(200).json(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: "Internal server error" });
    }
  }
}
