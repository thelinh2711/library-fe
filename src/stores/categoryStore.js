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
  }),

  actions: {
    async fetchCategories() {
      this.loading = true;
      try {
        const res = await getCategories();
        this.categories = res.data.result;
      } catch (err) {
        const toast = useToast();
        toast.error("Không tải được danh sách thể loại");
      } finally {
        this.loading = false;
      }
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

    async removeCategory(id) {
      const toast = useToast();
      try {
        await deleteCategory(id);

        this.categories = this.categories.filter((c) => c.id !== id);

        toast.success("Xoá thành công 🗑️");
      } catch (err) {
        const res = err.response?.data;

        // 🔥 handle đúng BE của bạn
        if (res?.code === 1014) {
          toast.error(res.message); // "Không thể xóa category..."
        } else {
          toast.error(res?.message || "Lỗi khi xoá");
        }
      }
    },
  },
});