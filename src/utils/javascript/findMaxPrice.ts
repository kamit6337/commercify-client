import { PRODUCT } from "@/types";

const findMinMaxPrice = (products: PRODUCT[], currency_code: string) => {
  let maxPrice = 0;
  let minPrice = 0;

  for (const product of products) {
    const { discountedPrice } = product.price[currency_code];

    if (discountedPrice >= maxPrice) {
      maxPrice = discountedPrice;
    }

    if (minPrice === 0 || discountedPrice < minPrice) {
      minPrice = discountedPrice;
    }
  }

  return { maxPrice, minPrice };
};

export default findMinMaxPrice;
