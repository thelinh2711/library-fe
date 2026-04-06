// src/services/forgotPasswordService.js
import axiosClient from "./axiosClient";

/**
 * Bước 1 — Gửi OTP về email
 * @param {string} email
 */
export const sendOtpApi = (email) => {
  return axiosClient.post("/auth/forgot-password", { email });
};

/**
 * Bước 2 — Xác minh OTP, nhận resetToken
 * @param {string} email
 * @param {string} otp
 */
export const verifyOtpApi = (email, otp) => {
  return axiosClient.post("/auth/verify-otp", { email, otp });
};

/**
 * Bước 3 — Đặt lại mật khẩu bằng resetToken
 * @param {string} resetToken
 * @param {string} newPassword
 * @param {string} confirmPassword
 */
export const resetPasswordApi = (resetToken, newPassword, confirmPassword) => {
  return axiosClient.post("/auth/reset-password", {
    resetToken,
    newPassword,
    confirmPassword,
  });
};