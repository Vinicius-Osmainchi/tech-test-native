import { useEffect, useState } from "react";
import { CustomerService, type CityTotal } from "../../../data/services/CustomerService";

export const useDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CityTotal[]>([]);

  useEffect(() => {
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

  const reload = async () => {
    setLoading(true);
    try {
      const totals = await CustomerService.getTotalsByCity();
      setData(totals);
      setError(null);
    } catch {
      setError("Não foi possível carregar os dados do dashboard.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, reload };
};
