import { Bar } from "react-chartjs-2";
import { ChartOptions } from "chart.js";

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
      legend: { display: true },
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
        title: { display: true, text: yLabel },
      },
      x: {
        title: { display: false, text: "Status" },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarGraph;
