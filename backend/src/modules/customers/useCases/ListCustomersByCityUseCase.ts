import { prisma } from "../../../shared/infra/database/prisma/client";

export class ListCustomersByCityUseCase {
  async execute(cityName: string) {
    const customers = await prisma.customer.findMany({
      where: {
        city: {
          name: cityName,
        },
      },
      include: {
        city: true,
      },
    });

    return customers.map((customer) => {
      const { city_id, city, ...rest } = customer;
      return {
        ...rest,
        city: city.name,
      };
    });
  }
}
