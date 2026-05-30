import { prisma } from "../../../shared/infra/database/prisma/client";
import { Customer } from "../domain/customer";

export class GetCustomerByIdUseCase {
  async execute(id: number): Promise<Customer> {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        city: true,
      },
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    const { city_id, city, ...rest } = customer;

    return {
      ...rest,
      city: city.name,
    };
  }
}
