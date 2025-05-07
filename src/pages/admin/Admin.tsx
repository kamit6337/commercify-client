import useAdminCountDetails from "@/hooks/admin/useAdminCountDetails";
import useProductsCount from "@/hooks/admin/useProductsCount";
import { useNavigate } from "react-router-dom";

type CATEGORY_PRODUCT = {
  _id: string;
  title: string;
  categoryProductsCount: number;
};

const Admin = () => {
  const navigate = useNavigate();
  const { data: orderCounts } = useAdminCountDetails();
  const { data: productsCount } = useProductsCount();

  const categoryProducts = productsCount.categoryProducts;

  return (
    <main className="bg-gray-100 p-5 flex gap-3 flex-col lg:flex-row lg:items-start">
      {/* MARK: SIDE NAVBAR */}

      <div className="bg-white lg:w-60 w-full lg:sticky top-[100px]">
        <p
          className="py-5 border-b font-semibold text-center cursor-pointer"
          onClick={() => navigate("/admin/order-status")}
        >
          Order Status
        </p>
        <p
          className="py-5 border-b font-semibold text-center cursor-pointer"
          onClick={() => navigate("/admin/products")}
        >
          Products
        </p>
        <p className="py-5 font-semibold text-center cursor-pointer">
          Categories
        </p>
      </div>

      <div className="bg-white flex-1">
        {/* MARK: ORDER STATUS */}
        <div className="p-10 border-b-2 space-y-10">
          <div className="flex items-center justify-between">
            <p>Order Status</p>
            <p>Time</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <p className="bg-gray-100 p-2 rounded">
              Ordered ({orderCounts.ordered})
            </p>
            <p className="bg-gray-100 p-2 rounded">
              Un-Delievered ({orderCounts.undelivered})
            </p>
            <p className="bg-gray-100 p-2 rounded">
              Delievered ({orderCounts.delivered})
            </p>
            <p className="bg-gray-100 p-2 rounded">
              Cancelled ({orderCounts.cancelled})
            </p>
            <p className="bg-gray-100 p-2 rounded">
              Returned ({orderCounts.returned})
            </p>
          </div>
        </div>

        {/* MARK: PRODUCTS */}
        <div className="p-10 border-b-2 space-y-10">
          <p>Products</p>
          <p className="bg-gray-100 p-2 rounded w-max">
            Total Products ({productsCount.products})
          </p>
        </div>

        {categoryProducts?.length > 0 && (
          <div className="p-10 border-b-2 space-y-10">
            <p>Category Products</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categoryProducts.map((obj: CATEGORY_PRODUCT) => {
                const { _id, title, categoryProductsCount } = obj;

                return (
                  <p className="bg-gray-100 p-2 rounded capitalize" key={_id}>
                    {title} ({categoryProductsCount})
                  </p>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Admin;
