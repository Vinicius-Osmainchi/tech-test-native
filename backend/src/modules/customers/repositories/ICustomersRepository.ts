import { Customer } from "../domain/Customer";

export interface CustomersTotalByCity {
  city: string;
  customers_total: number;
}

export interface PaginatedCustomers {
  customers: Customer[];
  total: number;
}

export interface UpdateCustomerDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: string;
  company?: string;
  city?: string;
  title?: string;
}

export interface ICustomersRepository {
  findByEmail(email: string): Promise<Customer | null>;
  findById(id: number): Promise<Customer | null>;
  countByCity(): Promise<CustomersTotalByCity[]>;
  findManyByCity(city: string, page: number, limit: number): Promise<PaginatedCustomers>;
  update(id: number, data: UpdateCustomerDTO): Promise<Customer>;
}
