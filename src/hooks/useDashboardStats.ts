import { useEffect } from "react";
import { DASHBOARD_STATS_URL } from "@definitions/apiEndpoints";
import getAllDataFetcher from "src/fetchers/getAllDataFetcher";
import useSWR from "swr";

export default function useDashboardStats() {
  const { data, error } = useSWR(DASHBOARD_STATS_URL, getAllDataFetcher);

  useEffect(() => {
    if (error) {
      console.error("Error when fetching campaign: ", error);
    }
  }, [error]);

  return {
    stats: data,
    isLoading: !error && !data,
    isError: error,
  };
}
