import Image from "next/image";
import stargazeIconWhite from "../../public/assets/icon_white.svg";
import animatedFireRing from "../../public/assets/animated-fire-ring.webp";
import classNames from "classnames";

export const Hero = ({ isAnimationActive }: { isAnimationActive: boolean }) => {
  return (
    <section className="relative z-10 flex w-full items-center justify-center py-6 md:py-10 2xl:py-14">
      <div className="relative aspect-square h-auto w-40 md:w-60 2xl:w-72">
        <Image
          src={stargazeIconWhite}
          alt=""
          className="relative z-10 opacity-25"
        />
        <Image
          src={animatedFireRing}
          alt=""
          className={classNames(
            "absolute top-0 left-0",
            isAnimationActive ? "show" : "hidden"
          )}
        />
      </div>
      <h1 className="tracking-in-contract gradient-text absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform whitespace-nowrap text-5xl font-semibold md:text-7xl 2xl:text-9xl">
        Fair Burn
      </h1>
    </section>
  );
};
