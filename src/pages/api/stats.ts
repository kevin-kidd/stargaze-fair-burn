import ky from "ky";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../env.mjs";
import type {
  DistributedToStakersRow,
  StarsBurnedRow,
} from "../../hooks/useStats.js";

const getFairBurnHistory = async () => {
  const distributedToStakers: DistributedToStakersRow[] = await ky
    .get(
      env.NEXT_PUBLIC_METABASE_URL +
        "/api/public/card/dfedf8e8-fd13-4cfb-9d87-e6a13ab45a7f/query/json"
    )
    .json();
  const burnResponse = await ky.get(
    env.NEXT_PUBLIC_METABASE_URL +
      "/api/public/card/3f4acb97-796f-40ae-af2c-d3163d09667a/query/json"
  );
  const starsBurned: StarsBurnedRow[] = await burnResponse.json();
  return {
    starsBurned,
    distributedToStakers,
  };
};

const chart = async (req: NextApiRequest, res: NextApiResponse) => {
  const { starsBurned, distributedToStakers } = await getFairBurnHistory();
  if (!starsBurned || !distributedToStakers) {
    return res.status(500).json({ error: "Something went wrong" });
  }
  // Burned stats
  const burnedToday = {
    daily: starsBurned[starsBurned.length - 1]?.daily_burn ?? 0,
    cumulative: starsBurned[starsBurned.length - 1]?.cumulative_burn ?? 0,
  };
  const burnedYesterday = {
    daily: starsBurned[starsBurned.length - 2]?.daily_burn ?? 0,
    cumulative: starsBurned[starsBurned.length - 2]?.cumulative_burn ?? 0,
  };
  const burnStats = [
    {
      id: "total-burned",
      title: "Total Burned",
      value: Math.round(
        starsBurned[starsBurned.length - 1]?.cumulative_burn ?? 0
      ),
      changeRate:
        Math.round(
          ((burnedToday.cumulative - burnedYesterday.cumulative) /
            burnedYesterday.cumulative) *
            100 *
            100
        ) / 100,
    },
    {
      id: "burned-daily-average",
      title: "Daily Average Burned",
      value: Math.round(burnedYesterday.cumulative / starsBurned.length - 1),
    },
    {
      id: "burned-today",
      title: "Burned Today",
      value: Math.round(burnedToday.daily),
    },
  ];

  // Distribution stats
  const distributedYesterday = {
    cumulative:
      distributedToStakers[distributedToStakers.length - 2]?.cumulative_dist ??
      0,
    daily:
      distributedToStakers[distributedToStakers.length - 2]
        ?.stakers_dist_amount ?? 0,
  };
  const distributedToday = {
    cumulative:
      distributedToStakers[distributedToStakers.length - 1]?.cumulative_dist ??
      0,
    daily:
      distributedToStakers[distributedToStakers.length - 1]
        ?.stakers_dist_amount ?? 0,
  };
  const distributionStats = [
    {
      id: "total-distributed",
      title: "Total Distributed",
      value: Math.round(distributedToday.cumulative),
      changeRate:
        Math.round(
          ((distributedToday.cumulative - distributedYesterday.cumulative) /
            distributedYesterday.cumulative) *
            100 *
            100
        ) / 100,
    },
    {
      id: "distributed-daily-average",
      title: "Daily Average Distributed",
      value: Math.round(
        distributedToday.cumulative / distributedToStakers.length
      ),
    },
    {
      id: "distributed-today",
      title: "Distributed Today",
      value: Math.round(distributedToday.daily),
    },
  ];
  res.status(200).json({
    history: {
      starsBurned,
      distributedToStakers,
    },
    stats: {
      distributed: distributionStats,
      burned: burnStats,
    },
  });
};

export default chart;
