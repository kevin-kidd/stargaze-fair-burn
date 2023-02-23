import "chartjs-adapter-date-fns";
import type { LegendItem, TooltipOptions } from "chart.js";
import { Chart, registerables } from "chart.js";
import { enUS } from "date-fns/locale";
import { format, subDays } from "date-fns";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
import type { MinMaxValues } from "../utils/chart.helper";
import { getMinMaxValues } from "../utils/chart.helper";
import type {
  DistributedToStakersRow,
  HistoricalData,
  StarsBurnedRow,
} from "./useStats";
import type { ChartEvent } from "chart.js/dist/plugins/plugin.legend";
import type { ChartType, ChartOptions } from "chart.js";
import type { Point } from "chart.js";
Chart.register(...registerables);

const lineChartType: ChartType = "line";

const handleLegendClick = (
  chart: Chart,
  legendItem: LegendItem,
  values: {
    daily: MinMaxValues;
    cumulative: MinMaxValues;
  },
  setIndex: Dispatch<SetStateAction<number | undefined>>
) => {
  if (legendItem.hidden && legendItem.datasetIndex !== undefined) {
    const dataset = chart.data.datasets[legendItem.datasetIndex];
    const otherDataset =
      chart.data.datasets[legendItem.datasetIndex === 1 ? 0 : 1];
    if (dataset && otherDataset) {
      dataset.hidden = false;
      otherDataset.hidden = true;
      const minMaxValues =
        legendItem.datasetIndex === 0 ? values.daily : values.cumulative;
      // Update Y max
      if (chart.options.scales?.y)
        chart.options.scales.y.max = minMaxValues.maxValue * 1.05;
      // Update X max
      if (chart.options.scales?.x) {
        chart.options.scales.x.max = minMaxValues.maxDate;
        chart.options.scales.x.min = subDays(
          minMaxValues.maxDate,
          30
        ).getTime();
      }
      setIndex(legendItem.datasetIndex === 0 ? 1 : 0);
      chart.update();
    }
  }
};

const tooltipOptions: Partial<TooltipOptions> = {
  backgroundColor: "#fffff80",
  titleColor: "#ffffff",
  bodyColor: "#ffffff",
  displayColors: true,
  boxPadding: 3,
  borderColor: "#ffffff75",
  yAlign: "bottom",
  borderWidth: 1,
  padding: 8,
  callbacks: {
    beforeTitle: () => "",
    beforeFooter: () => "",
    afterTitle: () => "",
    afterFooter: () => "",
    beforeBody: () => "",
    afterBody: () => "",
    beforeLabel: () => "",
    afterLabel: () => "",
    labelColor: () => ({
      borderColor: "#ffffff",
      backgroundColor: "#ffffff",
    }),
    labelPointStyle: () => ({
      rotation: 0,
      pointStyle: "circle",
      radius: 3,
      borderWidth: 2,
      backgroundColor: "#9c0580",
      borderColor: "#ffffff",
    }),
    footer: () => "",
    labelTextColor: () => "",
    title: function (context) {
      if (context[0]) {
        return `${format(
          new Date(context[0].parsed.x),
          "MMM d, yyyy"
        )} - ${format(new Date(context[0].parsed.x), "h:mm a")}`;
      }
      return;
    },
    label: function (context) {
      return Math.round(context.parsed.y).toLocaleString() + " $STARS";
    },
  },
};

