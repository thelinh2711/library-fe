import axiosClient from "./axiosClient";

// ─────────────────────────────────────────────
// STUDENT
// ─────────────────────────────────────────────

// POST /reservations — đặt trước
export const createReservation = (bookId) =>
  axiosClient.post("/reservations", { bookId });

// GET /reservations/my — lịch sử của mình (có filter status)
export const getMyReservations = (params = {}) =>
  axiosClient.get("/reservations/my", { params });

// PATCH /reservations/:id/cancel — huỷ
export const cancelReservation = (id) =>
  axiosClient.patch(`/reservations/${id}/cancel`);


// ─────────────────────────────────────────────
// ADMIN / LIBRARIAN
// ─────────────────────────────────────────────

// GET /reservations/search — thay cho API cũ /reservations
export const getReservations = (params = {}) =>
  axiosClient.get("/reservations/search", { params });

// PATCH /reservations/:id/confirm — xác nhận
export const confirmReservation = (id) =>
  axiosClient.patch(`/reservations/${id}/confirm`);

// GET /reservations/student/:studentId — xem theo student
export const getReservationsByStudent = (studentId, params = {}) =>
  axiosClient.get(`/reservations/student/${studentId}`, { params });