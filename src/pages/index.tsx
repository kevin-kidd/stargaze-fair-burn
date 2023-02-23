import { type NextPage } from "next";
import Head from "next/head";
import { Stats } from "../components/Stats";
import { Header } from "../components/Header";
import gradient from "../../public/assets/gradient.webp";
import Image from "next/image";
import { Hero } from "../components/Hero";
import { useMemo, useState } from "react";
import Link from "next/link";
import { usePrice } from "../hooks/usePrice";

const Home: NextPage = () => {
  const [isAnimationActive, setIsAnimationActive] = useState<boolean>(false);
  const [totalBurned, setTotalBurned] = useState<string>("");
  const { data: priceData, isLoading } = usePrice();
  const title = useMemo(() => {
    let title = "Stargaze Fair Burn";
    if (priceData?.price !== undefined) {
      title = `$${Math.round(priceData?.price * 1000) / 1000} | ${title}`;
    }
    if (totalBurned) {
      title = `${totalBurned} | ${title}`;
    }
    return title;
  }, [totalBurned, priceData?.price]);
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="Find all relevant statistics for the Stargaze Fair Burn mechanism."
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#2d89ef" />
        <meta name="theme-color" content="#000000" />
        <meta property="og:image" content="/assets/og_image.png" />
      </Head>
      <main className="min-h-screen bg-black">
        <Header priceData={priceData} isLoading={isLoading} />
        <div className="container relative mx-auto flex w-full flex-col items-center justify-center overflow-y-hidden pt-16">
          <Hero isAnimationActive={isAnimationActive} />
          <div className="circle absolute top-0 h-auto w-full md:-top-40 md:w-[80%]">
            <Image src={gradient} alt="" priority className="h-full w-full" />
          </div>
          <Stats
            setIsAnimationActive={setIsAnimationActive}
            setTotalBurned={setTotalBurned}
          />
          <span className="relative z-10 py-10 text-white">
            Made with 💜 by{" "}
            <Link
              href="https://kevin.stars.page/"
              target="_blank"
              className="gradient-text font-semibold"
            >
              kevin.stars
            </Link>
          </span>
        </div>
      </main>
    </>
  );
};

export default Home;
