const getMinDate = (data: ChartRow[]) => {
  return new Date(
    Math.min(...data.map(({ x }: { x: string }) => Date.parse(x)))
  ).getTime();
};

const getMaxDate = (data: ChartRow[]) => {
  return new Date(
    Math.max(...data.map(({ x }: { x: string }) => Date.parse(x)))
  ).getTime();
};

const getMaxValue = (data: ChartRow[]) => {
  return Math.max(...data.map(({ y }: { y: number }) => y));
};

export const getMinMaxValues = (
  burnData: {
    cumulative: ChartRow[];
    daily: ChartRow[];
  },
  distributionData: {
    cumulative: ChartRow[];
    daily: ChartRow[];
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

export type ChartRow = {
  x: string;
  y: number;
};
