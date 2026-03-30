<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="fine"
        class="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center"
        @click.self="emit('close')"
      >
        <div class="bg-white rounded-2xl p-8 w-[440px] shadow-2xl">
          <!-- Header -->
          <div class="flex justify-between items-start mb-5">
            <div>
              <h3 class="text-lg font-extrabold text-gray-800">Chi tiết phiếu phạt</h3>
              <p class="text-xs text-gray-400 mt-0.5">#{{ fine.id?.toUpperCase() }}</p>
            </div>
            <button
              @click="emit('close')"
              class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 text-base transition-colors"
            >
              ✕
            </button>
          </div>

          <!-- Detail rows -->
          <div class="flex flex-col gap-3">
            <FineDetailRow label="Sinh viên"      :value="fine.studentName" />
            <FineDetailRow label="Mã sinh viên"   :value="fine.studentCode" />
            <FineDetailRow label="Sách"           :value="fine.bookTitle" />
            <FineDetailRow label="Loại phạt">
              <FineBadge variant="type" :value="fine.type" />
            </FineDetailRow>
            <FineDetailRow label="Số tiền">
              <strong class="text-indigo-600">{{ formatVND(fine.amount) }}</strong>
            </FineDetailRow>
            <FineDetailRow label="Trạng thái">
              <FineBadge variant="status" :value="fine.paymentStatus" />
            </FineDetailRow>
            <FineDetailRow label="Ghi chú"        :value="fine.note || '—'" />
            <FineDetailRow label="Ngày tạo"       :value="formatDate(fine.createdAt)" />
            <FineDetailRow v-if="fine.paidAt" label="Ngày thanh toán" :value="formatDate(fine.paidAt)" />
          </div>

          <!-- Pay button -->
          <button
            v-if="fine.paymentStatus === 'UNPAID'"
            @click="emit('pay', fine.id)"
            class="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold
                   shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:opacity-95 transition-all"
          >
            ✓ Xác nhận thu tiền phạt
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import FineBadge from './FineBadge.vue'
import FineDetailRow from './FineDetailRow.vue'

defineProps({
  fine: { type: Object, default: null },
})

const emit = defineEmits(['close', 'pay'])

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)

const formatDate = (str) => {
  if (!str) return '—'
  const d = new Date(str)
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')} ${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from,
.modal-leave-to    { opacity: 0; }
</style>