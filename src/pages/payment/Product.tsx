import { Link } from "react-router-dom";
import { BUY } from "@/types";
import makeDateFromUTC from "@/utils/javascript/makeDateFromUTC";

type Props = {
  buyProduct: BUY;
};

const Product = ({ buyProduct }: Props) => {
  const {
    currency: { symbol },
  } = buyProduct.country;
  const { _id: id, title, thumbnail } = buyProduct.product;
  const { buyPrice, quantity, deliveredDate } = buyProduct;
  const { country, district, state, address } = buyProduct.address;

  return (
    <div className="w-full border-b-2 lg:p-7 p-2 flex justify-between lg:gap-10 gap-5">
      <section className="flex-1 flex justify-between gap-2 lg:gap-6">
        {/* MARK: IMAGE PART */}
        <div className="md:w-48 w-32">
          <Link to={`/products/${id}`}>
            <img src={thumbnail} alt={title} className="w-full object-cover" />
          </Link>
        </div>

        <div className="flex-1 space-y-5">
          {/* MARK: DETAIL PART */}
          <div className="flex-1 flex flex-col gap-2">
            <Link to={`/products/${id}`}>
              <p className="text-sm break-all">{title}</p>
            </Link>

            <div className="flex gap-2 items-center">
              <p className="text-2xl font-semibold tracking-wide">
                {symbol}
                {buyPrice}
              </p>
            </div>
            <div className="text-xs">Qty : {quantity}</div>
          </div>
          {/* MARK: DELIVERY PART */}
          <div className="w-full lg:hidden">
            <div className="flex items-center gap-3 text-sm">
              <p className="font-semibold">Delievered By:</p>
              <p className="text-base">{makeDateFromUTC(deliveredDate)}</p>
            </div>
            <div className="flex mt-2 lg:gap-3 text-sm flex-col gap-1">
              <p className="whitespace-nowrap font-semibold ">On Address:</p>
              <div className="cursor-pointer">
                <p className="text-sm">{address}</p>
                <div className="flex">
                  <p className="text-sm">{district},</p>
                  <p className="ml-2 text-sm">{state}</p>
                  <p className="mx-1">-</p>
                  <p>{country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARK: DELIVERY PART */}
      <div className="min-w-96 hidden lg:block">
        <div className="flex items-center gap-3 text-sm">
          <p>Delievered By:</p>
          <p className="text-base">{makeDateFromUTC(deliveredDate)}</p>
        </div>
        <div className="flex mt-2 gap-3 text-sm">
          <p className="whitespace-nowrap">On Address:</p>
          <div className="cursor-pointer">
            <p className="text-sm">{address}</p>
            <div className="flex">
              <p className="text-sm">{district},</p>
              <p className="ml-2 text-sm">{state}</p>
              <p className="mx-1">-</p>
              <p>{country}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
