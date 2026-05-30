import { api } from "./api";
import type { CityTotal, Customer, PaginatedCustomers } from "../../domain/models/Customer";

export type { CityTotal, Customer, PaginatedCustomers };

export const CustomerService = {
  getTotalsByCity: async (): Promise<CityTotal[]> => {
    const response = await api.get<CityTotal[]>("/customers/totals-by-city");
    return response.data;
  },

  getCustomersByCity: async (
    city: string,
    page: number,
    limit: number,
  ): Promise<PaginatedCustomers> => {
    const response = await api.get<PaginatedCustomers>("/customers", {
      params: { city, page, limit },
    });
    return response.data;
  },
  getCustomerById: async (id: number): Promise<Customer> => {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  updateCustomer: async (id: number, data: Partial<Customer>): Promise<Customer> => {
    const response = await api.put<Customer>(`/customers/${id}`, data);
    return response.data;
  },
};
