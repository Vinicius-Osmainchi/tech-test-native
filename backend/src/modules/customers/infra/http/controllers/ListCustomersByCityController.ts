import { Request, Response } from "express";
import { ListCustomersByCityUseCase } from "../../../useCases/ListCustomersByCityUseCase";
import { PrismaCustomersRepository } from "../../prisma/repositories/PrismaCustomersRepository";

export class ListCustomersByCityController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { city, page, limit } = request.query;

    try {
      const customersRepository = new PrismaCustomersRepository();
      const useCase = new ListCustomersByCityUseCase(customersRepository);

      const parsedPage = page ? parseInt(String(page), 10) : 1;
      const parsedLimit = limit ? parseInt(String(limit), 10) : 10;
      const cityValue = city ? String(city) : "";

      const result = await useCase.execute({
        city: cityValue,
        page: parsedPage,
        limit: parsedLimit,
      });

      return response.status(200).json(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: "Internal server error" });
    }
  }
}
