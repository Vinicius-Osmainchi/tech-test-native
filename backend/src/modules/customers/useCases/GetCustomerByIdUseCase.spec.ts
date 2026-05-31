import { GetCustomerByIdUseCase } from "./GetCustomerByIdUseCase";
import { prisma } from "../../../shared/infra/database/prisma/client";
import { apiErrorCodes } from "../../../shared/errors/apiErrorCodes";

jest.mock("../../../shared/infra/database/prisma/client", () => ({
  prisma: {
    customer: { findUnique: jest.fn() },
  },
}));

describe("GetCustomerByIdUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return customer details with city name", async () => {
    const mockCustomer = {
      id: 1,
      first_name: "Laura",
      last_name: "Richards",
      email: "lrichards0@reverbnation.com",
      gender: "Female",
      company: "Meezzy",
      title: "Biostatistician III",
      city_id: 1,
      city: { id: 1, name: "Warner, NH" },
    };

    (prisma.customer.findUnique as jest.Mock).mockResolvedValue(mockCustomer);

    const useCase = new GetCustomerByIdUseCase();
    const result = await useCase.execute(1);

    expect(prisma.customer.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { city: true },
    });

    expect(result).toEqual({
      id: 1,
      first_name: "Laura",
      last_name: "Richards",
      email: "lrichards0@reverbnation.com",
      gender: "Female",
      company: "Meezzy",
      title: "Biostatistician III",
      city: "Warner, NH",
    });
  });

  it("should throw when customer is not found", async () => {
    (prisma.customer.findUnique as jest.Mock).mockResolvedValue(null);

    const useCase = new GetCustomerByIdUseCase();

    await expect(useCase.execute(999)).rejects.toMatchObject({
      message: "Customer not found",
      statusCode: 404,
      code: apiErrorCodes.CUSTOMER_NOT_FOUND,
    });
  });
});
