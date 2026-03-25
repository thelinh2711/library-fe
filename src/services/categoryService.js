import axiosClient from "./axiosClient";

export const getCategories = (params) => {
  return axiosClient.get("/categories", { params });
};

export const createCategory = (data) => {
  return axiosClient.post("/categories", data);
};

export const updateCategory = (id, data) => {
  return axiosClient.put(`/categories/${id}`, data);
};

export const deleteCategory = (id) => {
  return axiosClient.delete(`/categories/${id}`);
};