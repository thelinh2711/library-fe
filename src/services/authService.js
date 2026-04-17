import axiosClient from "./axiosClient";

export const loginApi = (data) => {
  return axiosClient.post("/auth/login", data);
};

export const refreshApi = () => {
  return axiosClient.post("/auth/refresh");
};

export const logoutApi = () => {
  return axiosClient.post("/auth/logout");
};