import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import {
  createReservation,
  getMyReservations,
  cancelReservation,
  getReservations,
  confirmReservation,
} from "@/services/reservationService";

export const useReservationStore = defineStore("reservation", {
  state: () => ({
    // ── Sinh viên ──────────────────────────────────────────
    reservations: [],
    loading:      false,
    submitting:   false,
    page:         0,
    size:         10,
    totalPages:   0,

    // ── Admin (thủ thư) ────────────────────────────────────
    adminReservations:  [],
    adminLoading:       false,
    adminActionLoading: null,   // id đang xử lý — disable đúng từng row
    adminPage:          0,
    adminTotalPages:    1,
    adminTotalElements: 0,
    adminStatus:        "PENDING", // tab đang chọn
  }),

  actions: {
    // ══ SINH VIÊN ══════════════════════════════════════════

    async fetchMy() {
      this.loading = true;
      const toast = useToast();
      try {
        const res = await getMyReservations(this.page, this.size);
        const data = res.data.result;
        this.reservations = data.content;
        this.totalPages   = data.totalPages;
      } catch {
        toast.error("Không tải được lịch sử đặt trước");
      } finally {
        this.loading = false;
      }
    },

    async reserve(bookId) {
      this.submitting = true;
      const toast = useToast();
      try {
        await createReservation(bookId);
        toast.success("Đặt trước sách thành công! 🎉");
        if (this.reservations.length > 0) await this.fetchMy();
        return true;
      } catch (err) {
        toast.error(err.response?.data?.message || "Không thể đặt trước sách");
        return false;
      } finally {
        this.submitting = false;
      }
    },

    async cancel(id) {
      this.submitting = true;
      const toast = useToast();
      try {
        await cancelReservation(id);
        toast.success("Đã huỷ đặt trước");
        // Cập nhật local state ngay, không cần fetch lại
        const item = this.reservations.find((r) => r.id === id);
        if (item) item.status = "CANCELLED";
      } catch (err) {
        toast.error(err.response?.data?.message || "Không thể huỷ đặt trước");
      } finally {
        this.submitting = false;
      }
    },

    setPage(p) {
      this.page = p;
      this.fetchMy();
    },

    // ══ ADMIN (thủ thư) ════════════════════════════════════

    async fetchAdmin() {
      this.adminLoading = true;
      const toast = useToast();
      try {
        const res = await getReservations({
          status: this.adminStatus, // gửi thẳng
          page: this.adminPage,
          size: 10,
        });
        const data = res.data.result;
        this.adminReservations  = data.content      ?? [];
        this.adminTotalPages    = data.totalPages    ?? 1;
        this.adminTotalElements = data.totalElements ?? 0;
      } catch {
        toast.error("Không tải được danh sách đặt trước");
        this.adminReservations = [];
      } finally {
        this.adminLoading = false;
      }
    },

    async confirmAdmin(id) {
      this.adminActionLoading = id;
      const toast = useToast();
      try {
        await confirmReservation(id);
        toast.success("Đã xác nhận đặt trước");
        await this.fetchAdmin();
      } catch (err) {
        toast.error(err.response?.data?.message || "Không thể xác nhận");
      } finally {
        this.adminActionLoading = null;
      }
    },

    async cancelAdmin(id) {
      this.adminActionLoading = id;
      const toast = useToast();
      try {
        await cancelReservation(id);
        toast.success("Đã huỷ đặt trước");
        await this.fetchAdmin();
      } catch (err) {
        toast.error(err.response?.data?.message || "Không thể huỷ");
      } finally {
        this.adminActionLoading = null;
      }
    },

    setAdminStatus(status) {
      this.adminStatus = status;
      this.adminPage   = 0;
      this.fetchAdmin();
    },

    setAdminPage(p) {
      this.adminPage = p;
      this.fetchAdmin();
    },
  },
});