import ReactIcons from "@/assets/icons";
import UpdateProduct from "@/components/admin/products/UpdateProduct";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { currencyState } from "@/redux/slice/currencySlice";
import { PRODUCT } from "@/types";
import changePriceDiscountByExchangeRate from "@/utils/javascript/changePriceDiscountByExchangeRate";
import { useSelector } from "react-redux";

type Props = {
  product: PRODUCT;
};

const AdminSingleProduct = ({ product }: Props) => {
  const { symbol, exchangeRate } = useSelector(currencyState);

  const {
    _id,
    category: { title: categoryTitle },
    deliveredBy,
    description,
    title,
    discountPercentage,
    price,
    rate,
    rateCount,
    thumbnail,
  } = product;

  const rateValue = Math.floor(rate);
  let fraction = rate - rateValue;
  fraction = parseFloat(fraction.toFixed(2));

  const { exchangeRatePrice } = changePriceDiscountByExchangeRate(
    price,
    0,
    exchangeRate
  );

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
            <DropdownMenuTrigger className="lg:hidden self-start w-20 flex justify-end">
              <ReactIcons.options />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <AlertDialogTrigger className="w-full">
                <DropdownMenuItem className="w-full">Update</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <UpdateProduct product={product} />
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
        <p className="capitalize">Category : {categoryTitle}</p>
        <p>Delivered by Days : {deliveredBy}</p>
        <p>Discount : {discountPercentage}%</p>
        <p>
          Price : {symbol}
          {exchangeRatePrice}
        </p>
      </div>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger className="hidden self-start w-20 lg:flex justify-end">
            <ReactIcons.options />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <AlertDialogTrigger className="w-full">
              <DropdownMenuItem className="w-full">Update</DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <UpdateProduct product={product} />
      </AlertDialog>
    </div>
  );
};

export default AdminSingleProduct;
