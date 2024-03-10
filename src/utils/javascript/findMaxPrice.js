const findMaxPrice = (products) => {
  let maxPrice = 0;

  for (const product of products) {
    if (product.price >= maxPrice) {
      maxPrice = product.price;
    }
  }

  return maxPrice;
};

export default findMaxPrice;
