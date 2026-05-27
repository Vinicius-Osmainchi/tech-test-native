import { GetCustomersTotalByCityUseCase } from './GetCustomersTotalByCityUseCase';
import { InMemoryCustomersRepository } from './repositories/in-memory/InMemoryCustomersRepository';

describe('GetCustomersTotalByCityUseCase', () => {
  let inMemoryCustomersRepository: InMemoryCustomersRepository;
  let useCase: GetCustomersTotalByCityUseCase;

  beforeEach(() => {
    inMemoryCustomersRepository = new InMemoryCustomersRepository();
    useCase = new GetCustomersTotalByCityUseCase(inMemoryCustomersRepository);
  });

  it('should be able to get total customers grouped by city', async () => {
    inMemoryCustomersRepository.items.push(
      { id: 1, firstName: 'A', lastName: 'B', email: '1@a.com', city: 'City A' },
      { id: 2, firstName: 'C', lastName: 'D', email: '2@a.com', city: 'City A' },
      { id: 3, firstName: 'E', lastName: 'F', email: '3@a.com', city: 'City B' }
    );

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ city: 'City A', customers_total: 2 }),
        expect.objectContaining({ city: 'City B', customers_total: 1 }),
      ])
    );
  });
});