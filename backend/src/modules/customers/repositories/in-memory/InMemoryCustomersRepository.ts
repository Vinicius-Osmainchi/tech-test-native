import { Customer } from "../../domain/Customer";
import { ICustomersRepository, CustomersTotalByCity, PaginatedCustomers } from "../ICustomersRepository";

export class InMemoryCustomersRepository implements ICustomersRepository {
  public items: Customer[] = [];

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = this.items.find((item) => item.email === email);
    return customer || null;
  }

  async findById(id: number): Promise<Customer | null> {
    const customer = this.items.find((item) => item.id === id);
    return customer || null;
  }

  async countByCity(): Promise<CustomersTotalByCity[]> {
    const counts = this.items.reduce(
      (acc, customer) => {
        acc[customer.city] = (acc[customer.city] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(counts).map(([city, count]) => ({
      city,
      customers_total: count,
    }));
  }

  async findManyByCity(city: string, page: number, limit: number): Promise<PaginatedCustomers> {
    const filteredCustomers = this.items.filter((item) => item.city === city);

    const skip = (page - 1) * limit;
    const paginatedCustomers = filteredCustomers.slice(skip, skip + limit);

    return {
      customers: paginatedCustomers,
      total: filteredCustomers.length,
    };
  }
}
