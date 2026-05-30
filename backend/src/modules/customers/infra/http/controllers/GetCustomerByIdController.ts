import { Request, Response } from "express";
import { GetCustomerByIdUseCase } from "../../../useCases/GetCustomerByIdUseCase";
import { AppError } from "../../../../../shared/errors/AppError";

export class GetCustomerByIdController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const parsedId = parseInt(String(id), 10);

    if (isNaN(parsedId)) {
      throw new AppError("Invalid ID format", 400);
    }

    const useCase = new GetCustomerByIdUseCase();

    try {
      const customer = await useCase.execute(parsedId);
      return response.status(200).json(customer);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "Customer not found") {
        throw new AppError(error.message, 404);
      }
      throw new AppError("Error fetching customer data", 400);
    }
  }
}
