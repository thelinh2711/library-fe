import axiosClient from "./axiosClient";
 
export const getBorrows        = (params)       => axiosClient.get("/borrows", { params });
export const getBorrowById     = (id)           => axiosClient.get(`/borrows/${id}`);
export const getStudentBorrows = (studentId, params) =>
  axiosClient.get(`/borrows/student/${studentId}`, { params });
export const createBorrow      = (payload)      => axiosClient.post("/borrows", payload);
export const returnBorrow      = (id, payload)  => axiosClient.post(`/borrows/${id}/return`, payload);