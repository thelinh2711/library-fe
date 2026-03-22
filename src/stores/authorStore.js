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
  }),

  actions: {
    async fetchAuthors() {
      this.loading = true;
      const toast = useToast();

      try {
        const res = await getAuthors();
        this.authors = res.data.result; // đúng format BE bạn
      } catch (err) {
        toast.error("Không tải được danh sách tác giả");
      } finally {
        this.loading = false;
      }
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

        // 👇 tối ưu giống category (không cần call lại API)
        this.authors = this.authors.filter((a) => a.id !== id);

        toast.success("Xoá tác giả thành công 🗑️");
      } catch (err) {
        const res = err.response?.data;

        // 👇 nếu sau này BE có rule giống category
        if (res?.code === 1014) {
          toast.error(res.message);
        } else {
          toast.error(res?.message || "Lỗi khi xoá tác giả");
        }
      }
    },
  },
});