import logo from "../../public/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { FaDiscord, FaTelegram, FaTwitter } from "react-icons/fa";
import stargazeIcon from "../../public/stargaze-icon.svg";
import { usePrice } from "../hooks/usePrice";
import classNames from "classnames";
import { FiMenu } from "react-icons/fi";
import { useState } from "react";

const menuItems = [
  {
    title: "Marketplace",
    href: "https://stargaze.zone/marketplace",
  },
  {
    title: "Names",
    href: "https://stargaze.zone/marketplace",
  },
  {
    title: "Stake",
    href: "https://stargaze.zone/stake",
  },
];

const socials = [
  {
    icon: <FaTwitter className="h-5 w-5 fill-white" />,
    href: "https://twitter.com/stargazezone",
  },
  {
    icon: <FaDiscord className="h-5 w-5 fill-white" />,
    href: "https://discord.gg/stargaze",
  },
  {
    icon: <FaTelegram className="h-5 w-5 fill-white" />,
    href: "https://t.me/joinchat/ZQ95YmIn3AI0ODFh",
  },
];

export const Header = () => {
  const { data, isLoading } = usePrice();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="fixed top-0 z-30 w-full border border-b border-white/20 bg-black">
      <div className="container mx-auto flex w-full justify-between px-6 py-4 md:px-2">
        <div className="flex text-white lg:gap-2">
          <Image src={logo} alt="Stargaze" className="mr-4" />
          {menuItems.map((item) => (
            <Link
              target="_blank"
              href={item.href}
              key={item.title}
              className="hidden rounded-md py-2 px-2 transition duration-200 ease-in-out hover:bg-[#18181b] md:flex md:px-4"
            >
              {item.title}
            </Link>
          ))}
        </div>
        <div className="flex gap-1 text-white">
          <Link
            href="https://www.coingecko.com/en/coins/stargaze"
            target="_blank"
            className="mr-2 flex items-center gap-1 rounded-md border border-white/20 bg-slate-800 py-2 px-3"
          >
            <Image src={stargazeIcon} alt="$STARS" className="h-5 w-5" />
            <span className="text-xs md:text-sm">
              {data?.price
                ? `$${Math.round(data?.price * 1000) / 1000}`
                : isLoading
                ? "..."
                : "$0"}
            </span>
            <span
              className={classNames(
                "text-xs",
                data?.change &&
                  (data?.change > 0
                    ? "text-green-500"
                    : data?.change === 0
                    ? "text-gray-400"
                    : "text-red-500")
              )}
            >
              {data?.change && `(${Math.round(data?.change * 100) / 100}%)`}
            </span>
          </Link>
          <button
            className="mx-2 md:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <FiMenu className="h-7 w-7" />
          </button>
          {socials.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              target="_blank"
              className="hidden items-center rounded-md py-2 px-2 transition duration-200 ease-in-out hover:bg-[#18181b] md:flex md:px-4"
            >
              {item.icon}
            </Link>
          ))}
        </div>
      </div>
      <div
        className={classNames(
          "flex w-full justify-between border-t border-white/20 py-4 px-6 md:hidden",
          isMenuOpen ? "flex" : "hidden"
        )}
      >
        <div className="flex flex-col gap-3">
          {menuItems.map((item) => (
            <Link
              target="_blank"
              href={item.href}
              key={item.title}
              className="w-fit text-white"
            >
              {item.title}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {socials.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              target="_blank"
              className="w-fit items-center"
            >
              {item.icon}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
