import axios from "axios";
import { BACKEND_BASE_URL } from "./baseurl";

const BACKEND_URL = BACKEND_BASE_URL;

const axiosInstanceAuth = axios.create({
  baseURL: BACKEND_URL,
});

axiosInstanceAuth.interceptors.request.use((config) => {
  const auth = localStorage.getItem("token");
  if (!auth) return 0
  if (auth) {
    config.headers = {
      Authorization: `Bearer ${auth}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  }
  return config;
});

axiosInstanceAuth.interceptors.response.use((response) => response);
export default axiosInstanceAuth;
