import ky from "ky";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../env.mjs";
import type {
  DistributedToStakersRow,
  StarsBurnedRow,
} from "../../hooks/useStats.js";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat);

const getFairBurnHistory = async () => {
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

const stats = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
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
        minimumDate: dayjs(starsBurned[0]?.burn_date).format("DD/MM/YYYY"),
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
        minimumDate: dayjs(starsBurned[0]?.burn_date).format("DD/MM/YYYY"),
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
        distributedToStakers[distributedToStakers.length - 2]
          ?.cumulative_dist ?? 0,
      daily:
        distributedToStakers[distributedToStakers.length - 2]
          ?.stakers_dist_amount ?? 0,
    };
    const distributedToday = {
      cumulative:
        distributedToStakers[distributedToStakers.length - 1]
          ?.cumulative_dist ?? 0,
      daily:
        distributedToStakers[distributedToStakers.length - 1]
          ?.stakers_dist_amount ?? 0,
    };
    const distributionStats = [
      {
        id: "total-distributed",
        title: "Total Distributed",
        value: Math.round(distributedToday.cumulative),
        minimumDate: dayjs(distributedToStakers[0]?.dist_date).format(
          "DD/MM/YYYY"
        ),
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
        minimumDate: dayjs(distributedToStakers[0]?.dist_date).format(
          "DD/MM/YYYY"
        ),
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
    return res.status(200).json({
      history: {
        starsBurned,
        distributedToStakers,
      },
      stats: {
        distributed: distributionStats,
        burned: burnStats,
      },
    });
  } catch (error) {
    console.error("Stats Error", error);
    return res.status(500).send("An unexpected error occurred");
  }
};

export default stats;
