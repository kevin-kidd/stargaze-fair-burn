import logo from "../../public/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { FaDiscord, FaTelegram, FaTwitter } from "react-icons/fa";
import stargazeIcon from "../../public/stargaze-icon.svg";
import { usePrice } from "../hooks/usePrice";
import classNames from "classnames";

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
    icon: <FaTwitter className="h-5 w-5" />,
    href: "https://twitter.com/stargazezone",
  },
  {
    icon: <FaDiscord className="h-5 w-5" />,
    href: "https://discord.gg/stargaze",
  },
  {
    icon: <FaTelegram className="h-5 w-5" />,
    href: "https://t.me/joinchat/ZQ95YmIn3AI0ODFh",
  },
];

export const Header = () => {
  const { data, isLoading } = usePrice();
  return (
    <div className="relative z-10 w-full border border-b border-white/20 bg-black py-4">
      <div className="container mx-auto flex w-full justify-between">
        <div className="flex gap-2 text-white">
          <Image src={logo} alt="Stargaze" className="mr-4" />
          {menuItems.map((item) => (
            <Link
              target="_blank"
              href={item.href}
              key={item.title}
              className="rounded-md py-2 px-4 transition duration-200 ease-in-out hover:bg-[#18181b]"
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
            <span className="text-sm">
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
          {socials.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              target="_blank"
              className="flex items-center rounded-md py-2 px-4 transition duration-200 ease-in-out hover:bg-[#18181b]"
            >
              {item.icon}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
