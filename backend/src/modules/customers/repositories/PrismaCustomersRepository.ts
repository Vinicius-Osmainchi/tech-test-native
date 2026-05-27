import { Customer as PrismaCustomer } from "@prisma/client";
import { prisma } from "../../../shared/infra/database/prisma/client";
import { Customer } from "../domain/Customer";
import { ICustomersRepository, CustomersTotalByCity, PaginatedCustomers } from "./ICustomersRepository";

export class PrismaCustomersRepository implements ICustomersRepository {
  private mapToDomain(prismaCustomer: PrismaCustomer): Customer {
    return {
      id: prismaCustomer.id,
      firstName: prismaCustomer.first_name,
      lastName: prismaCustomer.last_name,
      email: prismaCustomer.email,
      gender: prismaCustomer.gender,
      company: prismaCustomer.company,
      city: prismaCustomer.city,
      title: prismaCustomer.title,
    };
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = await prisma.customer.findFirst({
      where: { email },
    });

    if (!customer) return null;

    return this.mapToDomain(customer);
  }

  async countByCity(): Promise<CustomersTotalByCity[]> {
    const result = await prisma.customer.groupBy({
      by: ["city"],
      _count: {
        id: true,
      },
    });

    return result.map((item) => ({
      city: item.city,
      customers_total: item._count.id,
    }));
  }
  async findManyByCity(city: string, page: number, limit: number): Promise<PaginatedCustomers> {
    const skip = (page - 1) * limit;

    const [customers, total] = await prisma.$transaction([
      prisma.customer.findMany({
        where: { city },
        skip,
        take: limit,
      }),
      prisma.customer.count({
        where: { city },
      }),
    ]);

    return {
      customers: customers.map((customer) => this.mapToDomain(customer)),
      total,
    };
  }
}
