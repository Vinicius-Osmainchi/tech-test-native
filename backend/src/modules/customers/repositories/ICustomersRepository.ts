import { Customer } from "../domain/Customer";

export interface CustomersTotalByCity {
  city: string;
  customers_total: number;
}

export interface ICustomersRepository {
  findByEmail(email: string): Promise<Customer | null>;
  countByCity(): Promise<CustomersTotalByCity[]>;
}
