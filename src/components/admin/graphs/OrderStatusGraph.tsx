import BarGraph from "@/components/charts/BarGraph";
import { useState } from "react";
import chartData from "@/constants/orderStatus";
import DoughnutGraph from "@/components/charts/DoughnutGraph";
import { ORDERS_COUNT, TimeScale } from "@/types";
import LineGraph from "@/components/charts/LineGraph";

type Order = {
  _id: string;
  createdAt: string; // ISO format
};

type Props = {
  orderCounts: ORDERS_COUNT;
  topLabel: string | undefined;
  timeOrdersCount: Order[];
  selectTimeScale: TimeScale;
};

type GraphType = "bar" | "pie" | "line";

type GRAPH_TYPE = {
  name: string;
  type: GraphType;
};

const GraphType: GRAPH_TYPE[] = [
  {
    name: "Bar",
    type: "bar",
  },
  {
    name: "Doughnut",
    type: "pie",
  },
  {
    name: "Line",
    type: "line",
  },
];

const OrderStatusGraph = ({
  orderCounts,
  topLabel,
  timeOrdersCount,
  selectTimeScale,
}: Props) => {
  const [selectGraphType, setSelectGraphType] = useState<GraphType>("bar");

  return (
    <>
      <div className="flex justify-center">
        <div className="flex justify-center gap-2 border border-sky-500 rounded w-max">
          {GraphType.map((graph, i) => {
            return (
              <button
                key={i}
                onClick={() => setSelectGraphType(graph.type)}
                className={`${
                  graph.type === selectGraphType ? "font-semibold" : ""
                } border-r border-sky-500 text-blue-600  last:border-none p-2 w-32 text-center`}
              >
                {graph.name}
              </button>
            );
          })}
        </div>
      </div>
      {selectGraphType === "bar" && (
        <BarGraph
          data={chartData(orderCounts)}
          topLabel={`${topLabel} Overview`}
          hoverText="orders"
          yLabel="Number of Orders"
        />
      )}
      {selectGraphType === "pie" && (
        <DoughnutGraph
          data={chartData(orderCounts).slice(1)}
          topLabel="My Doughnut"
          hoverText="items"
        />
      )}
      {selectGraphType === "line" && (
        <LineGraph orders={timeOrdersCount} timeScale={selectTimeScale} />
      )}
    </>
  );
};

export default OrderStatusGraph;
