import { ListCustomersByCityUseCase } from "./ListCustomersByCityUseCase";
import { prisma } from "../../../shared/infra/database/prisma/client";

jest.mock("../../../shared/infra/database/prisma/client", () => ({
  prisma: {
    customer: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe("ListCustomersByCityUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return paginated customers filtered by city", async () => {
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
      },
    ];

    (prisma.customer.findMany as jest.Mock).mockResolvedValue(mockCustomers);
    (prisma.customer.count as jest.Mock).mockResolvedValue(25);

    const useCase = new ListCustomersByCityUseCase();
    const result = await useCase.execute("Warner, NH", 1, 10);

    expect(prisma.customer.findMany).toHaveBeenCalledWith({
      where: { city: { name: "Warner, NH" } },
      skip: 0,
      take: 10,
    });

    expect(prisma.customer.count).toHaveBeenCalledWith({
      where: { city: { name: "Warner, NH" } },
    });

    expect(result).toEqual({
      customers: mockCustomers,
      total: 25,
    });
  });

  it("should calculate skip offset based on page number", async () => {
    (prisma.customer.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.customer.count as jest.Mock).mockResolvedValue(0);

    const useCase = new ListCustomersByCityUseCase();
    await useCase.execute("Warner, NH", 3, 10);

    expect(prisma.customer.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 20, take: 10 }),
    );
  });
});
