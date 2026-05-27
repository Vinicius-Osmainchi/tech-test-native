import { CustomersTotalByCity, ICustomersRepository } from "../repositories/ICustomersRepository";

export class GetCustomersTotalByCityUseCase {
  constructor(private customersRepository: ICustomersRepository) {}

  async execute(): Promise<CustomersTotalByCity[]> {
    return this.customersRepository.countByCity();
  }
}
