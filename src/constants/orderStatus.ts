import { ORDER_STATUS_COUNT } from "@/types";

const chartData = (orderCounts: ORDER_STATUS_COUNT) => [
  {
    name: "Ordered",
    count: orderCounts.ordered,
    color: "rgba(75, 192, 192, 0.7)",
    borderColor: "rgba(75, 192, 192, 1)",
  },
  {
    name: "UnDelivered",
    count: orderCounts.undelivered,
    color: "rgba(75, 132, 152, 0.7)",
    borderColor: "rgba(75, 132, 152, 1)",
  },
  {
    name: "Delivered",
    count: orderCounts.delivered,
    color: "rgba(54, 162, 235, 0.7)",
    borderColor: "rgba(54, 162, 235, 1)",
  },
  {
    name: "Cancelled",
    count: orderCounts.cancelled,
    color: "rgba(255, 99, 132, 0.7)",
    borderColor: "rgba(255, 99, 132, 1)",
  },
  {
    name: "Returned",
    count: orderCounts.returned,
    color: "rgba(255, 206, 86, 0.7)",
    borderColor: "rgba(255, 206, 86, 1)",
  },
];

export default chartData;
