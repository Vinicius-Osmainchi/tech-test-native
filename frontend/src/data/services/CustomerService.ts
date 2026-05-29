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

export const CustomerService = {
  getTotalsByCity: async (): Promise<CityTotal[]> => {
    const response = await api.get<CityTotal[]>("/customers/totals-by-city");
    return response.data;
  },

  getCustomersByCity: async (city: string): Promise<Customer[]> => {
    const response = await api.get<Customer[]>("/customers", {
      params: { city },
    });
    return response.data;
  },
};
