import { InMemoryCustomersRepository } from "../repositories/in-memory/InMemoryCustomersRepository";
import { ListCustomersByCityUseCase } from "./ListCustomersByCityUseCase";

describe("ListCustomersByCityUseCase", () => {
  let inMemoryCustomersRepository: InMemoryCustomersRepository;
  let useCase: ListCustomersByCityUseCase;

  beforeEach(() => {
    inMemoryCustomersRepository = new InMemoryCustomersRepository();
    useCase = new ListCustomersByCityUseCase(inMemoryCustomersRepository);
  });

  it("should be able to list customers by city with pagination", async () => {
    for (let i = 1; i <= 15; i++) {
      inMemoryCustomersRepository.items.push({
        id: i,
        firstName: `Name ${i}`,
        lastName: "Test",
        email: `${i}@test.com`,
        city: "Test City",
      });
    }

    inMemoryCustomersRepository.items.push({
      id: 16,
      firstName: "Other",
      lastName: "City",
      email: "16@test.com",
      city: "Other City",
    });

    const page1 = await useCase.execute({ city: "Test City", page: 1, limit: 10 });
    expect(page1.customers).toHaveLength(10);
    expect(page1.total).toBe(15);

    const page2 = await useCase.execute({ city: "Test City", page: 2, limit: 10 });
    expect(page2.customers).toHaveLength(5);
    expect(page2.total).toBe(15);
  });

  it("should throw an error if city is not provided", async () => {
    await expect(useCase.execute({ city: "" })).rejects.toThrow("City is required");
  });
});
