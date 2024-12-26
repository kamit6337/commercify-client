import { CATEGORY, PRODUCT } from "@/types";
import useCategoryProducts from "@/hooks/category/useCategoryProducts";
import Loading from "@/lib/Loading";
import HorizontalList from "@/components/HorizontalList";

type Props = {
  category: CATEGORY;
  productId: string;
};

const CategoryProducts = ({ category, productId }: Props) => {
  const { _id, title } = category;

  const { isLoading, error, data, isFetching, fetchNextPage } =
    useCategoryProducts(_id);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        {error.message}
      </div>
    );
  }

  const products = data?.pages.flat(1) as PRODUCT[];

  const filterProducts = products.filter((obj) => obj._id !== productId);

  return (
    <HorizontalList
      products={filterProducts}
      name={`Suggested Products from Category : ${title}`}
      isFetching={isFetching}
      fetchNextPage={fetchNextPage}
      pagination={true}
    />
  );
};

export default CategoryProducts;
