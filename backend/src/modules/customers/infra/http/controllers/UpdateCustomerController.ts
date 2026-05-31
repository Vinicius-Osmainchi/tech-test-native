import { Request, Response } from "express";
import { UpdateCustomerUseCase } from "../../../useCases/UpdateCustomerUseCase";
import { AppError } from "../../../../../shared/errors/AppError";
import { apiErrorCodes } from "../../../../../shared/errors/apiErrorCodes";

export class UpdateCustomerController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const data = request.body;

    const parsedId = parseInt(String(id), 10);

    if (isNaN(parsedId)) {
      throw new AppError("Invalid ID format", 400, apiErrorCodes.INVALID_ID_FORMAT);
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
      if (error instanceof AppError && error.code === apiErrorCodes.CUSTOMER_NOT_FOUND) {
        throw error;
      }
      throw new AppError("Error updating customer", 400, apiErrorCodes.ERROR_UPDATING_CUSTOMER);
    }
  }
}
