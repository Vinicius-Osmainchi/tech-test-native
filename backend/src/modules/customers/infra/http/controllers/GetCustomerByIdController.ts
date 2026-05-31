import { Request, Response } from "express";
import { GetCustomerByIdUseCase } from "../../../useCases/GetCustomerByIdUseCase";
import { AppError } from "../../../../../shared/errors/AppError";
import { apiErrorCodes } from "../../../../../shared/errors/apiErrorCodes";

export class GetCustomerByIdController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const parsedId = parseInt(String(id), 10);

    if (isNaN(parsedId)) {
      throw new AppError("Invalid ID format", 400, apiErrorCodes.INVALID_ID_FORMAT);
    }

    const useCase = new GetCustomerByIdUseCase();

    try {
      const customer = await useCase.execute(parsedId);
      return response.status(200).json(customer);
    } catch (error: unknown) {
      if (error instanceof AppError && error.code === apiErrorCodes.CUSTOMER_NOT_FOUND) {
        throw error;
      }
      throw new AppError(
        "Error fetching customer data",
        400,
        apiErrorCodes.ERROR_FETCHING_CUSTOMER,
      );
    }
  }
}
