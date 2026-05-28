import { ListCustomersByCityUseCase } from "./ListCustomersByCityUseCase";
import { prisma } from "../../../shared/infra/database/prisma/client";

jest.mock("../../../shared/infra/database/prisma/client", () => ({
  prisma: {
    customer: { findMany: jest.fn() },
  },
}));

describe("ListCustomersByCityUseCase", () => {
  it("should return the customer list filtered by a specific city", async () => {
    const mockCustomers = [
      {
        id: 1,
        first_name: "Laura",
        last_name: "Richards",
        email: "lrichards0@reverbnation.com",
        gender: "Female",
        company: "Meezzy",
        title: "Biostatistician III",
        city_id: 1,
        city: { id: 1, name: "Warner, NH" },
      },
    ];

    (prisma.customer.findMany as jest.Mock).mockResolvedValue(mockCustomers);

    const useCase = new ListCustomersByCityUseCase();
    const result = await useCase.execute("Warner, NH");

    expect(prisma.customer.findMany).toHaveBeenCalledWith({
      where: { city: { name: "Warner, NH" } },
      include: { city: true },
    });

    expect(result).toEqual([
      {
        id: 1,
        first_name: "Laura",
        last_name: "Richards",
        email: "lrichards0@reverbnation.com",
        gender: "Female",
        company: "Meezzy",
        title: "Biostatistician III",
        city: "Warner, NH",
      },
    ]);
  });
});
