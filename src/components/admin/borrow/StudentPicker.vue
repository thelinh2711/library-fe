<!-- src/components/borrow/StudentPicker.vue -->
<template>
  <div class="relative" ref="wrapRef">
    <!-- Input tìm kiếm -->
    <div
      class="flex items-center gap-2 border rounded-xl px-3 py-2.5 transition"
      :class="selected
        ? 'border-indigo-300 bg-indigo-50/50'
        : 'border-slate-200 bg-white focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100'"
    >
      <!-- Avatar khi đã chọn -->
      <div
        v-if="selected"
        class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white text-[10px] font-bold"
      >
        {{ initials(selected.fullName) }}
      </div>
      <GraduationCap v-else class="h-4 w-4 text-slate-400 flex-shrink-0" />

      <input
        ref="inputRef"
        v-model="keyword"
        :placeholder="selected ? selected.fullName : 'Tìm sinh viên theo tên hoặc MSSV...'"
        :class="selected ? 'text-indigo-700 font-medium placeholder-indigo-400' : 'text-slate-700 placeholder-slate-400'"
        class="flex-1 bg-transparent text-sm outline-none min-w-0"
        @focus="open = true"
        @input="onInput"
      />

      <button
        v-if="selected"
        type="button"
        @click.stop="clear"
        class="flex-shrink-0 text-indigo-300 hover:text-indigo-500 transition"
      >
        <X class="h-3.5 w-3.5" />
      </button>
    </div>

    <!-- Dropdown kết quả -->
    <div
      v-if="open && (results.length > 0 || searching)"
      class="absolute z-50 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden"
    >
      <!-- Loading -->
      <div v-if="searching" class="px-4 py-3 text-xs text-slate-400 text-center">
        Đang tìm...
      </div>
      <ul v-else class="max-h-52 overflow-y-auto py-1">
        <li v-for="s in results" :key="s.id">
          <button
            type="button"
            class="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition text-left"
            @click="select(s)"
          >
            <div class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-bold">
              {{ initials(s.fullName) }}
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-slate-700 truncate">{{ s.fullName }}</p>
              <p class="text-xs text-slate-400">{{ s.studentCode }} · {{ s.className }}</p>
            </div>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { GraduationCap, X } from "lucide-vue-next";
import api from "@/services/axiosClient";

const props = defineProps({
  modelValue: { type: Object, default: null },
});
const emit = defineEmits(["update:modelValue", "select"]);

const keyword  = ref("");
const open     = ref(false);
const results  = ref([]);
const searching = ref(false);
const selected  = ref(props.modelValue);
const wrapRef   = ref(null);
const inputRef  = ref(null);

let debounce = null;

const onInput = () => {
  clearTimeout(debounce);
  if (!keyword.value.trim()) { results.value = []; return; }
  debounce = setTimeout(search, 300);
};

const search = async () => {
  searching.value = true;
  try {
    const res = await api.get("/students/search", {
      params: { keyword: keyword.value.trim(), page: 0, size: 8 },
    });
    results.value = res.data.result.content ?? [];
  } catch {
    results.value = [];
  } finally {
    searching.value = false;
  }
};

const select = (s) => {
  selected.value = s;
  keyword.value  = "";
  open.value     = false;
  emit("update:modelValue", s);
  emit("select", s);
};

const clear = () => {
  selected.value = null;
  keyword.value  = "";
  emit("update:modelValue", null);
  emit("select", null);
  inputRef.value?.focus();
};

const initials = (name) => {
  if (!name) return "?";
  const p = name.trim().split(" ");
  return p.length >= 2
    ? (p[0][0] + p[p.length - 1][0]).toUpperCase()
    : name[0].toUpperCase();
};

const onClickOutside = (e) => {
  if (wrapRef.value && !wrapRef.value.contains(e.target)) open.value = false;
};

onMounted(() => document.addEventListener("mousedown", onClickOutside));
onBeforeUnmount(() => document.removeEventListener("mousedown", onClickOutside));
</script>