export const useChart = (history: HistoricalData | undefined) => {
  const burnedCanvasRef = useRef<HTMLCanvasElement>(null);
  const distributedCanvasRef = useRef<HTMLCanvasElement>(null);
  const [burnDatasetIndex, setBurnDatasetIndex] = useState<number>();
  const [distributionDatasetIndex, setDistributionDatasetIndex] =
    useState<number>();
  useEffect(() => {
    async function registerZoom() {
      const zoomPlugin = (await import("chartjs-plugin-zoom")).default;
      Chart.register(zoomPlugin);
    }
    registerZoom();
  }, []);
  useEffect(() => {
    if (!history?.starsBurned || !history?.distributedToStakers) return;
    const burnData: {
      cumulative: Point[];
      daily: Point[];
    } = {
      cumulative: history.starsBurned.map((row: StarsBurnedRow) => ({
        x: new Date(row.burn_date).getTime(),
        y: row.cumulative_burn,
      })),
      daily: history.starsBurned.map((row: StarsBurnedRow) => ({
        x: new Date(row.burn_date).getTime(),
        y: row.daily_burn,
      })),
    };
    const distributionData = {
      cumulative: history.distributedToStakers.map(
        (row: DistributedToStakersRow) => ({
          x: new Date(row.dist_date).getTime(),
          y: row.cumulative_dist,
        })
      ),
      daily: history.distributedToStakers.map(
        (row: DistributedToStakersRow) => ({
          x: new Date(row.dist_date).getTime(),
          y: row.stakers_dist_amount,
        })
      ),
    };
    const burnCtx = burnedCanvasRef.current?.getContext("2d");
    const distributionCtx = distributedCanvasRef.current?.getContext("2d");
    if (!burnCtx || !distributionCtx) return;
    const gradient = burnCtx.createLinearGradient(0, 16, 0, 600);
    gradient.addColorStop(0, "#db2877");
    gradient.addColorStop(0.3, "#db287750");
    gradient.addColorStop(1, "transparent");
    const values = getMinMaxValues(burnData, distributionData);
    const defaultDataSet = {
      backgroundColor: gradient,
      fill: true,
      borderWidth: 2,
      borderColor: "#9c0580",
      pointBackgroundColor: "#94067a",
      pointRadius: 0,
    };
    const burnMinMaxValues =
      burnDatasetIndex === 0
        ? values.burnValues.cumulative
        : values.burnValues.daily;
    const distributionMinMaxValues =
      distributionDatasetIndex === 0
        ? values.distributionValues.cumulative
        : values.distributionValues.daily;
    const burnOptions: ChartOptions = {
      animation: false,
      responsive: true,
      interaction: {
        intersect: false,
        mode: "nearest" as const,
        includeInvisible: true,
      },
      scales: {
        y: {
          title: {
            display: true,
            color: "#ffffff",
            text: "STARS",
            padding: 2,
          },
          grid: {
            display: true,
            color: "#ffffff20",
            drawTicks: false,
          },
          max: burnMinMaxValues.maxValue * 1.05,
          ticks: {
            color: "#ffffff",
            padding: 8,
            autoSkipPadding: 20,
            callback: (value) => {
              if (value === 0) return;
              return typeof value === "number"
                ? Math.round(value).toLocaleString()
                : Math.round(parseFloat(value)).toLocaleString();
            },
          },
        },
        x: {
          adapters: {
            date: {
              locale: enUS,
            },
          },
          grid: {
            display: false,
            drawTicks: false,
          },
          type: "time",
          min: subDays(burnMinMaxValues.maxDate, 30).getTime(),
          max: burnMinMaxValues.maxDate,
          ticks: {
            padding: 8,
            maxTicksLimit: 7,
            maxRotation: 0,
            minRotation: 0,
            color: "#ffffff",
            autoSkipPadding: 20,
            source: "auto",
            autoSkip: false,
          },
        },
      },
      plugins: {
        legend: {
          onClick: (event: ChartEvent, legendItem: LegendItem) => {
            handleLegendClick(
              burnChart,
              legendItem,
              values.burnValues,
              setBurnDatasetIndex
            );
          },
        },
        tooltip: tooltipOptions,
        zoom: {
          limits: {
            x: {
              minRange: 6 * 24 * 60 * 60 * 1000,
              min: burnMinMaxValues.minDate,
              max: burnMinMaxValues.maxDate,
            },
            y: {
              min: 0,
              max: burnMinMaxValues.maxValue,
            },
          },
          pan: {
            mode: "x",
            enabled: true,
          },
          zoom: {
            mode: "x",
            wheel: {
              enabled: true,
              speed: 0.25,
            },
            pinch: {
              enabled: true,
            },
          },
        },
      },
    };
    const burnConfig = {
      type: lineChartType,
      data: {
        datasets: [
          {
            ...defaultDataSet,
            data: burnData.daily,
            label: "Daily",
            hidden: burnDatasetIndex === 0,
          },
          {
            ...defaultDataSet,
            data: burnData.cumulative,
            label: "Cumulative",
            hidden: burnDatasetIndex === 1 || burnDatasetIndex === undefined,
          },
        ],
      },
      options: burnOptions,
    };
    const distributionOptions: ChartOptions = {
      ...burnConfig.options,
      scales: {
        x: {
          ...burnConfig.options.scales?.x,
          min: subDays(distributionMinMaxValues.maxDate, 30).getTime(),
          max: distributionMinMaxValues.maxDate,
        },
        y: {
          ...burnConfig.options.scales?.y,
          max: distributionMinMaxValues.maxValue * 1.05,
        },
      },
      plugins: {
        ...burnConfig.options.plugins,
        legend: {
          onClick: (event: ChartEvent, legendItem: LegendItem) => {
            handleLegendClick(
              distributionChart,
              legendItem,
              values.distributionValues,
              setDistributionDatasetIndex
            );
          },
        },
        zoom: {
          ...burnConfig.options.plugins?.zoom,
          limits: {
            x: {
              minRange: 6 * 24 * 60 * 60 * 1000,
              min: distributionMinMaxValues.minDate,
              max: distributionMinMaxValues.maxDate,
            },
            y: {
              min: 0,
              max: distributionMinMaxValues.maxValue,
            },
          },
        },
      },
    };
    const distributionConfig = {
      ...burnConfig,
      data: {
        datasets: [
          {
            ...defaultDataSet,
            data: distributionData.daily,
            label: "Daily",
            hidden: distributionDatasetIndex === 0,
          },
          {
            ...defaultDataSet,
            data: distributionData.cumulative,
            label: "Cumulative",
            hidden:
              distributionDatasetIndex === 1 ||
              distributionDatasetIndex === undefined,
          },
        ],
      },
      options: distributionOptions,
    };
    const burnChart = new Chart(burnCtx, burnConfig);
    const distributionChart = new Chart(distributionCtx, distributionConfig);
    return function cleanup() {
      burnChart.destroy();
      distributionChart.destroy();
    };
  }, [history]);
  return { distributedCanvasRef, burnedCanvasRef };
};
