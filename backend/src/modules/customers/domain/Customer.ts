export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender?: string | null;
  company?: string | null;
  city: string;
  title?: string | null;
}
