import ky from "ky";
import { useQuery } from "react-query";
import { env } from "../env.mjs";

export const usePrice = () => {
  return useQuery("price", async () => {
    const response: {
      market_data: {
        current_price: {
          usd: number;
        };
        price_change_percentage_24h: number;
      };
    } = await ky.get(env.NEXT_PUBLIC_COIN_GECKO_URL).json();
    return {
      price: response.market_data.current_price.usd,
      change: response.market_data.price_change_percentage_24h,
    };
  });
};
