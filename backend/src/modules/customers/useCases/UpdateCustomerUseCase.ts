import { prisma } from "../../../shared/infra/database/prisma/client";
import { UpdateCustomerData } from "../domain/customer";

export class UpdateCustomerUseCase {
  async execute(data: UpdateCustomerData) {
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
