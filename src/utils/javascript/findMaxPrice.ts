import { PRODUCT } from "@/types";

const findMinMaxPrice = (products: PRODUCT[], exchangeRate: number) => {
  let maxPrice = 0;
  let minPrice = 0;

  for (const product of products) {
    const exchangeRatePrice = Math.round(product.price * exchangeRate);
    const roundDiscountPercent = Math.round(product.discountPercentage);
    const discountedPrice = Math.round(
      (exchangeRatePrice * (100 - roundDiscountPercent)) / 100
    );

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
