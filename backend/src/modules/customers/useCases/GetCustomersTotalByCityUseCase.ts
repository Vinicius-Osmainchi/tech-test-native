import { prisma } from "../../../shared/infra/database/prisma/client";

export class GetCustomersTotalByCityUseCase {
  async execute() {
    const cities = await prisma.city.findMany({
      select: {
        name: true,
        _count: {
          select: {
            customers: true,
          },
        },
      },
    });

    return cities.map((city: { name: string; _count: { customers: number } }) => ({
      city: city.name,
      customers_total: city._count.customers,
    }));
  }
}
