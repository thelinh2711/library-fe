import { defineStore } from "pinia";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/categoryService";
import { useToast } from "vue-toastification";

export const useCategoryStore = defineStore("category", {
  state: () => ({
    categories: [],
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
    async fetchCategories() {
      this.loading = true;
      try {
        const res = await getCategories({
          name: this.keyword,
          page: this.page,
          size: this.size,
          sort: this.sortDir === "asc" ? "ASC" : "DESC",
        });
        const data = res.data.result;
        this.categories    = data.content;
        this.page          = data.page;
        this.totalPages    = data.totalPages;
        this.totalElements = data.totalElements;
        this.last          = data.last;
      } catch (err) {
        const toast = useToast();
        toast.error("Không tải được danh sách thể loại");
      } finally {
        this.loading = false;
      }
    },

    async search(keyword) {
      this.keyword = keyword;
      this.page = 0;
      await this.fetchCategories();
    },

    async goToPage(page) {
      this.page = page;
      await this.fetchCategories();
    },

    async toggleSort() {
      this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
      this.page = 0;
      await this.fetchCategories();
    },

    async addCategory(data) {
      const toast = useToast();
      try {
        await createCategory(data);
        toast.success("Thêm thể loại thành công 🎉");
        await this.fetchCategories();
      } catch (err) {
        const message = err.response?.data?.message;
        toast.error(message || "Lỗi khi thêm thể loại");
      }
    },

    async editCategory(id, data) {
      const toast = useToast();
      try {
        await updateCategory(id, data);
        toast.success("Cập nhật thành công ✨");
        await this.fetchCategories();
      } catch (err) {
        const message = err.response?.data?.message;
        toast.error(message || "Lỗi khi cập nhật");
      }
    },

    async setPage(page) {
      this.page = page;
      await this.fetchCategories();
    },

    async removeCategory(id) {
      const toast = useToast();
      try {
        await deleteCategory(id);
        this.categories = this.categories.filter((c) => c.id !== id);
        toast.success("Xoá thành công 🗑️");
      } catch (err) {
        const res = err.response?.data;
        if (res?.code === 1014) {
          toast.error(res.message);
        } else {
          toast.error(res?.message || "Lỗi khi xoá");
        }
      }
    },
  },
});