import { Request, Response } from "express";
import { GetCustomersTotalByCityUseCase } from "../../../useCases/GetCustomersTotalByCityUseCase";
import { CustomerRepository } from "../../database/repositories/CustomerRepository";

export class GetCustomersTotalByCityController {
  async handle(request: Request, response: Response): Promise<Response> {
    const customerRepository = new CustomerRepository();
    const useCase = new GetCustomersTotalByCityUseCase(customerRepository);
    const result = await useCase.execute();

    return response.status(200).json(result);
  }
}
