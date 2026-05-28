import { UpdateCustomerUseCase } from "./UpdateCustomerUseCase";
import { prisma } from "../../../shared/infra/database/prisma/client";

jest.mock("../../../shared/infra/database/prisma/client", () => ({
  prisma: {
    customer: { findUnique: jest.fn(), update: jest.fn() },
    city: { upsert: jest.fn() },
  },
}));

describe("UpdateCustomerUseCase", () => {
  it("should update a customer and create a new city if necessary", async () => {
    const mockExistingCustomer = { id: 1, city_id: 1 };
    const mockNewCity = { id: 2, name: "New City" };
    const mockUpdatedCustomer = {
      id: 1,
      first_name: "Laura Updated",
      last_name: "Richards",
      email: "lrichards0@reverbnation.com",
      gender: "Female",
      company: "Meezzy",
      title: "Biostatistician III",
      city_id: 2,
      city: { id: 2, name: "New City" },
    };

    (prisma.customer.findUnique as jest.Mock).mockResolvedValue(mockExistingCustomer);
    (prisma.city.upsert as jest.Mock).mockResolvedValue(mockNewCity);
    (prisma.customer.update as jest.Mock).mockResolvedValue(mockUpdatedCustomer);

    const useCase = new UpdateCustomerUseCase();
    const result = await useCase.execute({
      id: 1,
      first_name: "Laura Updated",
      city: "New City",
    });

    expect(prisma.city.upsert).toHaveBeenCalledWith({
      where: { name: "New City" },
      update: {},
      create: { name: "New City" },
    });

    expect(result.first_name).toBe("Laura Updated");
    expect(result.city).toBe("New City");
  });

  it("should throw an error if the customer to be updated does not exist", async () => {
    (prisma.customer.findUnique as jest.Mock).mockResolvedValue(null);
    const useCase = new UpdateCustomerUseCase();

    await expect(useCase.execute({ id: 999, first_name: "Nonexistent" })).rejects.toThrow(
      "Customer not found",
    );
  });
});
