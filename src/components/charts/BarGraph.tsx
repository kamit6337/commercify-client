import { Bar } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import { useTheme } from "@/providers/ThemeProvider";

type Parsed = {
  y: number;
};
type Context = {
  parsed: Parsed;
};

type Single = {
  name: string;
  count: number;
  color: string;
  borderColor: string;
};

type Props = {
  data: Single[];
  topLabel: string;
  hoverText: string;
  yLabel: string;
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const BarGraph = ({ data, topLabel, hoverText, yLabel }: Props) => {
  const { theme } = useTheme();
  const isDarkModeOn = theme === "dark";

  const labelColor = isDarkModeOn ? "#e5e7eb" : "#1f2937"; // Tailwind gray-200 / gray-800
  const titleColor = isDarkModeOn ? "#f3f4f6" : "#111827"; // Tailwind gray-100 / gray-900
  const gridColor = isDarkModeOn ? "#374151" : "#e5e7eb";

  const chartData = {
    labels: data.map((single) => capitalize(single.name)),
    datasets: [
      {
        label: topLabel,
        data: data.map((single) => single.count),
        backgroundColor: data.map((data) => {
          return data.color;
        }),
        borderColor: data.map((data) => {
          return data.borderColor;
        }),
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
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
          label: (context: Context) => ` ${context.parsed.y} ${hoverText}`,
        },
      },
      datalabels: {
        anchor: "center",
        align: "center",
        color: "#fff",
        font: {
          weight: "bold" as const,
          size: 12,
        },
        formatter: (value: number) => value,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: labelColor, // 🔵 Y-axis tick label color (e.g., Tailwind gray-800)
        },
        title: {
          display: true,
          text: yLabel,
          color: titleColor, // 🔵 Y-axis title color (e.g., Tailwind gray-900)
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          color: gridColor, // ✅ Y-axis grid lines
        },
      },
      x: {
        ticks: {
          color: labelColor, // 🔵 X-axis tick label color
        },
        title: {
          display: false,
          text: "Status",
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

  return <Bar data={chartData} options={options} />;
};

export default BarGraph;
