// src/services/bookService.js
import axiosClient from "./axiosClient";

export const getBooks = (params) => {
  // params: { keyword, category, page, size }
  return axiosClient.get("/books", { params });
};

export const getBookDetail = (id) => {
  return axiosClient.get(`/books/${id}`);
};

export const createBook = (data) => {
  return axiosClient.post("/books", data);
};

export const updateBook = (id, data) => {
  return axiosClient.put(`/books/${id}`, data);
};

export const deleteBook = (id) => {
  return axiosClient.delete(`/books/${id}`);
};