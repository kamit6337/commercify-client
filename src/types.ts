export type TimeScale = "day" | "month" | "year" | "6month" | "all";

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
  id: number;
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
  code: string;
};

export type BUY = {
  _id: string;
  product: PRODUCT;
  price: number;
  exchangeRate: number;
  quantity: number;
  address: ADDRESS;
  isDelivered: boolean;
  deliveredDate: Date;
  isCancelled: boolean;
  isReturned: boolean;
  isDelievered: boolean;
  reasonForReturned?: string;
  reasonForCancelled?: string;
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
  product: string;
  rate: number;
  title: string;
  comment: string;
};

export type PRODUCT = {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  deliveredBy: number;
  category: CATEGORY;
  thumbnail: string;
  images?: string[];
  rate: number;
  rateCount?: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ADD_PRODUCT = {
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  deliveredBy: number;
  category: string;
  thumbnail: string;
  images?: string[];
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
