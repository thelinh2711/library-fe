<template>
  <div
    :class="[
      'grid grid-cols-[2fr_2fr_1fr_1fr_1.2fr_1.2fr_80px] px-5 py-3.5 items-center hover:bg-gray-50 transition-colors duration-150',
      !isLast && 'border-b border-gray-50',
    ]"
  >
    <!-- Student -->
    <div class="flex items-center gap-2.5">
      <div
        class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white text-[10px] font-bold"
      >
        {{ initials(fine.studentName) }}
      </div>
      <div>
        <div class="text-sm font-semibold text-gray-800 leading-tight">{{ fine.studentName }}</div>
        <div class="text-[11px] text-gray-400">{{ fine.studentCode }}</div>
      </div>
    </div>

    <!-- Book -->
    <div class="text-sm text-gray-600 truncate pr-3">{{ fine.bookTitle }}</div>

    <!-- Type -->
    <div><FineBadge variant="type" :value="fine.type" /></div>

    <!-- Amount -->
    <div class="text-sm font-bold text-indigo-600">{{ formatVND(fine.amount) }}</div>

    <!-- Status -->
    <div><FineBadge variant="status" :value="fine.paymentStatus" /></div>

    <!-- Date -->
    <div class="text-xs text-gray-500">{{ formatDate(fine.paidAt) }}</div>

    <!-- Actions -->
    <div class="flex gap-1.5">
      <button
        @click="emit('view')"
        class="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm transition-colors"
        title="Xem chi tiết"
      >
        👁
      </button>
      <button
        v-if="fine.paymentStatus === 'UNPAID'"
        @click="emit('pay')"
        class="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 flex items-center justify-center text-sm transition-colors font-bold"
        title="Xác nhận thanh toán"
      >
        ✓
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import FineBadge from './FineBadge.vue'

const props = defineProps({
  fine: { type: Object, required: true },
  isLast: { type: Boolean, default: false },
})

const emit = defineEmits(['view', 'pay'])

const initials = (name) => {
  if (!name) return "?";
  const p = name.trim().split(" ");
  return p.length >= 2
    ? (p[0][0] + p[p.length - 1][0]).toUpperCase()
    : name[0].toUpperCase();
};

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)

const formatDate = (str) => {
  if (!str) return '—'
  const d = new Date(str)
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')} ${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
}
</script>