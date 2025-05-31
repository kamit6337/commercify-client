import { TimeScale } from "@/types";

type OrderTimeScale = {
  title: string;
  time: TimeScale;
};

const orderTimeScale: OrderTimeScale[] = [
  {
    title: "Last 1 Day",
    time: "day",
  },
  {
    title: "Last 1 Month",
    time: "month",
  },
  {
    title: "Last 6 Months",
    time: "6month",
  },
  {
    title: "Last 1 Year",
    time: "year",
  },
  {
    title: "All",
    time: "all",
  },
];

export default orderTimeScale;
