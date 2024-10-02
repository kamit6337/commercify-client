const findMinMaxPrice = (products, exchangeRate) => {
  let maxPrice = 0;
  let minPrice = null;

  for (const product of products) {
    const exchangeRatePrice = Math.round(product.price * exchangeRate);
    const roundDiscountPercent = Math.round(product.discountPercentage);
    const discountedPrice = Math.round(
      (exchangeRatePrice * (100 - roundDiscountPercent)) / 100
    );

    if (discountedPrice >= maxPrice) {
      maxPrice = discountedPrice;
    }

    if (minPrice === null || discountedPrice < minPrice) {
      minPrice = discountedPrice;
    }
  }

  return { maxPrice, minPrice };
};

export default findMinMaxPrice;
