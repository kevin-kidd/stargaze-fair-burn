import { useChart } from "../../hooks/useChart";
import { emptyStats, useStats } from "../../hooks/useStats";
import { useTimer } from "../../hooks/useTimer";
import { ChartCard } from "./ChartCard";
import { StatCard } from "./StatCard";

export const Stats = () => {
  const { data, isLoading, isError, refetch, isRefetching, dataUpdatedAt } =
    useStats();
  const { burnedCanvasRef, distributedCanvasRef } = useChart(data?.history);
  const updatedAtTime = useTimer(dataUpdatedAt);
  return (
    <section className="container relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 pb-20">
      <div className="grid w-full grid-cols-2 gap-6">
        <ChartCard
          updatedAtTime={updatedAtTime}
          isRefetching={isRefetching}
          refetch={refetch}
          title={"Burned STARS"}
          canvasRef={burnedCanvasRef}
          isLoading={isLoading}
          isError={isError}
        />
        <div className="grid grid-rows-2 gap-6">
          <StatCard
            updatedAtTime={updatedAtTime}
            stat={data?.stats.burned[0] ?? emptyStats.burned[0]}
            isLoading={isLoading}
            isError={isError}
          />
          <StatCard
            updatedAtTime={updatedAtTime}
            stat={data?.stats.burned[1] ?? emptyStats.burned[1]}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
      </div>
      <div className="grid w-full grid-cols-2 gap-6">
        <div className="grid grid-rows-2 gap-6">
          <StatCard
            updatedAtTime={updatedAtTime}
            stat={data?.stats.distributed[0] ?? emptyStats.distributed[0]}
            isLoading={isLoading}
            isError={isError}
          />
          <StatCard
            updatedAtTime={updatedAtTime}
            stat={data?.stats.distributed[1] ?? emptyStats.distributed[1]}
            isLoading={isLoading}
            isError={isError}
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
