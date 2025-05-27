import BarGraph from "@/components/charts/BarGraph";

type OrderCounts = {
  ordered: number;
  undelivered: number;
  delivered: number;
  cancelled: number;
  returned: number;
};

type Props = {
  orderCounts: OrderCounts;
  topLabel: string | undefined;
};

const OrderStatusGraph = ({ orderCounts, topLabel }: Props) => {
  const chartData = [
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

  return (
    <BarGraph
      data={chartData}
      topLabel={`${topLabel} Overview`}
      hoverText="orders"
      yLabel="Number of Orders"
    />
  );
};

export default OrderStatusGraph;
