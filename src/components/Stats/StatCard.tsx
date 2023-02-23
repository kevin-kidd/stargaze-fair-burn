import classNames from "classnames";
import type { Stat } from "../../hooks/useStats";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { TbArrowBarToUp } from "react-icons/tb";
import dynamic from "next/dynamic";
import type { FunctionComponent } from "react";
import { BiTimeFive } from "react-icons/bi";
const AnimatedNumbers = dynamic(() => import("react-animated-numbers"), {
  ssr: false,
});

export const StatCard: FunctionComponent<{
  stat?: Stat;
  isLoading: boolean;
  updatedAtTime: string;
  minimumDate?: string;
}> = ({ stat, isLoading, updatedAtTime, minimumDate }) => {
  if (!stat) return <></>; // TODO: Add a placeholder
  return (
    <div className="relative flex w-full justify-between gap-3 rounded-md border border-white/10 bg-slate-900 p-3 lg:p-5">
      <div className="flex flex-col gap-2 lg:gap-4">
        <div className="flex gap-1 lg:gap-3">
          <span className="whitespace-nowrap text-sm text-gray-400 lg:text-base">
            {stat.title}
          </span>
          <p
            className={classNames(
              stat.changeRate !== undefined &&
                (stat.changeRate > 0
                  ? "text-green-600"
                  : stat.changeRate === 0
                  ? "text-gray-300"
                  : "text-red-600"),
              "flex items-center text-xs font-semibold lg:text-sm"
            )}
          >
            {stat.changeRate !== undefined &&
              (stat.changeRate > 0 ? (
                <AiOutlineArrowUp
                  className="h-4 w-4 flex-shrink-0 self-center text-green-500"
                  aria-hidden="true"
                />
              ) : stat.changeRate === 0 ? (
                <TbArrowBarToUp
                  className="h-4 w-4 flex-shrink-0 self-center text-gray-300"
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
              {stat.changeRate !== undefined &&
                (stat.changeRate >= 0 ? "Increased" : "Decreased")}{" "}
              by{" "}
            </span>
            {stat.changeRate !== undefined && stat.changeRate + "%"}
          </p>
        </div>

        <div className="flex items-center gap-1 text-lg text-white lg:text-2xl">
          {stat.value === 0 ? (
            "0"
          ) : (
            <AnimatedNumbers includeComma animateToNumber={stat.value} />
          )}
          <span className="text-gray-500">STARS</span>
        </div>
      </div>
      <div className="flex h-full flex-col items-end justify-between whitespace-nowrap text-xs text-gray-500 lg:text-sm">
        {minimumDate && `Since ${minimumDate}`}
        <span>
          {!isLoading && updatedAtTime && (
            <div className="flex gap-1">
              <span className="hidden lg:flex">Updated</span>
              <BiTimeFive className="h-4 w-4 lg:hidden" />
              <span className="font-semibold text-gray-400">
                {updatedAtTime}
              </span>{" "}
              ago
            </div>
          )}
        </span>
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
