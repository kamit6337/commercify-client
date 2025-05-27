// src/chartSetup.js
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";

import "chartjs-adapter-date-fns";

// Register all needed Chart.js components once
ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartDataLabels
);
