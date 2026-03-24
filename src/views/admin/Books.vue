<!-- src/views/admin/Books.vue -->
<template>
  <div>
    <!-- Header + Search -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold text-slate-800 tracking-tight">Quản lý sách</h1>
        <p class="text-xs text-slate-400 mt-0.5">Danh sách toàn bộ sách trong hệ thống</p>
      </div>
 
      <div class="flex items-center gap-2">
        <!-- Search -->
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none"
               fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            v-model="bookStore.keyword"
            placeholder="Tìm kiếm..."
            class="h-9 w-52 rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            @keyup.enter="bookStore.fetchBooks"
          />
        </div>
 
        <!-- Category filter -->
        <select
          v-model="bookStore.category"
          @change="bookStore.fetchBooks"
          class="h-9 rounded-lg border border-slate-200 bg-white px-3 pr-8 text-sm text-slate-600 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 cursor-pointer"
        >
          <option value="">Tất cả thể loại</option>
          <option v-for="c in categoryStore.categories" :key="c.id" :value="c.name">
            {{ c.name }}
          </option>
        </select>
 
        <!-- Add button -->
        <button
          @click="openCreate"
          class="inline-flex h-9 items-center gap-1.5 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 active:scale-95"
        >
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Thêm sách
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