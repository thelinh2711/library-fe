<!-- src/components/student/StudentImportModal.vue -->
<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0"
                leave-active-class="transition duration-150" leave-to-class="opacity-0">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" @click.self="$emit('close')">
        <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 scale-95 translate-y-2"
                    leave-active-class="transition duration-150" leave-to-class="opacity-0 scale-95 translate-y-2">
          <div v-if="show" class="w-full max-w-xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">

            <!-- Header -->
            <div class="flex items-start justify-between px-6 py-5 border-b border-slate-100">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                  <FileSpreadsheet class="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 class="text-[15px] font-bold text-slate-800">Import sinh viên</h2>
                  <p class="text-xs text-slate-400 mt-0.5">Tải file Excel để nhập hàng loạt</p>
                </div>
              </div>
              <button class="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 transition" @click="$emit('close')">
                <X class="h-4 w-4" />
              </button>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">

              <!-- Drop zone -->
              <div
                :class="[
                  'flex flex-col items-center gap-2 p-8 border-2 border-dashed rounded-2xl cursor-pointer transition',
                  isDragging ? 'border-indigo-400 bg-indigo-50' : file ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/50'
                ]"
                @dragover.prevent="isDragging = true"
                @dragleave="isDragging = false"
                @drop.prevent="onDrop"
                @click="fileInput.click()"
              >
                <input ref="fileInput" type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="onFileChange" />
                <component :is="file ? FileCheck : UploadCloud"
                  :class="['w-9 h-9', file ? 'text-emerald-500' : 'text-slate-400']" />
                <p class="text-sm font-semibold text-slate-600">
                  {{ file ? file.name : "Kéo thả hoặc click để chọn file" }}
                </p>
                <p class="text-xs text-slate-400">
                  {{ file ? ((file.size / 1024).toFixed(1) + ' KB — click để đổi file') : '.xlsx, .xls, .csv — tối đa 5MB' }}
                </p>
              </div>

              <!-- Hint -->
              <div class="flex items-start gap-2 px-3 py-2.5 bg-blue-50 text-blue-600 text-xs rounded-xl leading-relaxed">
                <Info class="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                <span>Cần có các cột:
                  <strong>email, fullName, studentCode, className, faculty, dateOfBirth, gender, courseYear, phone, address, status</strong>
                </span>
              </div>

              <!-- Preview -->
              <div v-if="rows.length">
                <p class="text-xs font-semibold text-slate-500 mb-2">Xem trước — {{ rows.length }} dòng</p>
                <div class="overflow-x-auto rounded-xl border border-slate-200">
                  <table class="w-full text-xs">
                    <thead class="bg-slate-50">
                      <tr>
                        <th v-for="col in previewCols" :key="col"
                          class="px-3 py-2 text-left font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                          {{ col }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, i) in rows.slice(0, 6)" :key="i" class="border-t border-slate-100">
                        <td v-for="col in previewCols" :key="col" class="px-3 py-2 text-slate-600">
                          {{ row[col] ?? '—' }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p v-if="rows.length > 6" class="text-center text-xs text-slate-400 mt-1.5">
                  ... và {{ rows.length - 6 }} dòng nữa
                </p>
              </div>

              <!-- Errors -->
              <div v-if="parseError" class="flex items-center gap-2 px-4 py-3 bg-rose-50 text-rose-600 text-sm rounded-xl">
                <AlertCircle class="h-4 w-4 flex-shrink-0" /> {{ parseError }}
              </div>
              <div v-if="apiError" class="flex items-center gap-2 px-4 py-3 bg-rose-50 text-rose-600 text-sm rounded-xl">
                <AlertCircle class="h-4 w-4 flex-shrink-0" /> {{ apiError }}
              </div>
            </div>

            <!-- Footer -->
            <div class="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button class="px-4 py-2 text-sm font-semibold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition" @click="$emit('close')">
                Hủy
              </button>
              <button
                :disabled="!rows.length || submitting"
                class="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl hover:opacity-90 disabled:opacity-55 disabled:cursor-not-allowed transition"
                @click="doImport"
              >
                <Loader2 v-if="submitting" class="h-4 w-4 animate-spin" />
                Import {{ rows.length ? rows.length + ' sinh viên' : '' }}
              </button>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from "vue";
import { FileSpreadsheet, X, UploadCloud, FileCheck, Info, AlertCircle, Loader2 } from "lucide-vue-next";
import * as XLSX from "xlsx";

const props = defineProps({
  show:       { type: Boolean, default: false },
  submitting: { type: Boolean, default: false },
  apiError:   { type: String,  default: ""    },
});
const emits = defineEmits(["close", "import"]);

const file       = ref(null);
const rows       = ref([]);
const parseError = ref("");
const isDragging = ref(false);
const fileInput  = ref(null);
const previewCols = ["email", "fullName", "studentCode", "className", "faculty"];

watch(() => props.show, (v) => {
  if (!v) { file.value = null; rows.value = []; parseError.value = ""; }
});

const parseFile = (f) => {
  parseError.value = ""; file.value = f;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const wb   = XLSX.read(e.target.result, { type: "array", cellDates: true });
      const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "" });
      if (!data.length) { parseError.value = "File không có dữ liệu"; return; }
      rows.value = data.map((r) => ({
        ...r,
        dateOfBirth: r.dateOfBirth instanceof Date ? r.dateOfBirth.toISOString().split("T")[0] : r.dateOfBirth,
        status: r.status || "ACTIVE",
      }));
    } catch { parseError.value = "Không đọc được file. Kiểm tra lại định dạng."; }
  };
  reader.readAsArrayBuffer(f);
};

const onFileChange = (e) => { if (e.target.files[0]) parseFile(e.target.files[0]); };
const onDrop       = (e)  => { isDragging.value = false; if (e.dataTransfer.files[0]) parseFile(e.dataTransfer.files[0]); };
const doImport     = ()   => { if (rows.value.length) emits("import", rows.value); };
</script>