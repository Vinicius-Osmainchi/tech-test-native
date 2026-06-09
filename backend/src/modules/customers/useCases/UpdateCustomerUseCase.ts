import { UpdateCustomerData } from "../domain/Customer";
import { AppError } from "../../../shared/errors/AppError";
import { apiErrorCodes } from "../../../shared/errors/apiErrorCodes";
import { CustomerRepository } from "../infra/database/repositories/CustomerRepository";

export class UpdateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(data: UpdateCustomerData) {
    const customerExists = await this.customerRepository.exists(data.id);

    if (!customerExists) {
      throw new AppError("Customer not found", 404, apiErrorCodes.CUSTOMER_NOT_FOUND);
    }

    return this.customerRepository.update(data);
  }
}
