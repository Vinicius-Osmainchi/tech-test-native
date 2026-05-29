import { api } from "./api";

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  company: string;
  city: string;
  title: string;
}

export interface CityTotal {
  city: string;
  customers_total: number;
}

export interface PaginatedResponse {
  customers: Customer[];
  total: number;
}

export const CustomerService = {
  getTotalsByCity: async (): Promise<CityTotal[]> => {
    const response = await api.get<CityTotal[]>("/customers/totals-by-city");
    return response.data;
  },

  getCustomersByCity: async (
    city: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse> => {
    const response = await api.get<PaginatedResponse>("/customers", {
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
