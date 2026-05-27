import { Request, Response } from "express";
import { GetCustomersTotalByCityUseCase } from "../GetCustomersTotalByCityUseCase";
import { PrismaCustomersRepository } from "../repositories/PrismaCustomersRepository";

export class GetCustomersTotalByCityController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const customersRepository = new PrismaCustomersRepository();
      const useCase = new GetCustomersTotalByCityUseCase(customersRepository);

      const result = await useCase.execute();

      return response.status(200).json(result);
    } catch (error) {
      return response.status(500).json({ error: "Internal server error" });
    }
  }
}
