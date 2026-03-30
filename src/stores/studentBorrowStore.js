import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import { getMyBorrows } from "@/services/studentBookStatusService";

export const useStudentBorrowStore = defineStore("studentBorrow", {
  state: () => ({
    records:       [],
    loading:       false,
    page:          0,
    size:          10,
    totalPages:    1,
    totalElements: 0,
  }),

  actions: {
    async fetchMy() {
      this.loading = true;
      const toast = useToast();
      try {
        const res          = await getMyBorrows({ page: this.page, size: this.size });
        const data         = res.data.result;
        this.records       = data.content       ?? [];
        this.totalPages    = data.totalPages     ?? 1;
        this.totalElements = data.totalElements  ?? 0;
      } catch {
        toast.error("Không tải được lịch sử mượn sách");
        this.records = [];
      } finally {
        this.loading = false;
      }
    },

    setPage(p) {
      this.page = p;
      this.fetchMy();
    },
  },
});