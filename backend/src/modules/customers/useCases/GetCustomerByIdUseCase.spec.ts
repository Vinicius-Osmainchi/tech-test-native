import { InMemoryCustomersRepository } from "../repositories/in-memory/InMemoryCustomersRepository";
import { GetCustomerByIdUseCase } from "./GetCustomerByIdUseCase";

describe("GetCustomerByIdUseCase", () => {
  let inMemoryCustomersRepository: InMemoryCustomersRepository;
  let useCase: GetCustomerByIdUseCase;

  beforeEach(() => {
    inMemoryCustomersRepository = new InMemoryCustomersRepository();
    useCase = new GetCustomerByIdUseCase(inMemoryCustomersRepository);
  });

  it("should be able to get a customer by id", async () => {
    inMemoryCustomersRepository.items.push({
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      city: "Test City",
    });

    const customer = await useCase.execute(1);

    expect(customer).toHaveProperty("id");
    expect(customer.id).toBe(1);
    expect(customer.firstName).toBe("John");
  });

  it("should not be able to get a non-existing customer", async () => {
    await expect(useCase.execute(999)).rejects.toThrow("Customer not found");
  });
});
