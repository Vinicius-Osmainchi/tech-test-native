import { prisma } from "../../../../../shared/infra/database/prisma/client";
import { Customer, UpdateCustomerData, CityTotal } from "../../../domain/Customer";

export class CustomerRepository {
  async findById(id: number): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        city: true,
      },
    });

    if (!customer) {
      return null;
    }

    const { city_id, city, ...rest } = customer;

    return {
      ...rest,
      city: city.name,
    };
  }

  async findByCity(
    cityName: string,
    page: number,
    limit: number,
  ): Promise<{
    customers: Omit<Customer, "gender" | "title">[];
    total: number;
  }> {
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
        include: {
          city: true,
        },
      }),
      prisma.customer.count({
        where: {
          city: {
            name: cityName,
          },
        },
      }),
    ]);

    const customersFormatted = customers.map((customer) => {
      const { city_id, city, gender, title, ...rest } = customer;
      return {
        ...rest,
        city: city.name,
      };
    });

    return {
      customers: customersFormatted,
      total,
    };
  }

  async getTotalsByCity(): Promise<CityTotal[]> {
    const totals = await prisma.customer.groupBy({
      by: ["city_id"],
      _count: {
        id: true,
      },
    });

    const cities = await prisma.city.findMany({
      where: {
        id: {
          in: totals.map((t) => t.city_id),
        },
      },
    });

    return totals.map((total) => {
      const city = cities.find((c) => c.id === total.city_id);
      return {
        city: city?.name || "",
        customers_total: total._count.id,
      };
    });
  }

  async update(data: UpdateCustomerData): Promise<Customer> {
    const { id, city, ...rest } = data;

    const updateData: Omit<UpdateCustomerData, "id" | "city"> & { city_id?: number } = {
      ...rest,
    };

    if (city) {
      const cityRecord = await prisma.city.upsert({
        where: { name: city },
        update: {},
        create: { name: city },
      });
      updateData.city_id = cityRecord.id;
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: updateData,
      include: {
        city: true,
      },
    });

    const { city_id, city: cityData, ...customerData } = updatedCustomer;

    return {
      ...customerData,
      city: cityData.name,
    };
  }

  async exists(id: number): Promise<boolean> {
    const customer = await prisma.customer.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!customer;
  }
}
