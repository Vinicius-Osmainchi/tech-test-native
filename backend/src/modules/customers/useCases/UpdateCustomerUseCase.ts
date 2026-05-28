import { prisma } from "../../../shared/infra/database/prisma/client";

interface UpdateCustomerRequest {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  gender?: string;
  company?: string;
  title?: string;
  city?: string;
}

export class UpdateCustomerUseCase {
  async execute(data: UpdateCustomerRequest) {
    const { id, city, ...rest } = data;

    const customerExists = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customerExists) {
      throw new Error("Customer not found");
    }

    let cityId = customerExists.city_id;

    if (city) {
      const cityRecord = await prisma.city.upsert({
        where: { name: city },
        update: {},
        create: { name: city },
      });
      cityId = cityRecord.id;
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        ...rest,
        city_id: cityId,
      },
      include: {
        city: true,
      },
    });

    const { city_id: _city_id, city: cityData, ...customerData } = updatedCustomer;

    return {
      ...customerData,
      city: cityData.name,
    };
  }
}
