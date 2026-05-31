import { prisma } from "../../../shared/infra/database/prisma/client";
import { Customer } from "../domain/customer";
import { AppError } from "../../../shared/errors/AppError";
import { apiErrorCodes } from "../../../shared/errors/apiErrorCodes";

export class GetCustomerByIdUseCase {
  async execute(id: number): Promise<Customer> {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        city: true,
      },
    });

    if (!customer) {
      throw new AppError("Customer not found", 404, apiErrorCodes.CUSTOMER_NOT_FOUND);
    }

    const { city_id, city, ...rest } = customer;

    return {
      ...rest,
      city: city.name,
    };
  }
}
