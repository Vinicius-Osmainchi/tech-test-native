import { prisma } from "../../../shared/infra/database/prisma/client";
import { CityTotal } from "../domain/customer";

export class GetCustomersTotalByCityUseCase {
  async execute(): Promise<CityTotal[]> {
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
