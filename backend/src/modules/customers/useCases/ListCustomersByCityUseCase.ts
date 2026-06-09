import { CustomerRepository } from "../infra/database/repositories/CustomerRepository";

export class ListCustomersByCityUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(cityName: string, page: number, limit: number) {
    return this.customerRepository.findByCity(cityName, page, limit);
  }
}
