import { UpdateCustomerUseCase } from "./UpdateCustomerUseCase";
import { CustomerRepository } from "../infra/database/repositories/CustomerRepository";
import { apiErrorCodes } from "../../../shared/errors/apiErrorCodes";

jest.mock("../infra/database/repositories/CustomerRepository");

describe("UpdateCustomerUseCase", () => {
  let customerRepository: jest.Mocked<CustomerRepository>;
  let useCase: UpdateCustomerUseCase;

  beforeEach(() => {
    customerRepository = new CustomerRepository() as jest.Mocked<CustomerRepository>;
    useCase = new UpdateCustomerUseCase(customerRepository);
  });

  it("should update a customer when exists", async () => {
    const mockUpdatedCustomer = {
      id: 1,
      first_name: "John",
      last_name: "Updated",
      email: "john.updated@example.com",
      phone: "1234567890",
      city: "New York",
      gender: "Male",
      company: "Acme",
      title: "Engineer",
    };

    customerRepository.exists.mockResolvedValue(true);
    customerRepository.update.mockResolvedValue(mockUpdatedCustomer);

    const result = await useCase.execute({
      id: 1,
      first_name: "John",
      last_name: "Updated",
      email: "john.updated@example.com",
    });

    expect(result).toEqual(mockUpdatedCustomer);
    expect(customerRepository.exists).toHaveBeenCalledWith(1);
    expect(customerRepository.update).toHaveBeenCalledWith({
      id: 1,
      first_name: "John",
      last_name: "Updated",
      email: "john.updated@example.com",
    });
  });

  it("should throw AppError when customer not found", async () => {
    customerRepository.exists.mockResolvedValue(false);

    await expect(
      useCase.execute({
        id: 999,
        first_name: "John",
        last_name: "Updated",
        email: "john.updated@example.com",
      }),
    ).rejects.toMatchObject({
      message: "Customer not found",
      statusCode: 404,
      code: apiErrorCodes.CUSTOMER_NOT_FOUND,
    });
  });
});
