import { Customer } from "../domain/Customer";
import { ICustomersRepository, UpdateCustomerDTO } from "../repositories/ICustomersRepository";


export class UpdateCustomerUseCase {
  constructor(private customersRepository: ICustomersRepository) {}

  async execute(id: number, data: UpdateCustomerDTO): Promise<Customer> {
    const customerExists = await this.customersRepository.findById(id);

    if (!customerExists) {
      throw new Error("Customer not found");
    }

    if (data.email && data.email !== customerExists.email) {
      const emailExists = await this.customersRepository.findByEmail(data.email);

      if (emailExists) {
        throw new Error("Email already in use");
      }
    }

    return this.customersRepository.update(id, data);
  }
}
