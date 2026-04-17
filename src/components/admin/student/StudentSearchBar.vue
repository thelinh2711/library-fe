<!-- src/components/student/StudentSearchBar.vue -->
<template>
  <div class="flex flex-wrap items-center gap-2">
    <!-- Keyword -->
    <div class="relative flex-1 min-w-[200px]">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
      <input
        v-model="local.keyword"
        type="text"
        placeholder="Tìm MSSV, tên, email…"
        class="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
        @keyup.enter="doSearch"
      />
    </div>

    <!-- Khoa -->
    <div class="relative">
      <select v-model="local.faculty" :class="SELECT" @change="onFacultyChange">
        <option value="">Tất cả khoa</option>
        <option v-for="f in faculties" :key="f" :value="f">{{ f }}</option>
      </select>
      <ChevronDown class="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
    </div>

    <!-- Lớp -->
    <div class="relative">
      <select v-model="local.className" :class="SELECT" :disabled="loadingClasses">
        <option value="">{{ loadingClasses ? 'Đang tải…' : 'Tất cả lớp' }}</option>
        <option v-for="c in classes" :key="c" :value="c">{{ c }}</option>
      </select>
      <ChevronDown class="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
    </div>

    <!-- Lọc -->
    <button
      class="flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition"
      @click="doSearch"
    >
      <SlidersHorizontal class="h-3.5 w-3.5" /> Lọc
    </button>

    <!-- Reset -->
    <button
      class="flex items-center justify-center w-9 h-9 border border-slate-200 rounded-xl bg-white text-slate-400 hover:border-rose-300 hover:text-rose-400 transition"
      title="Xóa bộ lọc"
      @click="reset"
    >
      <X class="h-3.5 w-3.5" />
    </button>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-vue-next";
import studentService from "@/services/studentService";

const props = defineProps({ modelValue: { type: Object, default: () => ({}) } });
const emits = defineEmits(["update:modelValue", "search"]);

const local = reactive({
  keyword:   props.modelValue.keyword   ?? "",
  className: props.modelValue.className ?? "",
  faculty:   props.modelValue.faculty   ?? "",
});

const faculties      = ref([]);
const classes        = ref([]);
const loadingClasses = ref(false);

const SELECT = "appearance-none w-40 pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition disabled:opacity-50 disabled:cursor-not-allowed";

onMounted(async () => {
  try {
    const res = await studentService.getFaculties();
    faculties.value = res.data.result;
  } catch { faculties.value = []; }

  await fetchClasses("");
});

const fetchClasses = async (faculty) => {
  loadingClasses.value = true;
  try {
    const res = await studentService.getClasses(faculty);
    classes.value = res.data.result;
  } catch { classes.value = []; }
  finally { loadingClasses.value = false; }
};

// Khi đổi khoa → reset lớp và load lại danh sách lớp theo khoa
const onFacultyChange = async () => {
  local.className = "";
  await fetchClasses(local.faculty);
};

const doSearch = () => {
  emits("update:modelValue", { ...local });
  emits("search", { ...local });
};

const reset = async () => {
  local.keyword = ""; local.className = ""; local.faculty = "";
  await fetchClasses("");
  doSearch();
};
</script>