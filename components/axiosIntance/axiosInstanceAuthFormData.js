import axios from "axios";
import { BACKEND_BASE_URL } from "./baseurl";

const BACKEND_URL = BACKEND_BASE_URL;

const axiosInstanceAuthFormData = axios.create({
  baseURL: BACKEND_URL,
});

axiosInstanceAuthFormData.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem("Token");
    if (auth) {
      config.headers = {
        Authorization: `${auth}`,
        Accept: "application/json",
        "content-type": "multipart/form-data",
      };
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axiosInstanceAuthFormData.interceptors.response.use(
  (response) => response,
  (error) => {
    Promise.reject(error);
  }
);
export default axiosInstanceAuthFormData;
