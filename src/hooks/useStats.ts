import ky from "ky";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

export type Row = [string, number, number];

const getStats = async () => {
  // Get the stats from the API
  const data: {
    history: HistoricalData;
    stats: {
      distributed: Stat[];
      burned: Stat[];
    };
  } = await ky.get("/api/stats").json();
  return data;
};

export const useStats = () => {
  const [history, setHistory] = useState<HistoricalData>();
  const { data, isLoading, isError, refetch, isRefetching, dataUpdatedAt } =
    useQuery("stats", getStats, {
      refetchInterval: 6000 * 1000,
    });
  useEffect(() => {
    if (
      data &&
      data.history &&
      JSON.stringify(data.history) !== JSON.stringify(history)
    ) {
      setHistory(data.history);
    }
  }, [data]);
  return {
    data,
    isLoading,
    isError,
    history,
    refetch,
    isRefetching,
    dataUpdatedAt,
  };
};

export type HistoricalData = {
  starsBurned: StarsBurnedRow[];
  distributedToStakers: DistributedToStakersRow[];
};

export type Stat = {
  value: number;
  id: string;
  title: string;
  changeRate?: number;
};

export type StarsBurnedRow = {
  burn_date: string;
  daily_burn: number;
  cumulative_burn: number;
};

export type DistributedToStakersRow = {
  dist_date: string;
  stakers_dist_amount: number;
  cumulative_dist: number;
};

export const emptyStats = {
  burned: [
    {
      id: "loading-total-burn",
      title: "Total Burned",
      value: 0,
    },
    {
      id: "loading-daily-average",
      title: "Daily Average",
      value: 0,
    },
    {
      id: "loading-burned-today",
      title: "Burned Today",
      value: 0,
    },
  ],
  distributed: [
    {
      id: "loading-total-distributed",
      title: "Total Distributed",
      value: 0,
    },
    {
      id: "loading-daily-average",
      title: "Daily Average",
      value: 0,
    },
    {
      id: "loading-distributed-today",
      title: "Distributed Today",
      value: 0,
    },
  ],
};
