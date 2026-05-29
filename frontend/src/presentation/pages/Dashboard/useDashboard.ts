import { useEffect, useState, useCallback } from "react";
import { type CityTotal, CustomerService } from "../../../data/services/CustomerService";
import { socket } from "../../../data/services/socket";

export const useDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CityTotal[]>([]);

  const fetchDashboardData = useCallback(() => {
    let isMounted = true;

    CustomerService.getTotalsByCity()
      .then((totals) => {
        if (isMounted) {
          setData(totals);
          setError(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("Não foi possível carregar os dados do dashboard.");
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
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    socket.on("customer_updated", fetchDashboardData);

    return () => {
      socket.off("customer_updated", fetchDashboardData);
    };
  }, [fetchDashboardData]);

  const reload = async () => {
    setLoading(true);
    fetchDashboardData();
  };

  return { loading, error, data, reload };
};
