export type TimeScale = "day" | "month" | "year" | "6month" | "all";

export type STOCK = {
  product: string;
  stock: number;
};

export type ORDERS_COUNT = {
  ordered: number;
  undelivered: number;
  delivered: number;
  cancelled: number;
  returned: number;
};

export type ORDER_STATUS_COUNT = {
  ordered: number;
  undelivered: number;
  delivered: number;
  cancelled: number;
  returned: number;
};

export type COUNTRY = {
  _id: string;
  name: string;
  isoAlpha2: string;
  isoAlpha3: string;
  isoNumeric: number;
  currency: {
    code: string;
    name: string;
    symbol: string;
  };
  flag: string;
  dial_code: string;
};

export type BUY_REVIEW = {
  _id: string;
  product: string;
  rate: number;
  title: string;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
  user: string;
};

export type BUY = {
  _id: string;
  product: PRODUCT;
  rating: BUY_REVIEW;
  price: number;
  buyPrice: number;
  currency_code: string;
  quantity: number;
  address: ADDRESS;
  country: COUNTRY;
  isDelivered: boolean;
  deliveredDate: Date;
  isCancelled: boolean;
  reasonForCancelled?: string;
  isReturned: boolean;
  reasonForReturned?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ADDRESS = {
  _id: string;
  name: string;
  mobile: string;
  dial_code: string;
  country: string;
  address: string;
  district: string;
  state: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type USER = {
  _id: string;
  name: string;
  email: string;
  photo: string;
  dial_code: string;
  mobile: string;
};

export type REVIEW = {
  _id: string;
  product: string;
  rate: number;
  title: string;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
  user: USER;
};

export type NEW_REVIEW = {
  buyId: string;
  productId: string;
  rate: number;
  title: string;
  comment: string;
};

export type ERRORS = {
  [key: string]: string;
};

export type PRODUCT_PRICE = {
  _id: string;
  product: string;
  country: string;
  currency_code: string;
  price: number;
  discountPercentage: number;
  discountedPrice: number;
  deliveryCharge: number;
  errors?: ERRORS;
};

export type ADD_PRODUCT_PRICE = {
  country: string;
  currency_code: string;
  exchangeRate: number;
  price: number;
  discountPercentage: number;
  discountedPrice: number;
  deliveryCharge: number;
  errors?: ERRORS;
};

export type RATING_COUNT = {
  product: string;
  totalRatings: number;
  totalComments: number;
  avgRating: number;
};

export type PRODUCT = {
  _id: string;
  title: string;
  description: string;
  price: PRODUCT_PRICE;
  deliveredBy: number;
  category: CATEGORY;
  thumbnail: string;
  images?: string[];
  rate: number;
  rateCount?: number;
  stock: number;
  isReadyToSale: boolean;
  rating?: RATING_COUNT;
  createdAt: Date;
  updatedAt: Date;
};

export type CATEGORY = {
  _id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ADD_CATEGORY = {
  title: string;
};

export type PARAMS = {
  id: string;
};
