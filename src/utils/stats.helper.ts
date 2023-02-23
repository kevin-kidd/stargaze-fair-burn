import ky from "ky";
import { env } from "../env.mjs";
import type {
  DistributedToStakersRow,
  StarsBurnedRow,
} from "../hooks/useStats";

export const getFairBurnHistory = async () => {
  const distributedToStakers: DistributedToStakersRow[] = await ky
    .get(env.NEXT_PUBLIC_METABASE_URL_DISTRIBUTION)
    .json();
  const burnResponse = await ky.get(env.NEXT_PUBLIC_METABASE_URL_BURN);
  const starsBurned: StarsBurnedRow[] = await burnResponse.json();
  return {
    starsBurned,
    distributedToStakers,
  };
};
