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
        <button
          @click="$emit('close')"
          class="flex-shrink-0 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-colors"
        >
          <XIcon />
        </button>
      </div>

      <!-- Body -->
      <div class="overflow-y-auto max-h-[70vh] px-6 py-5 space-y-5">

        <!-- Ảnh bìa -->
        <div>
          <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Ảnh bìa</p>
          <div class="flex items-start gap-4">
            <!-- Preview -->
            <div class="flex-shrink-0 w-24 h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
              <img
                v-if="imagePreview"
                :src="imagePreview"
                alt="preview"
                class="w-full h-full object-cover"
              />
              <div v-else class="flex flex-col items-center gap-1 text-slate-300">
                <BookOpen class="w-8 h-8" />
                <span class="text-xs">Chưa có ảnh</span>
              </div>
            </div>

            <!-- Upload controls -->
            <div class="flex-1 space-y-2">
              <label
                class="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 hover:border-slate-400 rounded-xl px-4 py-3 transition-all"
              >
                <Upload class="w-4 h-4 text-slate-400" />
                <span class="text-sm text-slate-500">
                  {{ imageFile ? imageFile.name : 'Chọn ảnh từ máy tính' }}
                </span>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="onFileChange"
                />
              </label>
              <p class="text-xs text-slate-400">Hỗ trợ JPG, PNG, WEBP. Tối đa 5MB.</p>
              <button
                v-if="imageFile || imagePreview"
                type="button"
                @click="clearImage"
                class="text-xs text-red-400 hover:text-red-500 flex items-center gap-1 transition-colors"
              >
                <XIcon class="w-3 h-3" /> Xoá ảnh
              </button>
            </div>
          </div>
        </div>

        <!-- Thông tin cơ bản -->
        <div>
          <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Thông tin cơ bản</p>
          <div class="space-y-2">
            <input
              v-model="form.title"
              placeholder="Tiêu đề sách"
              class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
            />
            <div class="grid grid-cols-2 gap-2">
              <input
                v-model="form.publisher"
                placeholder="Nhà xuất bản"
                class="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
              />
              <input
                v-model.number="form.publishYear"
                type="number"
                placeholder="Năm xuất bản"
                class="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
              />
            </div>
            <input
              v-model="form.isbn"
              placeholder="ISBN"
              class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 font-mono focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
            />
          </div>
        </div>

        <!-- Số lượng -->
        <div>
          <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Số lượng</p>
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-slate-50 rounded-xl p-3">
              <p class="text-slate-400 text-xs font-medium mb-1.5">Tổng số lượng</p>
              <input
                v-model.number="form.quantity"
                type="number"
                placeholder="0"
                class="w-full bg-transparent text-slate-800 text-sm font-semibold focus:outline-none"
              />
            </div>
            <div class="bg-emerald-50 rounded-xl p-3">
              <p class="text-emerald-600 text-xs font-medium mb-1.5">Số lượng sẵn có</p>
              <input
                v-model.number="form.availableQuantity"
                type="number"
                placeholder="0"
                class="w-full bg-transparent text-emerald-700 text-sm font-semibold focus:outline-none"
              />
            </div>
          </div>
        </div>

        <!-- Mô tả -->
        <div>
          <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Mô tả</p>
          <textarea
            v-model="form.description"
            placeholder="Nhập mô tả sách..."
            rows="3"
            class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition resize-none"
          ></textarea>
        </div>

        <!-- Tác giả -->
        <div>
          <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Tác giả</p>
          <div class="space-y-2">
            <div
              v-for="(a, index) in form.authors"
              :key="index"
              class="flex gap-2 items-center bg-slate-50 rounded-xl px-3 py-2"
            >
              <select
                v-model="form.authors[index].authorId"
                class="flex-1 bg-transparent text-sm text-slate-700 focus:outline-none"
              >
                <option value="">-- Chọn tác giả --</option>
                <option v-for="author in authors" :key="author.id" :value="author.id">
                  {{ author.name }}
                </option>
              </select>
              <div class="w-px h-4 bg-slate-200"></div>
              <select
                v-model="form.authors[index].role"
                class="bg-transparent text-sm text-slate-500 focus:outline-none"
              >
                <option value="MAIN_AUTHOR">Chính</option>
                <option value="CO_AUTHOR">Đồng</option>
              </select>
              <button type="button" @click="removeAuthor(index)" class="text-slate-300 hover:text-red-400 transition-colors ml-1">
                <XIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
          <button type="button" @click="addAuthor" class="mt-2 flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-xs font-medium transition-colors">
            <PlusIcon class="w-4 h-4" /> Thêm tác giả
          </button>
        </div>

        <!-- Thể loại -->
        <div>
          <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Thể loại</p>
          <div class="space-y-2">
            <div
              v-for="(c, index) in form.categoryIds"
              :key="index"
              class="flex gap-2 items-center bg-amber-50 rounded-xl px-3 py-2"
            >
              <select
                v-model="form.categoryIds[index]"
                class="flex-1 bg-transparent text-sm text-amber-800 focus:outline-none"
              >
                <option value="">-- Chọn thể loại --</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
              <button type="button" @click="removeCategory(index)" class="text-amber-300 hover:text-red-400 transition-colors">
                <XIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
          <button type="button" @click="addCategory" class="mt-2 flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-xs font-medium transition-colors">
            <PlusIcon class="w-4 h-4" /> Thêm thể loại
          </button>
        </div>

      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
        <button
          @click="$emit('close')"
          class="text-slate-500 hover:text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-150"
        >
          Huỷ
        </button>
        <button
          @click="handleSave"
          class="bg-slate-800 hover:bg-slate-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-150"
        >
          {{ isEdit ? 'Cập nhật' : 'Thêm sách' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { BookOpen, Upload } from "lucide-vue-next";

// Inline icon components to avoid extra imports
const XIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`,
};
const PlusIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>`,
};

const props = defineProps({
  isEdit: { type: Boolean, default: false },
  initialForm: { type: Object, required: true },
  // existing image URL (edit mode)
  existingImageUrl: { type: String, default: null },
  authors: { type: Array, default: () => [] },
  categories: { type: Array, default: () => [] },
});

const emit = defineEmits(["close", "save"]);

// ── form state ────────────────────────────────────────────────
const form = ref({ ...props.initialForm });

// ── image state ───────────────────────────────────────────────
const imageFile = ref(null);
const imagePreview = ref(props.existingImageUrl || null);
const fileInput = ref(null);

// re-sync when parent opens the modal with new initialForm
watch(
  () => props.initialForm,
  (val) => {
    form.value = { ...val };
  },
  { deep: true }
);

watch(
  () => props.existingImageUrl,
  (val) => {
    imagePreview.value = val || null;
    imageFile.value = null;
  }
);

// ── image handlers ────────────────────────────────────────────
const onFileChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // 5 MB guard
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

// ── author / category helpers ─────────────────────────────────
const addAuthor = () => form.value.authors.push({ authorId: "", role: "MAIN_AUTHOR" });
const removeAuthor = (i) => form.value.authors.splice(i, 1);
const addCategory = () => form.value.categoryIds.push("");
const removeCategory = (i) => form.value.categoryIds.splice(i, 1);

// ── save: build FormData and emit ─────────────────────────────
const handleSave = () => {
  const payload = new FormData();

  // scalar fields
  payload.append("title", form.value.title ?? "");
  payload.append("publisher", form.value.publisher ?? "");
  if (form.value.publishYear != null) payload.append("publishYear", form.value.publishYear);
  payload.append("isbn", form.value.isbn ?? "");
  payload.append("quantity", form.value.quantity ?? 0);
  payload.append("availableQuantity", form.value.availableQuantity ?? form.value.quantity ?? 0);
  payload.append("description", form.value.description ?? "");

  // image (only when a new file is picked)
  if (imageFile.value) {
    payload.append("image", imageFile.value);
  }

  // authors list  →  authors[0].authorId, authors[0].role, ...
  const filteredAuthors = form.value.authors.filter((a) => a.authorId);
  filteredAuthors.forEach((a, i) => {
    payload.append(`authors[${i}].authorId`, a.authorId);
    payload.append(`authors[${i}].role`, a.role);
  });

  // categoryIds list
  const filteredCats = form.value.categoryIds.filter((c) => c);
  filteredCats.forEach((id, i) => {
    payload.append(`categoryIds[${i}]`, id);
  });

  emit("save", payload);
};
</script>