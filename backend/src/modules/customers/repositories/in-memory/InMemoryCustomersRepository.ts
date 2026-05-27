import { Customer } from "../../domain/Customer";
import {
  ICustomersRepository,
  CustomersTotalByCity,
  PaginatedCustomers,
  UpdateCustomerDTO,
} from "../ICustomersRepository";

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

  async update(id: number, data: UpdateCustomerDTO): Promise<Customer> {
    const index = this.items.findIndex((item) => item.id === id);

    const updatedCustomer = {
      ...this.items[index],
      ...data,
      firstName: data.firstName ?? this.items[index].firstName,
      lastName: data.lastName ?? this.items[index].lastName,
      email: data.email ?? this.items[index].email,
      gender: data.gender ?? this.items[index].gender,
      company: data.company ?? this.items[index].company,
      city: data.city ?? this.items[index].city,
      title: data.title ?? this.items[index].title,
    };

    this.items[index] = updatedCustomer;
    return updatedCustomer;
  }
}
