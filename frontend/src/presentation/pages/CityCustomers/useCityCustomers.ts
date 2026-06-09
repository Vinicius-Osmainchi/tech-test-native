import { useState, useEffect, useCallback } from "react";
import {
  type Customer,
  CustomerService,
  type PaginatedCustomers,
} from "../../../data/services/customerService";
import { socket } from "../../../data/services/socket";
import { uiMessages } from "../../../shared/messages";

export const useCityCustomers = (cityName: string | undefined) => {
  const [data, setData] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchCustomers = useCallback(() => {
    if (!cityName) {
      Promise.resolve().then(() => setLoading(false));
      return () => {};
    }

    let isMounted = true;

    CustomerService.getCustomersByCity(cityName, currentPage, pageSize)
      .then((response: PaginatedCustomers) => {
        if (isMounted) {
          setData(response.customers);
          setTotal(response.total);
          setError(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError(uiMessages.cityCustomersLoadFailed);
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
  }, [cityName, currentPage, pageSize]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    socket.on("customer_updated", fetchCustomers);

    return () => {
      socket.off("customer_updated", fetchCustomers);
    };
  }, [fetchCustomers]);

  const handlePageChange = (page: number) => {
    setLoading(true);
    setCurrentPage(page);
  };

  return {
    data,
    total,
    loading,
    error,
    currentPage,
    pageSize,
    handlePageChange,
  };
};
