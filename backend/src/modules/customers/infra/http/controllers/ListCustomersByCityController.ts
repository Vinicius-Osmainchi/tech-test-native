import { Request, Response } from "express";
import { ListCustomersByCityUseCase } from "../../../useCases/ListCustomersByCityUseCase";
import { AppError } from "../../../../../shared/errors/AppError";

export class ListCustomersByCityController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { city, page = 1, limit = 10 } = request.query;

    if (!city || String(city).trim() === "") {
      throw new AppError("City query parameter is required.", 400);
    }

    const cityValue = String(city);
    const pageValue = parseInt(String(page), 10);
    const limitValue = parseInt(String(limit), 10);

    if (isNaN(pageValue) || pageValue < 1) {
      throw new AppError("Page must be a positive number.");
    }

    if (isNaN(limitValue) || limitValue < 1) {
      throw new AppError("Limit must be a positive number.");
    }

    const useCase = new ListCustomersByCityUseCase();
    const result = await useCase.execute(cityValue, pageValue, limitValue);

    return response.status(200).json(result);
  }
}
