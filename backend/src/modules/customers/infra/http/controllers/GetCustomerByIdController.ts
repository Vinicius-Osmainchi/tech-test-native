import { Request, Response } from "express";
import { GetCustomerByIdUseCase } from "../../../useCases/GetCustomerByIdUseCase";

export class GetCustomerByIdController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    try {
      const useCase = new GetCustomerByIdUseCase();

      const parsedId = parseInt(String(id), 10);

      if (isNaN(parsedId)) {
        return response.status(400).json({ error: "Invalid ID format" });
      }

      const customer = await useCase.execute(parsedId);

      return response.status(200).json(customer);
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
