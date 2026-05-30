import { GetCustomersTotalByCityUseCase } from "./GetCustomersTotalByCityUseCase";
import { prisma } from "../../../shared/infra/database/prisma/client";

jest.mock("../../../shared/infra/database/prisma/client", () => ({
  prisma: {
    city: { findMany: jest.fn() },
  },
}));

describe("GetCustomersTotalByCityUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should map prisma result to API response format", async () => {
    const mockCities = [
      { name: "Warner, NH", _count: { customers: 20 } },
      { name: "Lisboa", _count: { customers: 15 } },
    ];

    (prisma.city.findMany as jest.Mock).mockResolvedValue(mockCities);

    const useCase = new GetCustomersTotalByCityUseCase();
    const result = await useCase.execute();

    expect(prisma.city.findMany).toHaveBeenCalledWith({
      select: {
        name: true,
        _count: { select: { customers: true } },
      },
    });

    expect(result).toEqual([
      { city: "Warner, NH", customers_total: 20 },
      { city: "Lisboa", customers_total: 15 },
    ]);
  });

  it("should return empty array when there are no cities", async () => {
    (prisma.city.findMany as jest.Mock).mockResolvedValue([]);

    const useCase = new GetCustomersTotalByCityUseCase();
    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
