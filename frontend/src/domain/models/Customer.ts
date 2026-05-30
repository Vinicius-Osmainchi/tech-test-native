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

export interface PaginatedCustomers {
  customers: Customer[];
  total: number;
}
