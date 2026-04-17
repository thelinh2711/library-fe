// src/stores/bookStore.js
import { defineStore } from "pinia";
import { getBooks, getBookDetail, createBook, updateBook, deleteBook } from "@/services/bookService";
import { useToast } from "vue-toastification";

export const useBookStore = defineStore("book", {
  state: () => ({
    books: [],
    bookDetail: null,
    loading: false,
    page: 0,
    size: 10,
    totalPages: 0,
    keyword: "",
    category: "",
    sort: "ASC",
  }),

  getters: {
    sortDir: (state) => state.sort === "ASC" ? "asc" : "desc",
  },

  actions: {
    async fetchBooks() {
      this.loading = true;
      const toast = useToast();
      try {
        const params = { page: this.page, size: this.size, sort: this.sort };
        if (this.keyword)  params.keyword  = this.keyword;
        if (this.category) params.category = this.category;

        const res = await getBooks(params);
        this.books      = res.data.result.content;
        this.totalPages = res.data.result.totalPages;
      } catch (err) {
        toast.error("Không tải được danh sách sách");
      } finally {
        this.loading = false;
      }
    },

    async fetchBookDetail(id) {
      const toast = useToast();
      try {
        const res = await getBookDetail(id);
        this.bookDetail = res.data.result;
      } catch (err) {
        toast.error("Không tải được chi tiết sách");
      }
    },

    async addBook(data) {
      const toast = useToast();
      try {
        await createBook(data);
        toast.success("Thêm sách thành công 🎉");
        await this.fetchBooks();
      } catch (err) {
        toast.error(err.response?.data?.message || "Lỗi khi thêm sách");
      }
    },

    async editBook(id, data) {
      const toast = useToast();
      try {
        await updateBook(id, data);
        toast.success("Cập nhật sách thành công ✨");
        await this.fetchBooks();
      } catch (err) {
        // ✅ Bắt lỗi 409 Conflict do Optimistic Locking
        if (err.response?.status === 409) {
          toast.error("Sách vừa được admin khác chỉnh sửa. Vui lòng tải lại trang và thử lại.");
        } else {
          toast.error(err.response?.data?.message || "Lỗi khi cập nhật sách");
        }
      }
    },

    async removeBook(id) {
      const toast = useToast();
      try {
        await deleteBook(id);
        this.books = this.books.filter((b) => b.id !== id);
        toast.success("Xoá sách thành công 🗑️");
      } catch (err) {
        toast.error(err.response?.data?.message || "Lỗi khi xoá sách");
      }
    },

    setPage(page) {
      this.page = page;
      this.fetchBooks();
    },

    setSort(dir) {
      this.sort = dir;
      this.page = 0;
      this.fetchBooks();
    },

    toggleSort() {
      this.sort = this.sort === "ASC" ? "DESC" : "ASC";
      this.page = 0;
      this.fetchBooks();
    },
  },
});