import ky from "ky";
import { useQuery } from "react-query";

export const usePrice = () => {
  return useQuery("price", async () => {
    const response: {
      market_data: {
        current_price: {
          usd: number;
        };
        price_change_percentage_24h: number;
      };
    } = await ky
      .get(
        "https://api.coingecko.com/api/v3/coins/stargaze?localization=false&market_data=true"
      )
      .json();
    return {
      price: response.market_data.current_price.usd,
      change: response.market_data.price_change_percentage_24h,
    };
  });
};
