import { Customer } from "../domain/Customer";

export interface CreateCustomerDTO {
  firstName: string;
  lastName: string;
  email: string;
  gender?: string;
  company?: string;
  city: string;
  title?: string;
}

export interface ICustomersRepository {
  create(data: CreateCustomerDTO): Promise<Customer>;
  findByEmail(email: string): Promise<Customer | null>;
}
