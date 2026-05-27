import { ICustomersRepository, PaginatedCustomers } from "../repositories/ICustomersRepository";

interface Request {
  city: string;
  page?: number;
  limit?: number;
}

export class ListCustomersByCityUseCase {
  constructor(private customersRepository: ICustomersRepository) {}

  async execute({ city, page = 1, limit = 10 }: Request): Promise<PaginatedCustomers> {
    if (!city || city.trim() === "") {
      throw new Error("City is required");
    }

    return this.customersRepository.findManyByCity(city, page, limit);
  }
}
