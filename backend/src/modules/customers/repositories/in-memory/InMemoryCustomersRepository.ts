import { Customer } from "../../domain/Customer";
import { ICustomersRepository, CreateCustomerDTO } from "../ICustomersRepository";

export class InMemoryCustomersRepository implements ICustomersRepository {
  public items: Customer[] = [];

  async create(data: CreateCustomerDTO): Promise<Customer> {
    const customer: Customer = {
      id: this.items.length + 1,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      gender: data.gender,
      company: data.company,
      city: data.city,
      title: data.title,
    };

    this.items.push(customer);
    return customer;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = this.items.find((item) => item.email === email);
    return customer || null;
  }
}
