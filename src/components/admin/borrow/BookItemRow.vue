<template>
  <div class="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">

    <!-- Số thứ tự -->
    <span class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-500">
      {{ index + 1 }}
    </span>

    <!-- Search sách -->
    <div class="relative flex-1 min-w-0" ref="wrapRef">
      <div
        class="flex items-center gap-2 border rounded-lg px-2.5 py-1.5 bg-white transition"
        :class="modelValue.book
          ? 'border-indigo-200'
          : 'border-slate-200 focus-within:border-indigo-400'"
      >
        <BookOpen class="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
        <input
          v-model="bookKeyword"
          :placeholder="modelValue.book ? modelValue.book.title : 'Tìm sách...'"
          :class="modelValue.book ? 'text-slate-700 font-medium' : 'text-slate-600 placeholder-slate-400'"
          class="flex-1 bg-transparent text-xs outline-none min-w-0"
          @focus="bookOpen = true"
          @input="onBookInput"
        />
        <button v-if="modelValue.book" type="button" @click="clearBook" class="text-slate-300 hover:text-slate-500">
          <X class="h-3 w-3" />
        </button>
      </div>

      <!-- Dropdown sách -->
      <div
        v-if="bookOpen && (bookResults.length > 0 || bookSearching)"
        class="absolute z-50 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden"
      >
        <div v-if="bookSearching" class="px-3 py-2 text-xs text-slate-400 text-center">Đang tìm...</div>
        <ul v-else class="max-h-40 overflow-y-auto py-1">
          <li v-for="b in bookResults" :key="b.id">
            <button
              type="button"
              class="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 transition text-left"
              :disabled="b.availableQuantity <= 0"
              :class="b.availableQuantity <= 0 ? 'opacity-40 cursor-not-allowed' : ''"
              @click="selectBook(b)"
            >
              <img v-if="b.imageUrl" :src="b.imageUrl" class="h-8 w-6 rounded object-cover flex-shrink-0" />
              <div v-else class="h-8 w-6 rounded bg-slate-100 flex-shrink-0" />
              <div class="min-w-0 flex-1">
                <p class="text-xs font-medium text-slate-700 truncate">{{ b.title }}</p>
                <p class="text-[10px] text-slate-400">Còn: {{ b.availableQuantity }}</p>
              </div>
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Hạn trả -->
    <input
      type="date"
      :value="modelValue.dueDate"
      :min="minDate"
      @change="$emit('update:modelValue', { ...modelValue, dueDate: $event.target.value })"
      class="w-32 flex-shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
    />

    <!-- Xoá dòng -->
    <button
      type="button"
      @click="$emit('remove')"
      class="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-lg text-slate-300 hover:bg-rose-50 hover:text-rose-400 transition"
    >
      <Trash2 class="h-3.5 w-3.5" />
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { BookOpen, X, Trash2 } from "lucide-vue-next";
import api from "@/services/axiosClient";

const props = defineProps({
  modelValue: { type: Object, required: true }, // { book: null, dueDate: '' }
  index:      { type: Number, default: 0 },
});
const emit = defineEmits(["update:modelValue", "remove"]);

const bookKeyword  = ref("");
const bookOpen     = ref(false);
const bookResults  = ref([]);
const bookSearching = ref(false);
const wrapRef = ref(null);

const minDate = new Date(Date.now() + 86400000).toISOString().split("T")[0];

let debounce = null;
const onBookInput = () => {
  clearTimeout(debounce);
  if (!bookKeyword.value.trim()) { bookResults.value = []; return; }
  debounce = setTimeout(searchBooks, 300);
};

const searchBooks = async () => {
  bookSearching.value = true;
  try {
    const res = await api.get("/books", {
      params: { keyword: bookKeyword.value.trim(), page: 0, size: 8 },
    });
    bookResults.value = res.data.result.content ?? [];
  } catch {
    bookResults.value = [];
  } finally {
    bookSearching.value = false;
  }
};

const selectBook = (b) => {
  emit("update:modelValue", { ...props.modelValue, book: b, bookId: b.id });
  bookKeyword.value = "";
  bookOpen.value    = false;
};

const clearBook = () => {
  emit("update:modelValue", { ...props.modelValue, book: null, bookId: null });
};

const onClickOutside = (e) => {
  if (wrapRef.value && !wrapRef.value.contains(e.target)) bookOpen.value = false;
};

onMounted(() => document.addEventListener("mousedown", onClickOutside));
onBeforeUnmount(() => document.removeEventListener("mousedown", onClickOutside));
</script>