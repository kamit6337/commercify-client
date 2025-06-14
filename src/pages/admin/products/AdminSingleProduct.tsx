import ReactIcons from "@/assets/icons";
import DeleteProduct from "@/components/admin/products/DeleteProduct";
import UpdatePrice from "@/components/admin/products/update_price/UpdatePrice";
import UpdateProduct from "@/components/admin/products/UpdateProduct";
import UpdateSale from "@/components/admin/products/UpdateSale";
import UpdateStock from "@/components/admin/products/UpdateStock";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { currencyState } from "@/redux/slice/currencySlice";
import { PRODUCT } from "@/types";
import { useState } from "react";
import { useSelector } from "react-redux";

type Props = {
  product: PRODUCT;
};

const AdminSingleProduct = ({ product }: Props) => {
  const { symbol } = useSelector(currencyState);
  const [openDialog, setOpenDialog] = useState("");

  const {
    _id,
    category: { title: categoryTitle },
    deliveredBy,
    description,
    title,
    price: { price, discountPercentage, deliveryCharge, discountedPrice },
    rate,
    rateCount,
    thumbnail,
    stock,
    isReadyToSale,
  } = product;

  const rateValue = Math.floor(rate);
  let fraction = rate - rateValue;
  fraction = parseFloat(fraction.toFixed(2));

  return (
    <div
      key={_id}
      className="flex flex-col lg:flex-row gap-3 border-b last:border-none p-5"
    >
      <div className="flex justify-between">
        <div className="w-48 grow-0 shrink-0">
          <img src={thumbnail} alt={title} className="w-full object-cover" />
        </div>
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger className="lg:hidden self-start flex justify-end p-2">
              <ReactIcons.options />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col">
              <AlertDialogTrigger onClick={() => setOpenDialog("details")}>
                <DropdownMenuItem>Update Details</DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogTrigger onClick={() => setOpenDialog("stock")}>
                <DropdownMenuItem>Update Stock</DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogTrigger onClick={() => setOpenDialog("sale")}>
                <DropdownMenuItem>Update Sale</DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogTrigger onClick={() => setOpenDialog("price")}>
                <DropdownMenuItem>Update Price</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          {openDialog === "details" ? <UpdateProduct product={product} /> : ""}
          {openDialog === "stock" ? <UpdateStock product={product} /> : ""}
          {openDialog === "sale" ? <UpdateSale product={product} /> : ""}
          {openDialog === "price" ? <UpdatePrice product={product} /> : ""}
        </AlertDialog>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {/* MARK: RATE AVERAGE VALUE STAR */}
          <div className="flex text-2xl h-10">
            {Array.from({ length: 5 }).map((_VALUE, i) => {
              if (i < rateValue) {
                return (
                  <p key={i} className="w-8 flex items-center justify-center">
                    <ReactIcons.star className="text-yellow-300" />
                  </p>
                );
              }

              if (i === rateValue && fraction > 0) {
                return (
                  <p key={i} className="w-8 flex items-center justify-center">
                    <ReactIcons.star_half className="text-yellow-300" />
                  </p>
                );
              }

              return (
                <p key={i} className="w-8 flex items-center justify-center">
                  <ReactIcons.star_empty className="" />
                </p>
              );
            })}
          </div>

          {/* MARK: RATE AND REVIEWS COUNT */}
          <div className="flex items-center">
            <p>{rate} star - </p>
            <p>{rateCount} ratings</p>
          </div>
        </div>

        <div className="mb-3 space-y-2">
          <p className="font-semibold">{title}</p>
          <p>{description}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <p className="text-sm text-gray-500">Category : </p>
            <p className="font-semibold capitalize">{categoryTitle}</p>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-sm text-gray-500">Delivered by : </p>
            <p className="font-semibold">{deliveredBy} days</p>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-sm text-gray-500">Base Price : </p>
            <p className="font-semibold">
              {symbol}
              {price}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-sm text-gray-500">Discount : </p>
            <p className="font-semibold">{discountPercentage}%</p>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-sm text-gray-500">Final Price : </p>
            <p className="font-semibold">
              {symbol}
              {discountedPrice}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-sm text-gray-500">Delivery Charge : </p>
            <p className="font-semibold">
              {symbol}
              {deliveryCharge}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-sm text-gray-500">Current Stock : </p>
            <p className="font-semibold">{stock}</p>
          </div>
          {isReadyToSale ? (
            <p className="border rounded px-5 py-2 bg-green-400 text-white w-max">
              Currently on Sale
            </p>
          ) : (
            <p className="border rounded px-5 py-2 bg-red-400 text-white w-max">
              Stopped the Sale
            </p>
          )}
        </div>
      </div>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger className="hidden self-start lg:flex justify-end p-2">
            <ReactIcons.options />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="flex flex-col">
            <AlertDialogTrigger onClick={() => setOpenDialog("details")}>
              <DropdownMenuItem>Update Details</DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogTrigger onClick={() => setOpenDialog("stock")}>
              <DropdownMenuItem>Update Stock</DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogTrigger onClick={() => setOpenDialog("sale")}>
              <DropdownMenuItem>Update Sale</DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogTrigger onClick={() => setOpenDialog("price")}>
              <DropdownMenuItem>Update Price</DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogTrigger onClick={() => setOpenDialog("delete")}>
              <DropdownMenuItem>Delete Product</DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        {openDialog === "details" ? <UpdateProduct product={product} /> : ""}
        {openDialog === "stock" ? <UpdateStock product={product} /> : ""}
        {openDialog === "sale" ? <UpdateSale product={product} /> : ""}
        {openDialog === "price" ? <UpdatePrice product={product} /> : ""}
        {openDialog === "delete" ? <DeleteProduct product={product} /> : ""}
      </AlertDialog>
    </div>
  );
};

export default AdminSingleProduct;
