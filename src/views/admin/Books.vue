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
        <!-- Search keyword -->
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
        <div class="relative" ref="categoryDropdownRef">
          <button
            type="button"
            class="h-9 min-w-[160px] rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none flex items-center justify-between gap-2 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 cursor-pointer"
            @click="toggleCategoryDropdown"
          >
            <span :class="bookStore.category ? 'text-slate-700' : 'text-slate-400'">
              {{ selectedCategoryLabel }}
            </span>
            <svg class="h-3.5 w-3.5 text-slate-400 flex-shrink-0 transition-transform" :class="showCategoryDropdown ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          <div v-if="showCategoryDropdown" class="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden">
            <div class="p-2 border-b border-slate-100">
              <div class="relative">
                <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none"
                     fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  v-model="categorySearch"
                  ref="categorySearchInput"
                  placeholder="Tìm thể loại..."
                  class="w-full h-8 rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400"
                />
              </div>
            </div>
            <ul class="max-h-52 overflow-y-auto py-1">
              <li>
                <button
                  type="button"
                  class="w-full text-left px-3 py-2 text-sm transition hover:bg-slate-50"
                  :class="bookStore.category === '' ? 'text-indigo-600 font-semibold' : 'text-slate-600'"
                  @click="selectCategory('')"
                >
                  Tất cả thể loại
                </button>
              </li>
              <li v-for="c in filteredCategories" :key="c.id">
                <button
                  type="button"
                  class="w-full text-left px-3 py-2 text-sm transition hover:bg-slate-50"
                  :class="bookStore.category === c.name ? 'text-indigo-600 font-semibold' : 'text-slate-600'"
                  @click="selectCategory(c.name)"
                >
                  {{ c.name }}
                </button>
              </li>
              <li v-if="filteredCategories.length === 0" class="px-3 py-3 text-xs text-slate-400 text-center">
                Không tìm thấy thể loại
              </li>
            </ul>
          </div>
        </div>

        <!-- Sort button -->
        <button
          type="button"
          class="h-9 flex items-center gap-1.5 px-3 text-sm font-medium text-slate-500 border border-slate-200 rounded-lg bg-white hover:border-indigo-300 hover:text-indigo-500 transition"
          @click="bookStore.toggleSort()"
        >
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M8 6l4-4 4 4M16 18l-4 4-4-4M12 2v20"/>
          </svg>
          {{ bookStore.sortDir === 'asc' ? 'A → Z' : 'Z → A' }}
        </button>

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
      :loading="bookStore.loading"
      :page="bookStore.page"
      :total-pages="bookStore.totalPages"
      :can-delete="authStore.canDelete"
      @view="viewDetail"
      @edit="openEdit"
      @remove="remove"
      @page-change="bookStore.setPage"
      @sort-change="bookStore.setSort"
    />

    <!-- Modal Add / Edit -->
    <BookFormModal
      v-if="showModal"
      :key="isEdit ? currentId : 'create'"
      :is-edit="isEdit"
      :initial-form="form"
      :existing-image-url="existingImageUrl"
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
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import { useBookStore } from "@/stores/bookStore";
import { useAuthorStore } from "@/stores/authorStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { useAuthStore } from "@/stores/authStore";
import BookTable from "@/components/admin/book/BookTable.vue";
import BookFormModal from "@/components/admin/book/BookFormModal.vue";
import BookDetailModal from "@/components/admin/book/BookDetailModal.vue";

const bookStore = useBookStore();
const authorStore = useAuthorStore();
const categoryStore = useCategoryStore();
const authStore = useAuthStore();

const showModal = ref(false);
const isEdit = ref(false);
const currentId = ref(null);
const existingImageUrl = ref(null);
const showDetailModal = ref(false);

// ── Category searchable dropdown ──────────────────────────────
const showCategoryDropdown = ref(false);
const categorySearch = ref("");
const categoryDropdownRef = ref(null);
const categorySearchInput = ref(null);

const selectedCategoryLabel = computed(() =>
  bookStore.category
    ? (categoryStore.categories || []).find((c) => c.name === bookStore.category)?.name ?? bookStore.category
    : "Tất cả thể loại"
);

const filteredCategories = computed(() => categoryStore.categories);

const toggleCategoryDropdown = async () => {
  showCategoryDropdown.value = !showCategoryDropdown.value;
  if (showCategoryDropdown.value) {
    categorySearch.value = "";
    await nextTick();
    categorySearchInput.value?.focus();
  }
};

const selectCategory = (name) => {
  bookStore.category = name;
  bookStore.page = 0;
  bookStore.fetchBooks();
  showCategoryDropdown.value = false;
  categorySearch.value = "";
};

const onClickOutside = (e) => {
  if (categoryDropdownRef.value && !categoryDropdownRef.value.contains(e.target)) {
    showCategoryDropdown.value = false;
  }
};

// ── Lifecycle ─────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([
    authorStore.fetchAuthors(),
    categoryStore.fetchCategories(),
    bookStore.fetchBooks(),
  ]);
  document.addEventListener("click", onClickOutside);
});

onBeforeUnmount(() => document.removeEventListener("click", onClickOutside));

watch(categorySearch, async (val) => {
  await categoryStore.search(val);
});

// ── Form ──────────────────────────────────────────────────────
const defaultForm = () => ({
  title: "",
  publisher: "",
  publishYear: null,
  isbn: "",
  quantity: 0,
  availableQuantity: 0,
  price: null,           // thêm mới
  description: "",
  authors: [],
  categoryIds: [],
});

const form = ref(defaultForm());

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
    title:             detail.title,
    publisher:         detail.publisher,
    publishYear:       detail.publishYear,
    isbn:              detail.isbn,
    quantity:          detail.quantity,
    availableQuantity: detail.availableQuantity,
    price:             detail.price ?? null,    // thêm mới
    description:       detail.description,
    authors:           detail.authors?.map((a) => ({ authorId: a.id, role: a.role })) || [],
    categoryIds:       detail.categories?.map((c) => c.id) || [],
    version:           detail.version,
  };

  showModal.value = true;
};

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