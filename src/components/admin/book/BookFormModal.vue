<!-- src/components/book/BookFormModal.vue -->
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">

      <!-- Header -->
      <div class="bg-gradient-to-br from-slate-800 to-slate-700 px-6 py-5 flex items-center justify-between gap-3">
        <div>
          <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">
            {{ isEdit ? 'Cập nhật thông tin' : 'Thêm sách mới' }}
          </p>
          <h2 class="text-white text-lg font-bold leading-snug">
            {{ isEdit ? form.title || 'Chỉnh sửa sách' : 'Thêm sách' }}
          </h2>
        </div>
        <button @click="$emit('close')" class="flex-shrink-0 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-colors">
          <XIcon />
        </button>
      </div>

      <!-- Body -->
      <div class="overflow-y-auto max-h-[70vh] px-6 py-5 space-y-5">

        <!-- Ảnh bìa -->
        <div>
          <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Ảnh bìa</p>
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-24 h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
              <img v-if="imagePreview" :src="imagePreview" alt="preview" class="w-full h-full object-cover" />
              <div v-else class="flex flex-col items-center gap-1 text-slate-300">
                <BookOpen class="w-8 h-8" />
                <span class="text-xs">Chưa có ảnh</span>
              </div>
            </div>
            <div class="flex-1 space-y-2">
              <label class="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 hover:border-slate-400 rounded-xl px-4 py-3 transition-all">
                <Upload class="w-4 h-4 text-slate-400" />
                <span class="text-sm text-slate-500">{{ imageFile ? imageFile.name : 'Chọn ảnh từ máy tính' }}</span>
                <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
              </label>
              <p class="text-xs text-slate-400">Hỗ trợ JPG, PNG, WEBP. Tối đa 5MB.</p>
              <button v-if="imageFile || imagePreview" type="button" @click="clearImage" class="text-xs text-red-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                <XIcon class="w-3 h-3" /> Xoá ảnh
              </button>
            </div>
          </div>
        </div>

        <!-- Thông tin cơ bản -->
        <div>
          <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Thông tin cơ bản</p>
          <div class="space-y-2">
            <input v-model="form.title" placeholder="Tiêu đề sách" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition" />
            <div class="grid grid-cols-2 gap-2">
              <input v-model="form.publisher" placeholder="Nhà xuất bản" class="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition" />
              <input v-model.number="form.publishYear" type="number" placeholder="Năm xuất bản" class="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition" />
            </div>
            <input v-model="form.isbn" placeholder="ISBN" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 font-mono focus:outline-none focus:ring-2 focus:ring-slate-300 transition" />
          </div>
        </div>

        <!-- Số lượng & Giá -->
        <div>
          <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Số lượng & Giá</p>
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-slate-50 rounded-xl p-3">
              <p class="text-slate-400 text-xs font-medium mb-1.5">Tổng số lượng</p>
              <input v-model.number="form.quantity" type="number" min="0" placeholder="0" class="w-full bg-transparent text-slate-800 text-sm font-semibold focus:outline-none" />
            </div>
            <div class="bg-emerald-50 rounded-xl p-3">
              <p class="text-emerald-600 text-xs font-medium mb-1.5">Số lượng sẵn có</p>
              <input v-model.number="form.availableQuantity" type="number" min="0" placeholder="0" class="w-full bg-transparent text-emerald-700 text-sm font-semibold focus:outline-none" />
            </div>
          </div>
          <!-- Giá bìa — full width, tách riêng để nổi bật -->
          <div class="mt-2 bg-amber-50 rounded-xl p-3">
            <p class="text-amber-600 text-xs font-medium mb-1.5">Giá bìa (VNĐ)</p>
            <div class="flex items-center gap-2">
              <input
                v-model.number="form.price"
                type="number"
                min="0"
                step="1000"
                placeholder="0"
                class="w-full bg-transparent text-amber-700 text-sm font-semibold focus:outline-none"
              />
              <span class="text-amber-400 text-xs font-medium flex-shrink-0">
                {{ form.price ? formatPrice(form.price) : '' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Mô tả -->
        <div>
          <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Mô tả</p>
          <textarea v-model="form.description" placeholder="Nhập mô tả sách..." rows="3" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition resize-none"></textarea>
        </div>

        <!-- Tác giả -->
        <div>
          <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Tác giả</p>

          <div v-if="form.authors.length" class="flex flex-wrap gap-2 mb-2">
            <div
              v-for="(a, index) in form.authors"
              :key="index"
              class="flex items-center gap-1 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium pl-3 pr-1.5 py-1.5 rounded-full"
            >
              <span class="leading-none">{{ authorName(a.authorId) }}</span>
              <span class="text-blue-200 mx-0.5">·</span>
              <select
                v-model="form.authors[index].role"
                class="bg-transparent text-blue-600 text-xs focus:outline-none cursor-pointer leading-none"
                @click.stop
              >
                <option value="MAIN_AUTHOR">Chính</option>
                <option value="CO_AUTHOR">Đồng</option>
              </select>
              <button
                type="button"
                @click="removeAuthor(index)"
                class="flex items-center justify-center w-4 h-4 ml-1 rounded-full bg-blue-100 hover:bg-red-100 text-blue-400 hover:text-red-500 transition-colors flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="relative" :ref="el => authorDropdownRef = el">
            <button
              type="button"
              class="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-xs font-medium transition-colors border border-dashed border-slate-300 hover:border-slate-400 rounded-lg px-3 py-1.5"
              @click="toggleAuthorDropdown"
            >
              <PlusIcon class="w-3.5 h-3.5" /> Thêm tác giả
            </button>

            <div v-if="showAuthorDropdown" class="absolute left-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden">
              <div class="p-2 border-b border-slate-100">
                <div class="relative">
                  <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                  </svg>
                  <input
                    v-model="authorSearch"
                    ref="authorSearchInput"
                    placeholder="Tìm tác giả..."
                    class="w-full h-8 rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400"
                    @input="onAuthorSearchInput"
                  />
                </div>
              </div>
              <ul class="max-h-44 overflow-y-auto py-1">
                <li v-for="author in authorResults" :key="author.id">
                  <button
                    type="button"
                    class="w-full text-left px-3 py-2 text-sm transition hover:bg-slate-50 flex items-center justify-between"
                    :class="isAuthorSelected(author.id) ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600'"
                    :disabled="isAuthorSelected(author.id)"
                    @click="addAuthor(author)"
                  >
                    {{ author.name }}
                    <span v-if="isAuthorSelected(author.id)" class="text-xs text-slate-300">Đã chọn</span>
                  </button>
                </li>
                <li v-if="authorResults.length === 0" class="px-3 py-3 text-xs text-slate-400 text-center">
                  Không tìm thấy tác giả
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Thể loại -->
        <div>
          <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Thể loại</p>

          <div v-if="form.categoryIds.length" class="flex flex-wrap gap-2 mb-2">
            <div
              v-for="(catId, index) in form.categoryIds"
              :key="index"
              class="flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-medium pl-3 pr-1.5 py-1.5 rounded-full"
            >
              <span class="leading-none">{{ categoryName(catId) }}</span>
              <button
                type="button"
                @click="removeCategory(index)"
                class="flex items-center justify-center w-4 h-4 ml-1 rounded-full bg-amber-100 hover:bg-red-100 text-amber-400 hover:text-red-500 transition-colors flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="relative" :ref="el => categoryDropdownRef = el">
            <button
              type="button"
              class="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-xs font-medium transition-colors border border-dashed border-slate-300 hover:border-slate-400 rounded-lg px-3 py-1.5"
              @click="toggleCategoryDropdown"
            >
              <PlusIcon class="w-3.5 h-3.5" /> Thêm thể loại
            </button>

            <div v-if="showCategoryDropdown" class="absolute left-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden">
              <div class="p-2 border-b border-slate-100">
                <div class="relative">
                  <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                  </svg>
                  <input
                    v-model="categorySearch"
                    ref="categorySearchInput"
                    placeholder="Tìm thể loại..."
                    class="w-full h-8 rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400"
                    @input="onCategorySearchInput"
                  />
                </div>
              </div>
              <ul class="max-h-44 overflow-y-auto py-1">
                <li v-for="cat in categoryResults" :key="cat.id">
                  <button
                    type="button"
                    class="w-full text-left px-3 py-2 text-sm transition hover:bg-slate-50 flex items-center justify-between"
                    :class="isCategorySelected(cat.id) ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600'"
                    :disabled="isCategorySelected(cat.id)"
                    @click="addCategory(cat)"
                  >
                    {{ cat.name }}
                    <span v-if="isCategorySelected(cat.id)" class="text-xs text-slate-300">Đã chọn</span>
                  </button>
                </li>
                <li v-if="categoryResults.length === 0" class="px-3 py-3 text-xs text-slate-400 text-center">
                  Không tìm thấy thể loại
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
        <button @click="$emit('close')" class="text-slate-500 hover:text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-150">
          Huỷ
        </button>
        <button @click="handleSave" class="bg-slate-800 hover:bg-slate-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-150">
          {{ isEdit ? 'Cập nhật' : 'Thêm sách' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from "vue";
import { BookOpen, Upload } from "lucide-vue-next";
import { getAuthors } from "@/services/authorService";
import { getCategories } from "@/services/categoryService";

const XIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`,
};
const PlusIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>`,
};

const props = defineProps({
  isEdit:           { type: Boolean, default: false },
  initialForm:      { type: Object,  required: true },
  existingImageUrl: { type: String,  default: null  },
});

const emit = defineEmits(["close", "save"]);

const form = ref(JSON.parse(JSON.stringify(props.initialForm)));
const imageFile = ref(null);
const imagePreview = ref(props.existingImageUrl || null);
const fileInput = ref(null);

const formatPrice = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

// ── Author dropdown ───────────────────────────────────────────
const showAuthorDropdown = ref(false);
const authorSearch = ref("");
const authorDropdownRef = ref(null);
const authorSearchInput = ref(null);
const authorResults = ref([]);
const selectedAuthorsCache = ref([]);

const fetchAuthors = async (keyword = "") => {
  try {
    const res = await getAuthors({ name: keyword, page: 0, size: 10, sort: "ASC" });
    authorResults.value = res.data.result.content;
  } catch { authorResults.value = []; }
};

let authorDebounce = null;
const onAuthorSearchInput = () => {
  clearTimeout(authorDebounce);
  authorDebounce = setTimeout(() => fetchAuthors(authorSearch.value.trim()), 300);
};

const isAuthorSelected = (id) => form.value.authors.some((a) => a.authorId === id);
const authorName = (id) => selectedAuthorsCache.value.find((a) => a.id === id)?.name ?? id;

const toggleAuthorDropdown = async () => {
  showAuthorDropdown.value = !showAuthorDropdown.value;
  if (showAuthorDropdown.value) {
    authorSearch.value = "";
    await fetchAuthors();
    await nextTick();
    authorSearchInput.value?.focus();
  }
};

const addAuthor = (author) => {
  if (isAuthorSelected(author.id)) return;
  form.value.authors.push({ authorId: author.id, role: "MAIN_AUTHOR" });
  if (!selectedAuthorsCache.value.find((a) => a.id === author.id)) {
    selectedAuthorsCache.value.push({ id: author.id, name: author.name });
  }
  showAuthorDropdown.value = false;
  authorSearch.value = "";
};

const removeAuthor = (i) => form.value.authors.splice(i, 1);

// ── Category dropdown ─────────────────────────────────────────
const showCategoryDropdown = ref(false);
const categorySearch = ref("");
const categoryDropdownRef = ref(null);
const categorySearchInput = ref(null);
const categoryResults = ref([]);
const selectedCategoriesCache = ref([]);

const fetchCategories = async (keyword = "") => {
  try {
    const res = await getCategories({ name: keyword, page: 0, size: 10, sort: "ASC" });
    categoryResults.value = res.data.result.content;
  } catch { categoryResults.value = []; }
};

let categoryDebounce = null;
const onCategorySearchInput = () => {
  clearTimeout(categoryDebounce);
  categoryDebounce = setTimeout(() => fetchCategories(categorySearch.value.trim()), 300);
};

const isCategorySelected = (id) => form.value.categoryIds.includes(id);
const categoryName = (id) => selectedCategoriesCache.value.find((c) => c.id === id)?.name ?? id;

const toggleCategoryDropdown = async () => {
  showCategoryDropdown.value = !showCategoryDropdown.value;
  if (showCategoryDropdown.value) {
    categorySearch.value = "";
    await fetchCategories();
    await nextTick();
    categorySearchInput.value?.focus();
  }
};

const addCategory = (cat) => {
  if (isCategorySelected(cat.id)) return;
  form.value.categoryIds.push(cat.id);
  if (!selectedCategoriesCache.value.find((c) => c.id === cat.id)) {
    selectedCategoriesCache.value.push({ id: cat.id, name: cat.name });
  }
  showCategoryDropdown.value = false;
  categorySearch.value = "";
};

const removeCategory = (i) => form.value.categoryIds.splice(i, 1);

// ── Init cache cho edit ───────────────────────────────────────
const initCache = async () => {
  if (!props.isEdit) return;
  if (form.value.authors.length) {
    const res = await getAuthors({ page: 0, size: 50, sort: "ASC" });
    const all = res.data.result.content;
    form.value.authors.forEach(({ authorId }) => {
      const found = all.find((a) => a.id === authorId);
      if (found && !selectedAuthorsCache.value.find((a) => a.id === authorId)) {
        selectedAuthorsCache.value.push({ id: found.id, name: found.name });
      }
    });
  }
  if (form.value.categoryIds.length) {
    const res = await getCategories({ page: 0, size: 50, sort: "ASC" });
    const all = res.data.result.content;
    form.value.categoryIds.forEach((catId) => {
      const found = all.find((c) => c.id === catId);
      if (found && !selectedCategoriesCache.value.find((c) => c.id === catId)) {
        selectedCategoriesCache.value.push({ id: found.id, name: found.name });
      }
    });
  }
};

const onClickOutside = (e) => {
  if (authorDropdownRef.value && !authorDropdownRef.value.contains(e.target)) {
    showAuthorDropdown.value = false;
  }
  if (categoryDropdownRef.value && !categoryDropdownRef.value.contains(e.target)) {
    showCategoryDropdown.value = false;
  }
};

onMounted(async () => {
  document.addEventListener("mousedown", onClickOutside);
  await initCache();
});
onBeforeUnmount(() => document.removeEventListener("mousedown", onClickOutside));

// ── Image ─────────────────────────────────────────────────────
const onFileChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    alert("Ảnh vượt quá 5MB, vui lòng chọn ảnh nhỏ hơn.");
    return;
  }
  imageFile.value = file;
  imagePreview.value = URL.createObjectURL(file);
};

const clearImage = () => {
  imageFile.value = null;
  imagePreview.value = null;
  if (fileInput.value) fileInput.value.value = "";
};

// ── Save ──────────────────────────────────────────────────────
const handleSave = () => {
  const payload = new FormData();

  payload.append("title",             form.value.title ?? "");
  payload.append("publisher",         form.value.publisher ?? "");
  if (form.value.publishYear != null) payload.append("publishYear", form.value.publishYear);
  payload.append("isbn",              form.value.isbn ?? "");
  payload.append("quantity",          form.value.quantity ?? 0);
  payload.append("availableQuantity", form.value.availableQuantity ?? form.value.quantity ?? 0);
  payload.append("price",             form.value.price ?? 0);
  payload.append("description",       form.value.description ?? "");

  // ✅ Thêm version khi edit để BE kiểm tra Optimistic Lock
  if (props.isEdit && form.value.version != null) {
    payload.append("version", form.value.version);
  }

  if (imageFile.value) payload.append("image", imageFile.value);

  const filteredAuthors = form.value.authors.filter((a) => a.authorId);
  filteredAuthors.forEach((a, i) => {
    payload.append(`authors[${i}].authorId`, a.authorId);
    payload.append(`authors[${i}].role`, a.role);
  });

  const filteredCats = form.value.categoryIds.filter((c) => c);
  filteredCats.forEach((id, i) => {
    payload.append(`categoryIds[${i}]`, id);
  });

  emit("save", payload);
};
</script>