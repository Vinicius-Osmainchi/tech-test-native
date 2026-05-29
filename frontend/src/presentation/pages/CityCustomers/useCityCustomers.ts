import { useState, useEffect } from "react";
import { type Customer, CustomerService } from "../../../data/services/CustomerService";

export const useCityCustomers = (cityName: string | undefined) => {
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!cityName) {
      Promise.resolve().then(() => {
        if (isMounted) setLoading(false);
      });
      return;
    }

    CustomerService.getCustomersByCity(cityName)
      .then((response) => {
        if (isMounted) {
          setData(response);
          setError(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("Não foi possível carregar os clientes desta cidade.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [cityName]);

  return {
    data,
    loading,
    error,
  };
};
