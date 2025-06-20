import { Line } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import {
  parseISO,
  format,
  // startOfDay,
  // eachHourOfInterval,
  eachDayOfInterval,
  // eachMonthOfInterval,
} from "date-fns";
import { TimeScale } from "@/types";
import { useTheme } from "@/providers/ThemeProvider";

type Order = {
  _id: string;
  createdAt: string;
};

type Props = {
  orders: Order[];
  timeScale: TimeScale;
};

const LineGraph = ({ orders, timeScale }: Props) => {
  const { theme } = useTheme();
  const isDarkModeOn = theme === "dark";

  const labelColor = isDarkModeOn ? "#e5e7eb" : "#1f2937"; // Tailwind gray-200 / gray-800
  const titleColor = isDarkModeOn ? "#f3f4f6" : "#111827"; // Tailwind gray-100 / gray-900
  const gridColor = isDarkModeOn ? "#374151" : "#e5e7eb";

  const now = new Date();
  // const createdDates = orders.map((o) => parseISO(o.createdAt));
  // const minDate = createdDates.length
  //   ? new Date(Math.min(...createdDates.map(Number)))
  //   : now;
  // const maxDate = createdDates.length
  //   ? new Date(Math.max(...createdDates.map(Number)))
  //   : now;

  let baseUnits: string[] = [];

  const grouped: Record<string, number> = {};

  if (timeScale === "day") {
    // Group by hour (00–23)
    baseUnits = Array.from({ length: 24 }, (_, i) =>
      i.toString().padStart(2, "0")
    );
    for (const order of orders) {
      const hour = format(parseISO(order.createdAt), "HH");
      grouped[hour] = (grouped[hour] || 0) + 1;
    }
  } else if (timeScale === "month") {
    // Group by day of the current month (01–31)
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    baseUnits = eachDayOfInterval({ start, end }).map((d) => format(d, "dd"));
    for (const order of orders) {
      const day = format(parseISO(order.createdAt), "dd");
      grouped[day] = (grouped[day] || 0) + 1;
    }
  } else if (["year", "6month", "all"].includes(timeScale)) {
    // Group by month name
    baseUnits = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    for (const order of orders) {
      const month = format(parseISO(order.createdAt), "MMM");
      grouped[month] = (grouped[month] || 0) + 1;
    }
  }

  const dataPoints = baseUnits.map((unit) => grouped[unit] || 0);

  const chartData = {
    labels: baseUnits,
    datasets: [
      {
        label: "Orders",
        data: dataPoints,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.3,
        fill: true,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointRadius: 5,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: labelColor, // ✅ legend text color
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `Orders: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: labelColor, // 🔵 X-axis tick label color
        },
        title: {
          display: true,
          color: titleColor, // 🔵 X-axis title color (only visible if `display: true`)
          font: {
            size: 14,
            weight: "bold",
          },
          text:
            timeScale === "day"
              ? "Hour"
              : timeScale === "month"
              ? "Day"
              : "Month",
        },
        grid: {
          color: gridColor, // ✅ Y-axis grid lines
        },
      },
      y: {
        ticks: {
          color: labelColor, // 🔵 X-axis tick label color
        },
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Orders",
          color: titleColor, // 🔵 X-axis title color (only visible if `display: true`)
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          color: gridColor, // ✅ Y-axis grid lines
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineGraph;
