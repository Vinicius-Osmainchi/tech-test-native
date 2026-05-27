import { Request, Response } from "express";
import { UpdateCustomerUseCase } from "../../../useCases/UpdateCustomerUseCase";
import { PrismaCustomersRepository } from "../../prisma/repositories/PrismaCustomersRepository";

export class UpdateCustomerController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const data = request.body;

    try {
      const customersRepository = new PrismaCustomersRepository();
      const useCase = new UpdateCustomerUseCase(customersRepository);

      const parsedId = parseInt(String(id), 10);

      if (isNaN(parsedId)) {
        return response.status(400).json({ error: "Invalid ID format" });
      }

      const updatedCustomer = await useCase.execute(parsedId, data);

      return response.status(200).json(updatedCustomer);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "Customer not found") {
          return response.status(404).json({ error: error.message });
        }
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: "Internal server error" });
    }
  }
}
