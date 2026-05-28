import { prisma } from "../../../shared/infra/database/prisma/client";

export class GetCustomerByIdUseCase {
  async execute(id: number) {
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
