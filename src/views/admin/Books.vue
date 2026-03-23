<!-- src/views/admin/Books.vue -->
<template>
  <div>
    <!-- Header + Search -->
    <div class="flex justify-between mb-4 items-center">
      <h1 class="text-2xl font-bold">Quản lý sách</h1>

      <div class="flex gap-2 items-center">
        <input
          v-model="bookStore.keyword"
          placeholder="Tìm kiếm..."
          class="border px-3 py-2 rounded"
          @keyup.enter="bookStore.fetchBooks"
        />

        <select
          v-model="bookStore.category"
          @change="bookStore.fetchBooks"
          class="border px-3 py-2 rounded"
        >
          <option value="">-- Chọn thể loại --</option>
          <option v-for="c in categoryStore.categories" :key="c.id" :value="c.name">
            {{ c.name }}
          </option>
        </select>

        <button @click="openCreate" class="bg-blue-500 text-white px-4 py-2 rounded">
          + Thêm
        </button>
      </div>
    </div>

    <!-- Table -->
    <BookTable
      :books="bookStore.books"
      :page="bookStore.page"
      :total-pages="bookStore.totalPages"
      @view="viewDetail"
      @edit="openEdit"
      @remove="remove"
      @page-change="bookStore.setPage"
    />

    <!-- Modal Add / Edit -->
    <BookFormModal
      v-if="showModal"
      :is-edit="isEdit"
      :initial-form="form"
      :existing-image-url="existingImageUrl"
      :authors="authorStore.authors"
      :categories="categoryStore.categories"
      @close="showModal = false"
      @save="handleSave"
    />

    <!-- Modal Detail -->
    <BookDetailModal
      v-if="showDetailModal"
      :book="bookStore.bookDetail"
      @close="showDetailModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useBookStore } from "@/stores/bookStore";
import { useAuthorStore } from "@/stores/authorStore";
import { useCategoryStore } from "@/stores/categoryStore";
import BookTable from "@/components/book/BookTable.vue";
import BookFormModal from "@/components/book/BookFormModal.vue";
import BookDetailModal from "@/components/book/BookDetailModal.vue";

const bookStore = useBookStore();
const authorStore = useAuthorStore();
const categoryStore = useCategoryStore();

const showModal = ref(false);
const isEdit = ref(false);
const currentId = ref(null);
const existingImageUrl = ref(null);
const showDetailModal = ref(false);

const defaultForm = () => ({
  title: "",
  publisher: "",
  publishYear: null,
  isbn: "",
  quantity: 0,
  availableQuantity: 0,
  description: "",
  authors: [],
  categoryIds: [],
});

const form = ref(defaultForm());

onMounted(async () => {
  await authorStore.fetchAuthors();
  await categoryStore.fetchCategories();
  await bookStore.fetchBooks();
});

const openCreate = () => {
  isEdit.value = false;
  currentId.value = null;
  existingImageUrl.value = null;
  form.value = defaultForm();
  showModal.value = true;
};

const openEdit = async (book) => {
  isEdit.value = true;
  currentId.value = book.id;

  await bookStore.fetchBookDetail(book.id);
  const detail = bookStore.bookDetail;

  existingImageUrl.value = detail.imageUrl || null;

  form.value = {
    title: detail.title,
    publisher: detail.publisher,
    publishYear: detail.publishYear,
    isbn: detail.isbn,
    quantity: detail.quantity,
    availableQuantity: detail.availableQuantity,
    description: detail.description,
    authors: detail.authors?.map((a) => ({ authorId: a.id, role: a.role })) || [],
    categoryIds: detail.categories?.map((c) => c.id) || [],
  };

  showModal.value = true;
};

// payload is already a FormData built inside BookFormModal
const handleSave = async (formData) => {
  if (isEdit.value) {
    await bookStore.editBook(currentId.value, formData);
  } else {
    await bookStore.addBook(formData);
  }
  showModal.value = false;
};

const remove = async (id) => {
  if (confirm("Bạn có chắc muốn xoá sách này?")) {
    await bookStore.removeBook(id);
  }
};

const viewDetail = async (id) => {
  await bookStore.fetchBookDetail(id);
  showDetailModal.value = true;
};
</script>