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
  createdAt: Date;
  updatedAt: Date;
};

export type ADDRESS = {
  _id: string;
  name: string;
  mobile: number;
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
  photo: string;
};

export type REVIEW = {
  _id: string;
  rate: number;
  title: string;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
  user: USER;
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
  rateCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CATEGORY = {
  _id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PARAMS = {
  id: string;
};
