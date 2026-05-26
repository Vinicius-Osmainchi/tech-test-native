import { Request, Response } from "express";
import { CreateCustomerUseCase } from "../useCases/CreateCustomerUseCase";
import { PrismaCustomersRepository } from "../repositories/PrismaCustomersRepository";

export class CreateCustomerController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { firstName, lastName, email, gender, company, city, title } = request.body;

    try {
      const customersRepository = new PrismaCustomersRepository();
      const createCustomerUseCase = new CreateCustomerUseCase(customersRepository);

      const customer = await createCustomerUseCase.execute({
        firstName,
        lastName,
        email,
        gender,
        company,
        city,
        title,
      });

      return response.status(201).json(customer);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: "Internal server error" });
    }
  }
}
