import { GetCustomersTotalByCityUseCase } from "./GetCustomersTotalByCityUseCase";
import { CustomerRepository } from "../infra/database/repositories/CustomerRepository";

jest.mock("../infra/database/repositories/CustomerRepository");

describe("GetCustomersTotalByCityUseCase", () => {
  let customerRepository: jest.Mocked<CustomerRepository>;
  let useCase: GetCustomersTotalByCityUseCase;

  beforeEach(() => {
    customerRepository = new CustomerRepository() as jest.Mocked<CustomerRepository>;
    useCase = new GetCustomersTotalByCityUseCase(customerRepository);
  });

  it("should return total customers by city", async () => {
    const mockTotals = [
      { city: "New York", customers_total: 100 },
      { city: "Los Angeles", customers_total: 50 },
    ];

    customerRepository.getTotalsByCity.mockResolvedValue(mockTotals);

    const result = await useCase.execute();

    expect(result).toEqual(mockTotals);
    expect(customerRepository.getTotalsByCity).toHaveBeenCalled();
  });
});
