import classNames from "classnames";
import type { FunctionComponent } from "react";
import { BiTimeFive } from "react-icons/bi";
import { TbRefresh } from "react-icons/tb";
import { Dna } from "react-loader-spinner";

export const ChartCard: FunctionComponent<{
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isLoading: boolean;
  isRefetching: boolean;
  isError: boolean;
  title: string;
  updatedAtTime: string;
  refetch: () => void;
}> = ({
  canvasRef,
  isLoading,
  isError,
  title,
  refetch,
  isRefetching,
  updatedAtTime,
}) => {
  return (
    <div className="relative w-full rounded-md border border-white/10 bg-slate-900 pt-3 lg:pt-5">
      {isLoading && (
        <Dna
          visible={true}
          height="80"
          width="80"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
      )}
      <div className="flex w-full justify-between px-5">
        <span className="whitespace-nowrap text-sm text-gray-400 sm:text-base md:text-lg xl:text-xl">
          {title}
        </span>
        <div className="flex items-center gap-2">
          <div className="flex whitespace-nowrap text-xs text-gray-500 md:text-sm xl:text-base">
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
          </div>
          <button onClick={refetch} disabled={isRefetching}>
            <TbRefresh
              className={classNames(
                "h-5 w-5 text-white xl:h-6 xl:w-6",
                isRefetching && "animate-spin"
              )}
            />
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} className="animate w-full rounded-md px-3 pt-2">
        {isError && "Failed to load chart. Try again later."}
      </canvas>
    </div>
  );
};
