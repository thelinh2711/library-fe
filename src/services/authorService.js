import axiosClient from "./axiosClient";

export const getAuthors = () => {
  return axiosClient.get("/authors");
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