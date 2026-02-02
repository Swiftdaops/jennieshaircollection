import axios from "axios";
import { getApiBase } from "./apiBase";

export const apiClient = axios.create({
  baseURL: getApiBase(),
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
  timeout: 30000,
});

export function getAxiosErrorMessage(error, fallback = "Request failed") {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}
