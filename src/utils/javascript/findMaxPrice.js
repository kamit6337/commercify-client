const findMaxPrice = (products) => {
  let maxPrice = 0;

  for (const product of products) {
    const roundDiscountPercent = Math.round(product.discountPercentage);
    const discountedPrice = Math.round(
      (product.price * (100 - roundDiscountPercent)) / 100
    );

    if (discountedPrice >= maxPrice) {
      maxPrice = discountedPrice;
    }
  }

  return maxPrice;
};

export default findMaxPrice;
