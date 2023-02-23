import type { Point } from "chart.js";

const getMinDate = (data: Point[]) => {
  return Math.min(...data.map(({ x }: { x: number }) => x));
};

const getMaxDate = (data: Point[]) => {
  return Math.max(...data.map(({ x }: { x: number }) => x));
};

const getMaxValue = (data: Point[]) => {
  return Math.max(...data.map(({ y }: { y: number }) => y));
};

export const getMinMaxValues = (
  burnData: {
    cumulative: Point[];
    daily: Point[];
  },
  distributionData: {
    cumulative: Point[];
    daily: Point[];
  }
) => {
  return {
    burnValues: {
      daily: {
        minDate: getMinDate(burnData.daily),
        maxDate: getMaxDate(burnData.daily),
        maxValue: getMaxValue(burnData.daily),
      },
      cumulative: {
        minDate: getMinDate(burnData.cumulative),
        maxDate: getMaxDate(burnData.cumulative),
        maxValue: getMaxValue(burnData.cumulative),
      },
    },
    distributionValues: {
      daily: {
        minDate: getMinDate(distributionData.daily),
        maxDate: getMaxDate(distributionData.daily),
        maxValue: getMaxValue(distributionData.daily),
      },
      cumulative: {
        minDate: getMinDate(distributionData.cumulative),
        maxDate: getMaxDate(distributionData.cumulative),
        maxValue: getMaxValue(distributionData.cumulative),
      },
    },
  };
};

export type MinMaxValues = {
  minDate: number;
  maxDate: number;
  maxValue: number;
};
