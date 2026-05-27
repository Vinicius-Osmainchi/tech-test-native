import { Customer } from "../domain/Customer";
import { ICustomersRepository } from "../repositories/ICustomersRepository";

export class GetCustomerByIdUseCase {
  constructor(private customersRepository: ICustomersRepository) {}
 
  async execute(id: number): Promise<Customer> {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new Error("Customer not found");
    }

    return customer;
  }
}
