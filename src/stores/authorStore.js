import { defineStore } from "pinia";
import {
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "@/services/authorService";
import { useToast } from "vue-toastification";

export const useAuthorStore = defineStore("author", {
  state: () => ({
    authors: [],
    loading: false,
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
    last: false,
    keyword: "",
    sortDir: "asc",
  }),

  actions: {
    async fetchAuthors() {
      this.loading = true;
      try {
        const res = await getAuthors({
          name: this.keyword,
          page: this.page,
          size: this.size,
          sort: this.sortDir === "asc" ? "ASC" : "DESC",
        });
        const data = res.data.result;
        this.authors       = data.content;
        this.page          = data.number ?? data.page ?? 0;
        this.totalPages    = data.totalPages;
        this.totalElements = data.totalElements;
        this.last          = data.last;
      } catch (err) {
        const toast = useToast();
        toast.error("Không tải được danh sách tác giả");
      } finally {
        this.loading = false;
      }
    },

    async search(keyword) {
      this.keyword = keyword;
      this.page = 0;
      await this.fetchAuthors();
    },

    async goToPage(page) {
      this.page = page;
      await this.fetchAuthors();
    },

    async setPage(page) {
      this.page = page;
      await this.fetchAuthors();
    },

    async toggleSort() {
      this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
      this.page = 0;
      await this.fetchAuthors();
    },

    async addAuthor(data) {
      const toast = useToast();
      try {
        await createAuthor(data);
        toast.success("Thêm tác giả thành công 🎉");
        await this.fetchAuthors();
      } catch (err) {
        const message = err.response?.data?.message;
        toast.error(message || "Lỗi khi thêm tác giả");
      }
    },

    async editAuthor(id, data) {
      const toast = useToast();
      try {
        await updateAuthor(id, data);
        toast.success("Cập nhật tác giả thành công ✨");
        await this.fetchAuthors();
      } catch (err) {
        const message = err.response?.data?.message;
        toast.error(message || "Lỗi khi cập nhật");
      }
    },

    async removeAuthor(id) {
      const toast = useToast();
      try {
        await deleteAuthor(id);
        this.authors = this.authors.filter((a) => a.id !== id);
        toast.success("Xoá tác giả thành công 🗑️");
      } catch (err) {
        const res = err.response?.data;
        if (res?.code === 1014) {
          toast.error(res.message);
        } else {
          toast.error(res?.message || "Lỗi khi xoá tác giả");
        }
      }
    },
  },
});