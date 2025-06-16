import BarGraph from "@/components/charts/BarGraph";
import useProductsCount from "@/hooks/admin/useProductsCount";
import { useMemo } from "react";

type CATEGORY_PRODUCT = {
  _id: string;
  title: string;
  counts: number;
};

const COLORS = [
  "rgba(75, 192, 192, 0.7)", // Teal
  "rgba(54, 162, 235, 0.7)", // Blue
  "rgba(255, 206, 86, 0.7)", // Yellow
  "rgba(255, 99, 132, 0.7)", // Red
  "rgba(153, 102, 255, 0.7)", // Purple
  "rgba(255, 159, 64, 0.7)", // Orange
  "rgba(75, 132, 152, 0.7)", // Dark Teal
];
const BORDER_COLORS = [
  "rgba(75, 192, 192, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(255, 99, 132, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
  "rgba(75, 132, 152, 1)",
];

const ProductsGraph = () => {
  const { data: categoryProducts } = useProductsCount();

  const chartCategoryData = categoryProducts.map(
    (obj: CATEGORY_PRODUCT, i: number) => {
      const { title, counts } = obj;

      return {
        name: title,
        count: counts,
        color: COLORS[i % COLORS.length],
        borderColor: BORDER_COLORS[i % BORDER_COLORS.length],
      };
    }
  );

  const allProducts = useMemo(() => {
    if (!categoryProducts || categoryProducts.length === 0) return 0;

    return categoryProducts.reduce(
      (acc: number, category: CATEGORY_PRODUCT) => {
        return (acc += category.counts);
      },
      0
    );
  }, [categoryProducts]);

  const chartData = [
    {
      name: "All Products",
      count: allProducts,
      color: "rgba(75, 192, 192, 0.7)",
      borderColor: "rgba(75, 192, 192, 1)",
    },
    ...chartCategoryData,
  ];

  return (
    <div className="w-full h-96">
      <BarGraph
        data={chartData}
        topLabel="Products Overview"
        hoverText="products"
        yLabel="Number of Products"
      />
    </div>
  );
};

export default ProductsGraph;
