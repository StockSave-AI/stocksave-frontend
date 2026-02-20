import { useEffect, useState } from "react";
import { getDashboardData } from "../services/dashboardService";

export default function useDashboardData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getDashboardData();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading };
}
