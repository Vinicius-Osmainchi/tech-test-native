import { useState, useEffect, useCallback } from "react";
import { type Customer, CustomerService } from "../../../data/services/CustomerService";
import { socket } from "../../../data/services/socket";

export const useCityCustomers = (cityName: string | undefined) => {
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(() => {
    if (!cityName) {
      Promise.resolve().then(() => setLoading(false));
      return () => {};
    }

    let isMounted = true;

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

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    socket.on("customer_updated", fetchCustomers);

    return () => {
      socket.off("customer_updated", fetchCustomers);
    };
  }, [fetchCustomers]);

  return {
    data,
    loading,
    error,
  };
};
