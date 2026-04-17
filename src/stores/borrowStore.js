// src/stores/borrowStore.js
import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import {
  getBorrows,
  getBorrowById,
  createBorrow,
  returnBorrow,
} from "@/services/borrowService";

export const useBorrowStore = defineStore("borrow", {
  state: () => ({
    borrows:      [],
    borrowDetail: null,
    loading:      false,
    submitting:   false,
    page:         0,
    size:         10,
    totalPages:   1,
    totalElements: 0,
    status:       "BORROWING", // tab đang chọn
    keyword: "",
  }),

  actions: {
    async fetchBorrows() {
      this.loading = true;
      const toast = useToast();
      try {
        const res = await getBorrows({
          status: this.status,
          page:   this.page,
          size:   this.size,
          keyword: this.keyword || undefined,
        });
        const data        = res.data.result;
        this.borrows      = data.content       ?? [];
        this.totalPages   = data.totalPages    ?? 1;
        this.totalElements = data.totalElements ?? 0;
      } catch {
        toast.error("Không tải được danh sách phiếu mượn");
        this.borrows = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchDetail(id) {
      const toast = useToast();
      try {
        const res = await getBorrowById(id);
        this.borrowDetail = res.data.result;
      } catch {
        toast.error("Không tải được chi tiết phiếu mượn");
      }
    },

    async create(payload) {
      this.submitting = true;
      const toast = useToast();
      try {
        await createBorrow(payload);
        toast.success("Tạo phiếu mượn thành công");
        await this.fetchBorrows();
        return true;
      } catch (err) {
        toast.error(err.response?.data?.message || "Không thể tạo phiếu mượn");
        return false;
      } finally {
        this.submitting = false;
      }
    },

    async processReturn(id, payload) {
      this.submitting = true;
      const toast = useToast();
      try {
        const res = await returnBorrow(id, payload);
        toast.success("Xử lý trả sách thành công");
        // Cập nhật detail và list
        this.borrowDetail = res.data.result;
        await this.fetchBorrows();
        return true;
      } catch (err) {
        toast.error(err.response?.data?.message || "Không thể xử lý trả sách");
        return false;
      } finally {
        this.submitting = false;
      }
    },

    setStatus(status) {
      this.status = status;
      this.page   = 0;
      this.fetchBorrows();
    },

    setPage(p) {
      this.page = p;
      this.fetchBorrows();
    },

    setKeyword(kw) {
      this.keyword = kw;
      this.page    = 0;
      this.fetchBorrows();
    },
  },
});