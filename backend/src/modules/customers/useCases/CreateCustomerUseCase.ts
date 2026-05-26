import { ICustomersRepository, CreateCustomerDTO } from "../repositories/ICustomersRepository";

export class CreateCustomerUseCase {
  constructor(private customersRepository: ICustomersRepository) {}

  async execute({ firstName, lastName, email, gender, company, city, title }: CreateCustomerDTO) {
    const emailAlreadyExists = await this.customersRepository.findByEmail(email);

    if (emailAlreadyExists) {
      throw new Error("Customer with this email already exists");
    }

    const customer = await this.customersRepository.create({
      firstName,
      lastName,
      email,
      gender,
      company,
      city,
      title,
    });

    return customer;
  }
}
