// src/services/studentBookStatusService.js
import axiosClient from "./axiosClient";

export const getMyBorrows = (page = 0, size = 50) =>
  axiosClient.get("/borrows/my", { params: { page, size } });

export const getMyReservationStatuses = (page = 0, size = 50) =>
  axiosClient.get("/reservations/my", { params: { page, size } });