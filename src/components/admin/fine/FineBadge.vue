<template>
  <!-- Payment status badge -->
  <span
    v-if="variant === 'status'"
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
      isPaid
        ? 'bg-green-50 text-green-700 border-green-200'
        : 'bg-orange-50 text-orange-700 border-orange-200',
    ]"
  >
    <span
      :class="['w-1.5 h-1.5 rounded-full', isPaid ? 'bg-green-500' : 'bg-orange-500']"
    />
    {{ isPaid ? 'Đã thanh toán' : 'Chưa thanh toán' }}
  </span>

  <!-- Fine type badge -->
  <span
    v-else-if="variant === 'type'"
    :class="['inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border', typeClass]"
  >
    <span :class="['w-1.5 h-1.5 rounded-full', typeDotClass]" />
    {{ typeLabel }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'status' }, // 'status' | 'type'
  value: String,
})

const isPaid = computed(() => props.value === 'PAID')

const TYPE_MAP = {
  LATE: { label: 'Quá hạn',  class: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  DAMAGED: { label: 'Hư hỏng',  class: 'bg-rose-50   text-rose-700   border-rose-200',   dot: 'bg-rose-500'   },
  LOST:    { label: 'Mất sách', class: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-500' },
}

const typeLabel   = computed(() => TYPE_MAP[props.value]?.label   ?? props.value)
const typeClass   = computed(() => TYPE_MAP[props.value]?.class   ?? '')
const typeDotClass = computed(() => TYPE_MAP[props.value]?.dot    ?? 'bg-gray-400')
</script>