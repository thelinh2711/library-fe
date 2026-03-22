import axiosClient from "./axiosClient";

export const getCategories = () => {
  return axiosClient.get("/categories");
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