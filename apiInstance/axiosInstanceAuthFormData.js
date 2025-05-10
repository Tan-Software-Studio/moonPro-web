import axios from "axios";
import { BACKEND_BASE_URL } from "./baseurl";

const BACKEND_URL = BACKEND_BASE_URL;

const axiosInstanceAuthFormData = axios.create({
  baseURL: BACKEND_URL,
});

axiosInstanceAuthFormData.interceptors.request.use((config) => {
  const auth = localStorage.getItem("token");
  if (auth) {
    config.headers = {
      Authorization: `Bearer ${auth}`,
      Accept: "application/json",
      "content-type": "multipart/form-data",
    };
  }
  return config;
});

axiosInstanceAuthFormData.interceptors.response.use((response) => response);
export default axiosInstanceAuthFormData;
