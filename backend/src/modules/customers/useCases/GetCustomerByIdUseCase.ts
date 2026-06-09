import { Customer } from "../domain/Customer";
import { AppError } from "../../../shared/errors/AppError";
import { apiErrorCodes } from "../../../shared/errors/apiErrorCodes";
import { CustomerRepository } from "../infra/database/repositories/CustomerRepository";

export class GetCustomerByIdUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new AppError("Customer not found", 404, apiErrorCodes.CUSTOMER_NOT_FOUND);
    }

    return customer;
  }
}
