import { Customer as PrismaCustomer } from "@prisma/client";
import { prisma } from "../../../shared/infra/database/prisma/client";
import { Customer } from "../domain/Customer";
import { ICustomersRepository, CreateCustomerDTO } from "./ICustomersRepository";

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

  async create({ firstName, lastName, email, gender, company, city, title }: CreateCustomerDTO): Promise<Customer> {
    const customer = await prisma.customer.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email,
        gender,
        company,
        city,
        title,
      },
    });

    return this.mapToDomain(customer);
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = await prisma.customer.findFirst({
      where: { email },
    });

    if (!customer) return null;

    return this.mapToDomain(customer);
  }
}
