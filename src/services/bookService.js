// src/services/bookService.js
import axiosClient from "./axiosClient";

export const getBooks = (params) => {
  // params: { keyword, category, page, size }
  return axiosClient.get("/books", { params });
};

export const getBookDetail = (id) => {
  return axiosClient.get(`/books/${id}`);
};

export const createBook = (formData) =>
  axiosClient.post("/books", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
 
export const updateBook = (id, formData) =>
  axiosClient.put(`/books/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteBook = (id) => {
  return axiosClient.delete(`/books/${id}`);
};