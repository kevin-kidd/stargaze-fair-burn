import classNames from "classnames";
import type { Stat } from "../../hooks/useStats";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { TbArrowBarToUp } from "react-icons/tb";
import dynamic from "next/dynamic";
import type { FunctionComponent } from "react";
const AnimatedNumbers = dynamic(() => import("react-animated-numbers"), {
  ssr: false,
});

export const StatCard: FunctionComponent<{
  stat?: Stat;
  isLoading: boolean;
  isError: boolean;
  updatedAtTime: string;
}> = ({ stat, isLoading, isError, updatedAtTime }) => {
  if (!stat) return <></>; // TODO: Add a placeholder
  return (
    <div className="relative flex w-full rounded-md border border-white/10 bg-slate-900 p-5">
      <div className="flex w-full flex-col gap-4">
        <span className="text-gray-400">{stat.title}</span>
        <span className="flex items-center gap-1 text-2xl text-white">
          {stat.value === 0 ? (
            "0"
          ) : (
            <AnimatedNumbers includeComma animateToNumber={stat.value} />
          )}
          <span className="text-gray-500">STARS</span>
        </span>
      </div>
      <div className="flex flex-col items-end justify-between whitespace-nowrap">
        <p
          className={classNames(
            stat.changeRate &&
              (stat.changeRate > 0
                ? "text-green-600"
                : stat.changeRate === 0
                ? "text-gray-300"
                : "text-red-600"),
            "flex font-semibold"
          )}
        >
          {stat.changeRate &&
            (stat.changeRate > 0 ? (
              <AiOutlineArrowUp
                className="h-4 w-4 flex-shrink-0 self-center text-green-500"
                aria-hidden="true"
              />
            ) : stat.changeRate === 0 ? (
              <TbArrowBarToUp
                className="h-4 w-4 flex-shrink-0 self-center text-gray-600"
                aria-hidden="true"
              />
            ) : (
              <AiOutlineArrowDown
                className="h-4 w-4 flex-shrink-0 self-center text-red-500"
                aria-hidden="true"
              />
            ))}
          <span className="sr-only">
            {" "}
            {stat.changeRate &&
              (stat.changeRate >= 0 ? "Increased" : "Decreased")}{" "}
            by{" "}
          </span>
          {stat.changeRate && stat.changeRate + "%"}
        </p>

        <p className="text-sm text-gray-500">
          {!isLoading && updatedAtTime && (
            <>
              Updated{" "}
              <span className="font-semibold text-gray-400">
                {updatedAtTime}
              </span>{" "}
              ago
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export const StatBox = ({
  stat,
  isLoading,
}: {
  stat: Stat;
  isLoading: boolean;
}) => {
  return (
    <div
      key={stat.id}
      className={classNames(
        "flex h-full w-full flex-col justify-self-center rounded-md border border-white/20 bg-black p-2",
        isLoading && "animate-pulse",
        stat.id.includes("total") ? "w-fit" : "w-full"
      )}
    >
      <span className="whitespace-nowrap text-xs font-semibold leading-4 text-gray-300">
        {stat.title}
      </span>
      <span className="flex flex-row gap-1 whitespace-nowrap font-semibold tracking-tight text-white lg:items-center lg:gap-2 lg:text-lg">
        {stat.value === 0 ? (
          "0"
        ) : (
          <AnimatedNumbers includeComma animateToNumber={stat.value} />
        )}
        {stat.changeRate !== undefined && (
          <p
            className={classNames(
              stat.changeRate > 0
                ? "text-green-600"
                : stat.changeRate === 0
                ? "text-gray-300"
                : "text-red-600",
              "flex text-xs font-semibold"
            )}
          >
            {stat.changeRate > 0 ? (
              <AiOutlineArrowUp
                className="h-4 w-4 flex-shrink-0 self-center text-green-500"
                aria-hidden="true"
              />
            ) : stat.changeRate === 0 ? (
              <TbArrowBarToUp
                className="h-4 w-4 flex-shrink-0 self-center text-gray-600"
                aria-hidden="true"
              />
            ) : (
              <AiOutlineArrowDown
                className="h-4 w-4 flex-shrink-0 self-center text-red-500"
                aria-hidden="true"
              />
            )}

            <span className="sr-only">
              {" "}
              {stat.changeRate >= 0 ? "Increased" : "Decreased"} by{" "}
            </span>
            {stat.changeRate + "%"}
          </p>
        )}
      </span>
    </div>
  );
};
