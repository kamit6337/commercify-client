import BarGraph from "@/components/charts/BarGraph";
import useProductsCount from "@/hooks/admin/useProductsCount";

type CATEGORY_PRODUCT = {
  _id: string;
  title: string;
  categoryProductsCount: number;
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
  const { data: productCounts } = useProductsCount();

  const categoryProducts = productCounts.categoryProducts;

  const chartCategoryData = categoryProducts.map(
    (obj: CATEGORY_PRODUCT, i: number) => {
      const { title, categoryProductsCount } = obj;

      return {
        name: title,
        count: categoryProductsCount,
        color: COLORS[i % COLORS.length],
        borderColor: BORDER_COLORS[i % BORDER_COLORS.length],
      };
    }
  );

  const chartData = [
    {
      name: "All Products",
      count: productCounts.products,
      color: "rgba(75, 192, 192, 0.7)",
      borderColor: "rgba(75, 192, 192, 1)",
    },
    ...chartCategoryData,
  ];

  return (
    <BarGraph
      data={chartData}
      topLabel="Products Overview"
      hoverText="products"
      yLabel="Number of Products"
    />
  );
};

export default ProductsGraph;
