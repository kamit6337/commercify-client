import axios from "axios";
import environment from "../environment";
import catchAsyncError from "@/lib/catchAsyncError";
import getAuthToken from "./getAuthToken";

const BASE_URL = environment.SERVER_URL + "/auth";

export const getAuthReq = catchAsyncError(
  async (url: string, params?: object) => {
    const token = getAuthToken();

    const get = await axios.get(`${BASE_URL}${url}`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return get?.data;
  }
);

export const postAuthReq = catchAsyncError(
  async (url: string, body: object) => {
    const token = getAuthToken();

    const post = await axios.post(`${BASE_URL}${url}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return post?.data;
  }
);

export const patchAuthReq = catchAsyncError(
  async (url: string, body: object) => {
    const token = getAuthToken();

    const patch = await axios.patch(`${BASE_URL}${url}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return patch?.data;
  }
);

export const deleteAuthReq = catchAsyncError(
  async (url: string, params: object) => {
    const token = getAuthToken();

    const deleted = await axios.delete(`${BASE_URL}${url}`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return deleted?.data;
  }
);
