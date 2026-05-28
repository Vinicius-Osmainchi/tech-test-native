import { InMemoryCustomersRepository } from "../repositories/in-memory/InMemoryCustomersRepository";
import { UpdateCustomerUseCase } from "./UpdateCustomerUseCase";

describe("UpdateCustomerUseCase", () => {
  let inMemoryCustomersRepository: InMemoryCustomersRepository;
  let useCase: UpdateCustomerUseCase;

  beforeEach(() => {
    inMemoryCustomersRepository = new InMemoryCustomersRepository();
    useCase = new UpdateCustomerUseCase(inMemoryCustomersRepository);
  });

  it("should be able to update a customer", async () => {
    inMemoryCustomersRepository.items.push({
      id: 1,
      firstName: "Old",
      lastName: "Name",
      email: "old@example.com",
      city: "Old City",
    });

    const updatedCustomer = await useCase.execute(1, {
      firstName: "New",
      city: "New City",
    });

    expect(updatedCustomer.firstName).toBe("New");
    expect(updatedCustomer.city).toBe("New City");
    expect(updatedCustomer.email).toBe("old@example.com");
  });

  it("should not be able to update a non-existing customer", async () => {
    await expect(useCase.execute(999, { firstName: "Test" })).rejects.toThrow("Customer not found");
  });

  it("should not be able to update to an email already in use by another customer", async () => {
    inMemoryCustomersRepository.items.push(
      { id: 1, firstName: "A", lastName: "B", email: "a@example.com", city: "City" },
      { id: 2, firstName: "C", lastName: "D", email: "b@example.com", city: "City" },
    );

    await expect(useCase.execute(1, { email: "b@example.com" })).rejects.toThrow(
      "Email already in use",
    );
  });
});
