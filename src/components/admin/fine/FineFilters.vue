<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
    <!-- Status tabs -->
    <div class="flex gap-1 bg-gray-100 rounded-full p-1">
      <button
        v-for="tab in TABS"
        :key="tab.key"
        @click="onStatusChange(tab.key)"
        :class="[
          'px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150',
          statusFilter === tab.key
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
            : 'text-gray-500 hover:text-gray-700',
        ]"
      >
        {{ tab.label }}
        <span
          v-if="tab.key === 'UNPAID' && unpaidCount > 0"
          class="ml-1 bg-white/30 text-white rounded-full px-1.5 py-0.5 text-[10px] font-bold"
        >
          {{ unpaidCount }}
        </span>
      </button>
    </div>

    <!-- Type filter (FE only) -->
    <select
      :value="typeFilter"
      @change="emit('update:typeFilter', $event.target.value)"
      class="border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-600 bg-white outline-none focus:border-indigo-400 cursor-pointer transition-colors"
    >
      <option value="ALL">Tất cả loại phạt</option>
      <option value="LATE">Quá hạn</option>
      <option value="DAMAGED">Hư hỏng</option>
      <option value="LOST">Mất sách</option>
    </select>

    <!-- Search — debounce gửi lên BE -->
    <div class="relative flex-1 min-w-[200px]">
      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
      <input
        :value="search"
        @input="onSearchInput($event.target.value)"
        placeholder="Tìm theo tên hoặc mã sinh viên..."
        class="w-full border border-gray-200 rounded-xl pl-8 pr-3 py-2 text-xs outline-none focus:border-indigo-400 transition-colors"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  statusFilter: String,
  typeFilter:   String,
  search:       String,
  unpaidCount:  { type: Number, default: 0 },
})

const emit = defineEmits([
  'update:statusFilter',
  'update:typeFilter',
  'update:search',
  'fetch',   // báo parent gọi lại API
])

const TABS = [
  { key: '',       label: 'Tất cả'  },
  { key: 'UNPAID', label: 'Chưa TT' },
  { key: 'PAID',   label: 'Đã TT'   },
]

function onStatusChange(key) {
  emit('update:statusFilter', key)
  emit('fetch')
}

// Debounce 400ms để tránh gọi API liên tục khi gõ
let debounceTimer = null
function onSearchInput(val) {
  emit('update:search', val)
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => emit('fetch'), 400)
}
</script>