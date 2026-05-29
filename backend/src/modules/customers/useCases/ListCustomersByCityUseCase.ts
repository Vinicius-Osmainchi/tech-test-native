import { prisma } from "../../../shared/infra/database/prisma/client";

export class ListCustomersByCityUseCase {
  async execute(cityName: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where: {
          city: {
            name: cityName,
          },
        },
        skip,
        take: limit,
      }),
      prisma.customer.count({
        where: {
          city: {
            name: cityName,
          },
        },
      }),
    ]);

    return {
      customers,
      total,
    };
  }
}
