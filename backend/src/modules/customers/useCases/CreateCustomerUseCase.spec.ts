import { InMemoryCustomersRepository } from "../repositories/in-memory/InMemoryCustomersRepository";
import { CreateCustomerUseCase } from "./CreateCustomerUseCase";

describe("CreateCustomerUseCase", () => {
  let inMemoryCustomersRepository: InMemoryCustomersRepository;
  let createCustomerUseCase: CreateCustomerUseCase;

  beforeEach(() => {
    inMemoryCustomersRepository = new InMemoryCustomersRepository();
    createCustomerUseCase = new CreateCustomerUseCase(inMemoryCustomersRepository);
  });

  it("should be able to create a new customer", async () => {
    const customer = await createCustomerUseCase.execute({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      city: "New York",
    });

    expect(customer).toHaveProperty("id");
    expect(customer.firstName).toBe("John");
  });

  it("should not be able to create a customer with an existing email", async () => {
    await createCustomerUseCase.execute({
      firstName: "John",
      lastName: "Doe",
      email: "existing@example.com",
      city: "New York",
    });

    await expect(
      createCustomerUseCase.execute({
        firstName: "Jane",
        lastName: "Doe",
        email: "existing@example.com",
        city: "Boston",
      }),
    ).rejects.toThrow("Customer with this email already exists");
  });
});
