import type { Dispatch, SetStateAction } from "react";
import { useChart } from "../../hooks/useChart";
import { emptyStats, useStats } from "../../hooks/useStats";
import { useTimer } from "../../hooks/useTimer";
import { ChartCard } from "./ChartCard";
import { StatCard } from "./StatCard";

export const Stats = ({
  setIsAnimationActive,
}: {
  setIsAnimationActive: Dispatch<SetStateAction<boolean>>;
}) => {
  const { data, isLoading, isError, refetch, isRefetching, dataUpdatedAt } =
    useStats(setIsAnimationActive);
  const { burnedCanvasRef, distributedCanvasRef } = useChart(data?.history);
  const updatedAtTime = useTimer(dataUpdatedAt);
  return (
    <section className="container relative z-10 mx-auto flex w-full flex-col gap-4 px-6 md:max-w-5xl 2xl:max-w-6xl">
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <ChartCard
          updatedAtTime={updatedAtTime}
          isRefetching={isRefetching}
          refetch={refetch}
          title={"Burned STARS"}
          canvasRef={burnedCanvasRef}
          isLoading={isLoading}
          isError={isError}
        />
        <div className="grid gap-6 md:grid-rows-2">
          <StatCard
            minimumDate={data?.stats.burned[0]?.minimumDate}
            updatedAtTime={updatedAtTime}
            stat={data?.stats.burned[0] ?? emptyStats.burned[0]}
            isLoading={isLoading}
          />
          <StatCard
            updatedAtTime={updatedAtTime}
            minimumDate={data?.stats.burned[1]?.minimumDate}
            stat={data?.stats.burned[1] ?? emptyStats.burned[1]}
            isLoading={isLoading}
          />
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        <div className="grid gap-6 md:grid-rows-2">
          <StatCard
            updatedAtTime={updatedAtTime}
            minimumDate={data?.stats.distributed[0]?.minimumDate}
            stat={data?.stats.distributed[0] ?? emptyStats.distributed[0]}
            isLoading={isLoading}
          />
          <StatCard
            updatedAtTime={updatedAtTime}
            minimumDate={data?.stats.distributed[1]?.minimumDate}
            stat={data?.stats.distributed[1] ?? emptyStats.distributed[1]}
            isLoading={isLoading}
          />
        </div>
        <ChartCard
          updatedAtTime={updatedAtTime}
          isRefetching={isRefetching}
          refetch={refetch}
          title={"Distributed to Stakers"}
          canvasRef={distributedCanvasRef}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </section>
  );
};
