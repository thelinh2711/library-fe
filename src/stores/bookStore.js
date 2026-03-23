// src/stores/bookStore.js
import { defineStore } from "pinia";
import { getBooks, getBookDetail, createBook, updateBook, deleteBook } from "@/services/bookService";
import { useToast } from "vue-toastification";

export const useBookStore = defineStore("book", {
  state: () => ({
    books: [],          // BookResponse[]
    bookDetail: null,   // BookDetailResponse
    loading: false,
    page: 0,
    size: 10,
    totalPages: 0,
    keyword: "",
    category: "",
  }),

  actions: {
    async fetchBooks() {
        this.loading = true;
        const toast = useToast();
        try {
            const params = { page: this.page, size: this.size };
            if (this.keyword) params.keyword = this.keyword;
            if (this.category) params.category = this.category;

            const res = await getBooks(params);
            this.books = res.data.result.content;
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
        toast.error(err.response?.data?.message || "Lỗi khi cập nhật sách");
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

    setKeyword(keyword) {
      this.keyword = keyword;
      this.page = 0;
      this.fetchBooks();
    },

    setCategory(category) {
      this.category = category;
      this.page = 0;
      this.fetchBooks();
    },

    setPage(page) {
      this.page = page;
      this.fetchBooks();
    },
  },
});