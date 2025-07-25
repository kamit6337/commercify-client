import { useTheme } from "@/providers/ThemeProvider";
import { Doughnut } from "react-chartjs-2";

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
};

const centerTextPlugin = (count: number, labelColor: string) => ({
  id: "centerText",
  beforeDraw: (chart: any) => {
    const { width } = chart;
    const { height } = chart;
    const ctx = chart.ctx;
    ctx.restore();

    const text = `Total Orders (${count})`;
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = labelColor;
    ctx.textBaseline = "middle";

    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = height / 2;

    ctx.fillText(text, textX, textY);
    ctx.save();
  },
});

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const DoughnutGraph = ({ data, topLabel, hoverText }: Props) => {
  const { theme } = useTheme();
  const isDarkModeOn = theme === "dark";

  const labelColor = isDarkModeOn ? "#e5e7eb" : "#1f2937"; // Tailwind gray-200 / gray-800
  const titleColor = isDarkModeOn ? "#f3f4f6" : "#111827"; // Tailwind gray-100 / gray-900

  const chartData = {
    labels: data.map((single) => capitalize(single.name)),
    datasets: [
      {
        label: topLabel,
        data: data.map((single) => single.count),
        backgroundColor: data.map((d) => d.color),
        borderColor: data.map((d) => d.borderColor),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: labelColor, // ✅ legend text color
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ${context.parsed} ${hoverText}`,
        },
      },
      datalabels: {
        color: "#fff",
        font: {
          weight: "bold" as const,
          size: 12,
        },
        formatter: (value: number) => value,
      },
    },
  };

  const totalCount = data.reduce((a, b) => (a += b.count), 0);

  return (
    <Doughnut
      key={totalCount}
      data={chartData}
      options={options}
      plugins={[centerTextPlugin(totalCount, titleColor)]}
    />
  );
};

export default DoughnutGraph;
