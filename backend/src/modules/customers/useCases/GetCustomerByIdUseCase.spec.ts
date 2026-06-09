import { GetCustomerByIdUseCase } from "./GetCustomerByIdUseCase";
import { CustomerRepository } from "../infra/database/repositories/CustomerRepository";
import { apiErrorCodes } from "../../../shared/errors/apiErrorCodes";

jest.mock("../infra/database/repositories/CustomerRepository");

describe("GetCustomerByIdUseCase", () => {
  let customerRepository: jest.Mocked<CustomerRepository>;
  let useCase: GetCustomerByIdUseCase;

  beforeEach(() => {
    customerRepository = new CustomerRepository() as jest.Mocked<CustomerRepository>;
    useCase = new GetCustomerByIdUseCase(customerRepository);
  });

  it("should return a customer when found", async () => {
    const mockCustomer = {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      phone: "1234567890",
      city: "New York",
      gender: "Male",
      company: "Acme",
      title: "Engineer",
    };

    customerRepository.findById.mockResolvedValue(mockCustomer);

    const result = await useCase.execute(1);

    expect(result).toEqual(mockCustomer);
    expect(customerRepository.findById).toHaveBeenCalledWith(1);
  });

  it("should throw AppError when customer not found", async () => {
    customerRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(999)).rejects.toMatchObject({
      message: "Customer not found",
      statusCode: 404,
      code: apiErrorCodes.CUSTOMER_NOT_FOUND,
    });
  });
});
