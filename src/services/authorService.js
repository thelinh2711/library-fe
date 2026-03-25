import axiosClient from "./axiosClient";

export const getAuthors = (params) => {
  return axiosClient.get("/authors", { params });
};

export const createAuthor = (data) => {
  return axiosClient.post("/authors", data);
};

export const updateAuthor = (id, data) => {
  return axiosClient.put(`/authors/${id}`, data);
};

export const deleteAuthor = (id) => {
  return axiosClient.delete(`/authors/${id}`);
};