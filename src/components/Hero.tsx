import Image from "next/image";
import stargazeIcon from "../../public/stargaze-icon.svg";

export const Hero = () => {
  return (
    <section className="relative z-10 flex w-full items-center justify-center py-10">
      <Image
        src={stargazeIcon}
        alt="Stargaze"
        className="aspect-square h-auto w-60"
      />
      <h1 className="gradient-text absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-7xl font-semibold">
        Fair Burn
      </h1>
    </section>
  );
};
