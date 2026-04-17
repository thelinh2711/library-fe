<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <!-- Head -->
    <div class="grid grid-cols-[2fr_2fr_1fr_1fr_1.2fr_1.2fr_80px] px-5 py-3 bg-gray-50 border-b border-gray-100
                text-[11px] font-bold text-gray-400 uppercase tracking-wider">
      <span>Sinh viên</span>
      <span>Sách</span>
      <span>Loại phạt</span>
      <span>Số tiền</span>
      <span>Trạng thái</span>
      <span>Ngày thanh toán</span>
      <span>Thao tác</span>
    </div>

    <!-- Empty state -->
    <div v-if="fines.length === 0" class="py-16 text-center text-gray-400 text-sm">
      Không có phiếu phạt nào
    </div>

    <!-- Rows -->
    <FineTableRow
      v-for="(fine, idx) in fines"
      :key="fine.id"
      :fine="fine"
      :is-last="idx === fines.length - 1"
      @view="emit('view', fine)"
      @pay="emit('pay', fine.id)"
    />
  </div>
</template>

<script setup>
import FineTableRow from './FineTableRow.vue'

defineProps({
  fines: { type: Array, default: () => [] },
})

const emit = defineEmits(['view', 'pay'])
</script>