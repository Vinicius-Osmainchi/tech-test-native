import { Request, Response } from "express";
import { UpdateCustomerUseCase } from "../../../useCases/UpdateCustomerUseCase";
import { AppError } from "../../../../../shared/errors/AppError";

export class UpdateCustomerController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const data = request.body;

    const parsedId = parseInt(String(id), 10);

    if (isNaN(parsedId)) {
      throw new AppError("Invalid ID format");
    }

    const useCase = new UpdateCustomerUseCase();

    try {
      const updatedCustomer = await useCase.execute({ id: parsedId, ...data });

      const io = request.app.get("io");
      if (io) {
        io.emit("customer_updated");
      }

      return response.status(200).json(updatedCustomer);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "Customer not found") {
        throw new AppError(error.message, 404);
      }
      throw new AppError("Error updating customer");
    }
  }
}
