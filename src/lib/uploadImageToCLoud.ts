import { getReq } from "@/utils/api/api";
import axios from "axios";

const uploadImageToCLoud = async (imageFile: File) => {
  try {
    const getImageUrl = await getReq("/file/image");

    const { timestamp, signature, apiKey, folder, eager, url } = getImageUrl;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("eager", eager);
    formData.append("folder", folder);

    const uploadRes = await axios.post(url, formData);

    return uploadRes?.data?.secure_url;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error?.message : "Something went wrong"
    );
  }
};

export default uploadImageToCLoud;
