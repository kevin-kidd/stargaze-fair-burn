import ky from "ky";
import type { Dispatch, SetStateAction } from "react";
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

export const useStats = (
  setIsAnimationActive: Dispatch<SetStateAction<boolean>>,
  setTotalBurned: Dispatch<SetStateAction<string>>
) => {
  const [history, setHistory] = useState<HistoricalData>();
  const [previousStats, setPreviousStats] = useState<{
    distributed: Stat[];
    burned: Stat[];
  }>();
  const { data, isLoading, isError, refetch, isRefetching, dataUpdatedAt } =
    useQuery("stats", getStats, {
      refetchInterval: 30 * 1000,
    });
  useEffect(() => {
    if (
      data &&
      data.history &&
      JSON.stringify(data.history) !== JSON.stringify(history)
    ) {
      setHistory(data.history);
    }
    if (data) {
      if (!previousStats) {
        setPreviousStats(data.stats);
      } else if (JSON.stringify(previousStats) !== JSON.stringify(data.stats)) {
        setIsAnimationActive(true);
        setTimeout(() => {
          setIsAnimationActive(false);
        }, 4000);
        setPreviousStats(data.stats);
      }
      if (data.stats.burned[0]?.value !== undefined) {
        setTotalBurned(
          Math.round(data.stats.burned[0]?.value).toLocaleString()
        );
      }
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
  minimumDate?: string;
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
      id: "loading-daily-average-burn",
      title: "Daily Average Burned",
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
      id: "loading-daily-average-distributed",
      title: "Daily Average Distributed",
      value: 0,
    },
    {
      id: "loading-distributed-today",
      title: "Distributed Today",
      value: 0,
    },
  ],
};
