import classNames from "classnames";
import type { Stat } from "../../hooks/useStats";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { TbArrowBarToUp } from "react-icons/tb";
import type { FunctionComponent } from "react";
import { BiTimeFive } from "react-icons/bi";
import AnimatedNumber from "animated-number-react";

export const StatCard: FunctionComponent<{
  stat?: Stat;
  isLoading: boolean;
  updatedAtTime: string;
  minimumDate?: string;
}> = ({ stat, isLoading, updatedAtTime, minimumDate }) => {
  if (!stat) return <></>; // TODO: Add a placeholder
  return (
    <div className="relative flex w-full justify-between gap-3 rounded-md border border-white/10 bg-slate-900 p-3 lg:p-6">
      <div className="flex flex-col gap-2 sm:gap-2 lg:gap-5 2xl:gap-7">
        <div className="flex gap-2">
          <span className="whitespace-nowrap text-sm text-gray-400 sm:text-base xl:text-lg">
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
              "flex items-center text-xs font-semibold sm:text-sm lg:text-base"
            )}
          >
            {stat.changeRate !== undefined &&
              (stat.changeRate > 0 ? (
                <AiOutlineArrowUp
                  className="h-4 w-4 flex-shrink-0 self-center text-green-500 xl:h-5 xl:w-5"
                  aria-hidden="true"
                />
              ) : stat.changeRate === 0 ? (
                <TbArrowBarToUp
                  className="h-4 w-4 flex-shrink-0 self-center text-gray-300 xl:h-5 xl:w-5"
                  aria-hidden="true"
                />
              ) : (
                <AiOutlineArrowDown
                  className="h-4 w-4 flex-shrink-0 self-center text-red-500 xl:h-5 xl:w-5"
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

        <div className="flex items-center gap-1 text-lg text-white sm:gap-2 sm:text-xl lg:text-3xl">
          {stat.value === 0 ? (
            "0"
          ) : (
            <AnimatedNumber
              className={stat.title.includes("Total") ? "gradient-text" : ""}
              value={stat.value}
              duration={600}
              formatValue={(value: number) =>
                Math.round(value).toLocaleString()
              }
            />
          )}
          <span className="text-gray-500">STARS</span>
        </div>
      </div>
      <div className="flex h-full flex-col items-end justify-between whitespace-nowrap text-xs text-gray-500 lg:text-sm">
        <span>
          {!isLoading && updatedAtTime && (
            <div className="flex items-center gap-1">
              <span className="hidden lg:flex">Updated</span>
              <BiTimeFive className="h-4 w-4 lg:hidden" />
              <span className="font-semibold text-gray-400">
                {updatedAtTime}
              </span>{" "}
              ago
            </div>
          )}
        </span>
        {minimumDate && `Since ${minimumDate}`}
      </div>
    </div>
  );
};
