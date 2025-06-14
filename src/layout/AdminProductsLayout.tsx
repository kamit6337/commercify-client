import AddCategory from "@/components/admin/category/AddCategory";
import UpdateCategory from "@/components/admin/category/UpdateCategory";
import AddProduct from "@/components/admin/products/add_product/AddProduct";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import useProductsCount from "@/hooks/admin/useProductsCount";
import useAllCategory from "@/hooks/category/useAllCategory";
import Loading from "@/lib/Loading";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

type CATEGORY_PRODUCT = {
  _id: string;
  title: string;
  categoryProductsCount: number;
};

const AdminProductsLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isLoading: isLoadingAllCategory, error: errorAllCategory } =
    useAllCategory();

  const { data: productsCount } = useProductsCount();

  const categoryProducts = productsCount.categoryProducts;

  if (isLoadingAllCategory) {
    return <Loading />;
  }

  if (errorAllCategory) {
    return <p>{errorAllCategory.message}</p>;
  }

  return (
    <div className="bg-gray-100 p-5 flex gap-3 flex-col lg:flex-row lg:items-start">
      <div className="space-y-5 lg:w-60 w-full lg:sticky top-[100px] max-h-[550px] overflow-y-auto">
        <AlertDialog>
          <AlertDialogTrigger className="w-full">
            <p className="w-full bg-green-500 py-3 rounded text-center font-semibold text-white">
              Add Product
            </p>
          </AlertDialogTrigger>
          <AddProduct />
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger className="w-full">
            <p className="w-full bg-green-500 py-3 rounded text-center font-semibold text-white">
              Add Category
            </p>
          </AlertDialogTrigger>
          <AddCategory />
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger className="w-full">
            <p className="w-full bg-green-500 py-3 rounded text-center font-semibold text-white">
              Update Category
            </p>
          </AlertDialogTrigger>
          <UpdateCategory />
        </AlertDialog>

        <div className="bg-white ">
          <p
            className={`py-5 border-b font-semibold text-center cursor-pointer ${
              pathname.startsWith("/admin") ? "text-blue-500 " : ""
            }`}
            onClick={() => navigate("/admin")}
          >
            Admin
          </p>
          <p
            className={`py-5 border-b font-semibold text-center cursor-pointer ${
              pathname === "/admin/products" ? "text-blue-500 " : ""
            }`}
            onClick={() => navigate("/admin/products")}
          >
            All ({productsCount.products})
          </p>
          {categoryProducts?.length > 0 &&
            categoryProducts.map((obj: CATEGORY_PRODUCT) => {
              const { _id, title, categoryProductsCount } = obj;

              return (
                <p
                  className={`py-5 border-b font-semibold text-center capitalize cursor-pointer ${
                    pathname === `/admin/products/category/${_id}`
                      ? "text-blue-500 "
                      : ""
                  }`}
                  key={_id}
                  onClick={() => navigate(`/admin/products/category/${_id}`)}
                >
                  {title} ({categoryProductsCount})
                </p>
              );
            })}
        </div>
      </div>

      <div className="flex-1 min-h-96 ">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminProductsLayout;
