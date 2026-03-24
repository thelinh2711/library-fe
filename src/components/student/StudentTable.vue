<!-- src/components/student/StudentTable.vue -->
<template>
  <!-- Empty state: chỉ hiện khi KHÔNG loading VÀ không có data -->
  <div v-if="!loading && students.length === 0" class="flex flex-col items-center gap-2 py-16 text-slate-400">
    <GraduationCap class="w-10 h-10 opacity-30" />
    <p class="text-sm font-semibold text-slate-500">Chưa có sinh viên nào</p>
    <p class="text-xs">Thêm mới hoặc import danh sách sinh viên</p>
  </div>

  <!-- Table: hiện khi đang loading HOẶC có data -->
  <div v-else class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-slate-100">
          <th :class="TH">MSSV</th>
          <th :class="TH">Họ tên</th>
          <th :class="TH">Email</th>
          <th :class="TH">Lớp</th>
          <th :class="TH">Khoa</th>
          <th :class="TH">Khóa</th>
          <th :class="TH">Trạng thái</th>
          <th :class="[TH, 'text-right']">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <!-- Skeleton -->
        <template v-if="loading">
          <tr v-for="i in 6" :key="i" class="border-b border-slate-50">
            <td v-for="j in 8" :key="j" class="px-4 py-3">
              <div class="h-3.5 rounded bg-slate-100 animate-pulse" :style="{ width: j === 2 ? '80%' : '60%' }" />
            </td>
          </tr>
        </template>

        <!-- Data -->
        <template v-else>
          <tr
            v-for="s in students"
            :key="s.id"
            class="border-b border-slate-50 hover:bg-slate-50/70 cursor-pointer transition-colors"
            @click="$emit('view', s)"
          >
            <td class="px-4 py-3 font-mono text-xs font-semibold text-indigo-500">{{ s.studentCode }}</td>

            <td class="px-4 py-3">
              <div class="flex items-center gap-2.5">
                <div class="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[10px] font-bold">
                  {{ initials(s.fullName) }}
                </div>
                <span class="font-medium text-slate-700">{{ s.fullName }}</span>
              </div>
            </td>

            <td class="px-4 py-3 text-slate-500 text-xs">{{ s.email }}</td>
            <td class="px-4 py-3 text-slate-600">{{ s.className }}</td>
            <td class="px-4 py-3 text-slate-600 max-w-[140px] truncate">{{ s.faculty }}</td>
            <td class="px-4 py-3 text-slate-600">{{ s.courseYear }}</td>

            <td class="px-4 py-3">
              <span :class="statusClass(s.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold">
                {{ statusLabel(s.status) }}
              </span>
            </td>

            <td class="px-4 py-3" @click.stop>
              <div class="flex items-center justify-end gap-1.5">
                <button
                  class="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-500 hover:bg-indigo-500 hover:text-white flex items-center justify-center transition"
                  title="Sửa"
                  @click="$emit('edit', s)"
                >
                  <Pencil class="h-3.5 w-3.5" />
                </button>
                <button
                  class="w-7 h-7 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition"
                  title="Xóa"
                  @click="$emit('delete', s)"
                >
                  <Trash2 class="h-3.5 w-3.5" />
                </button>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { GraduationCap, Pencil, Trash2 } from "lucide-vue-next";

defineProps({
  students: { type: Array,   default: () => [] },
  loading:  { type: Boolean, default: false    },
});
defineEmits(["edit", "delete", "view"]);

const TH = "px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap";

const initials    = (n) => n?.split(" ").slice(-2).map((w) => w[0]?.toUpperCase()).join("") ?? "?";
const statusLabel = (s) => ({ ACTIVE: "Hoạt động", INACTIVE: "Ngừng", SUSPENDED: "Khóa" }[s] ?? s);
const statusClass = (s) => ({
  ACTIVE:    "bg-emerald-50 text-emerald-600",
  INACTIVE:  "bg-slate-100 text-slate-500",
  SUSPENDED: "bg-rose-50 text-rose-500",
}[s] ?? "bg-slate-100 text-slate-500");
</script>