import { ListCustomersByCityUseCase } from "./ListCustomersByCityUseCase";
import { CustomerRepository } from "../infra/database/repositories/CustomerRepository";

jest.mock("../infra/database/repositories/CustomerRepository");

describe("ListCustomersByCityUseCase", () => {
  let customerRepository: jest.Mocked<CustomerRepository>;
  let useCase: ListCustomersByCityUseCase;

  beforeEach(() => {
    customerRepository = new CustomerRepository() as jest.Mocked<CustomerRepository>;
    useCase = new ListCustomersByCityUseCase(customerRepository);
  });

  it("should return customers by city", async () => {
    const mockCustomers = {
      customers: [
        {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com",
          phone: "1234567890",
          city: "New York",
          gender: "Male",
          company: "Acme",
          title: "Engineer",
        },
      ],
      total: 1,
    };

    customerRepository.findByCity.mockResolvedValue(mockCustomers);

    const result = await useCase.execute("New York", 1, 10);

    expect(result).toEqual(mockCustomers);
    expect(customerRepository.findByCity).toHaveBeenCalledWith("New York", 1, 10);
  });
});
