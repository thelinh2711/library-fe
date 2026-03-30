// src/stores/studentBookStatusStore.js
// Store riêng để track bookId nào sinh viên đang mượn / đã đặt trước
// Tách khỏi bookStore để không làm phức tạp logic chung

import { defineStore } from "pinia";
import { getMyBorrows, getMyReservationStatuses } from "@/services/studentBookStatusService";

export const useStudentBookStatusStore = defineStore("studentBookStatus", {
  state: () => ({
    // Set<UUID> — bookId sinh viên đang mượn (BorrowItemStatus = BORROWING)
    borrowingBookIds: new Set(),

    // Set<UUID> — bookId sinh viên đã đặt trước (ReservationStatus = PENDING | CONFIRMED)
    reservedBookIds: new Set(),

    // Map<UUID, UUID> — bookId → reservationId (để huỷ đặt trước nhanh)
    reservationIdByBookId: {},

    loading: false,
  }),

  getters: {
    isBorrowing: (state) => (bookId) => state.borrowingBookIds.has(bookId),
    isReserved:  (state) => (bookId) => state.reservedBookIds.has(bookId),

    // Trạng thái ưu tiên: BORROWING > RESERVED > null
    statusOf: (state) => (bookId) => {
      if (state.borrowingBookIds.has(bookId)) return "BORROWING";
      if (state.reservedBookIds.has(bookId))  return "RESERVED";
      return null;
    },

    getReservationId: (state) => (bookId) => state.reservationIdByBookId[bookId] ?? null,
  },

  actions: {
    // Gọi 1 lần khi sinh viên vào trang sách
    async fetchMyStatuses() {
      this.loading = true;
      try {
        const [borrowRes, reserveRes] = await Promise.all([
          getMyBorrows(),
          getMyReservationStatuses(),
        ]);

        // ── Sách đang mượn ──────────────────────────────────
        const borrowing = new Set();
        for (const record of borrowRes.data.result.content ?? []) {
          for (const item of record.items ?? []) {
            if (item.status === "BORROWING") {
              borrowing.add(item.bookId);
            }
          }
        }
        this.borrowingBookIds = borrowing;

        // ── Sách đã đặt trước ───────────────────────────────
        const reserved   = new Set();
        const resIdMap   = {};
        for (const r of reserveRes.data.result.content ?? []) {
          if (r.status === "PENDING" || r.status === "CONFIRMED") {
            reserved.add(r.bookId);
            resIdMap[r.bookId] = r.id;
          }
        }
        this.reservedBookIds        = reserved;
        this.reservationIdByBookId  = resIdMap;
      } catch {
        // Không toast — sinh viên chưa đăng nhập hoặc chưa có data đều OK
      } finally {
        this.loading = false;
      }
    },

    // Cập nhật local sau khi đặt trước thành công (không cần fetch lại)
    markReserved(bookId, reservationId) {
      this.reservedBookIds = new Set([...this.reservedBookIds, bookId]);
      this.reservationIdByBookId[bookId] = reservationId;
    },

    // Cập nhật local sau khi huỷ đặt trước
    markCancelled(bookId) {
      this.reservedBookIds.delete(bookId);
      delete this.reservationIdByBookId[bookId];
      // Trigger reactivity vì Set mutation không tự reactive
      this.reservedBookIds = new Set(this.reservedBookIds);
    },
  },
});