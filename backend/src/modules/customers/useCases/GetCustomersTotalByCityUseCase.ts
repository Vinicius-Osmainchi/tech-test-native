import { CityTotal } from "../domain/Customer";
import { CustomerRepository } from "../infra/database/repositories/CustomerRepository";

export class GetCustomersTotalByCityUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(): Promise<CityTotal[]> {
    return this.customerRepository.getTotalsByCity();
  }
}
