<!-- src/components/student/CategoryFilterDropdown.vue -->
<template>
  <div class="relative" ref="dropdownRef">

    <!-- Trigger button — mimics style của các select trong toolbar -->
    <button
      type="button"
      @click="toggleDropdown"
      class="flex items-center gap-2 px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-50 text-stone-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all cursor-pointer min-w-[160px] justify-between"
      :class="modelValue ? 'border-blue-300 bg-blue-50 text-blue-700' : ''"
    >
      <span class="truncate">{{ selectedLabel }}</span>
      <svg
        class="w-3.5 h-3.5 flex-shrink-0 text-stone-400 transition-transform duration-150"
        :class="open ? 'rotate-180' : ''"
        fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" d="M19 9l-7 7-7-7"/>
      </svg>
    </button>

    <!-- Dropdown panel -->
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-1"
    >
      <div
        v-if="open"
        class="absolute left-0 top-full mt-1.5 w-56 bg-white border border-stone-200 rounded-xl shadow-lg z-50 overflow-hidden origin-top-left"
      >

        <!-- Search box -->
        <div class="p-2 border-b border-stone-100">
          <div class="relative">
            <svg
              class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none"
              fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8"/>
              <path stroke-linecap="round" d="m21 21-4.35-4.35"/>
            </svg>
            <input
              ref="searchInput"
              v-model="keyword"
              @input="onSearchInput"
              placeholder="Tìm thể loại..."
              class="w-full h-8 rounded-lg border border-stone-200 bg-stone-50 pl-8 pr-3 text-xs text-stone-700 placeholder-stone-400 outline-none focus:border-blue-400 focus:bg-white transition-all"
            />
          </div>
        </div>

        <!-- List -->
        <ul class="max-h-52 overflow-y-auto py-1">

          <!-- Tất cả thể loại (option reset) -->
          <li>
            <button
              type="button"
              @click="select(null)"
              class="w-full text-left px-3.5 py-2 text-sm transition-colors flex items-center gap-2"
              :class="!modelValue
                ? 'text-blue-600 bg-blue-50 font-medium'
                : 'text-stone-600 hover:bg-stone-50'"
            >
              <span
                class="w-1.5 h-1.5 rounded-full flex-shrink-0"
                :class="!modelValue ? 'bg-blue-500' : 'bg-transparent'"
              />
              Tất cả thể loại
            </button>
          </li>

          <!-- Loading skeleton -->
          <template v-if="loading">
            <li v-for="n in 5" :key="n" class="px-3.5 py-2.5 animate-pulse">
              <div class="h-3 bg-stone-100 rounded-full" :style="`width: ${50 + n * 8}%`"/>
            </li>
          </template>

          <!-- Category items -->
          <template v-else>
            <li v-for="cat in results" :key="cat.id">
              <button
                type="button"
                @click="select(cat)"
                class="w-full text-left px-3.5 py-2 text-sm transition-colors flex items-center gap-2"
                :class="modelValue === cat.id
                  ? 'text-blue-600 bg-blue-50 font-medium'
                  : 'text-stone-600 hover:bg-stone-50'"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  :class="modelValue === cat.id ? 'bg-blue-500' : 'bg-transparent'"
                />
                {{ cat.name }}
              </button>
            </li>

            <!-- Empty -->
            <li v-if="results.length === 0" class="px-3.5 py-4 text-xs text-stone-400 text-center">
              Không tìm thấy thể loại
            </li>
          </template>

        </ul>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { getCategories } from '@/services/categoryService'

// ── Props & emits ─────────────────────────────────────────────
const props = defineProps({
  // Giá trị đang được chọn — là category id (string) hoặc null
  modelValue: { type: String, default: null },
})
const emit = defineEmits(['update:modelValue', 'change'])

// ── State ─────────────────────────────────────────────────────
const open        = ref(false)
const keyword     = ref('')
const loading     = ref(false)
const results     = ref([])
const dropdownRef = ref(null)
const searchInput = ref(null)

// Cache tên của category đang được chọn để hiển thị trên trigger button
const selectedName = ref('')

const selectedLabel = computed(() =>
  props.modelValue ? (selectedName.value || props.modelValue) : 'Tất cả thể loại'
)

// ── Fetch ─────────────────────────────────────────────────────
const fetchCategories = async (name = '') => {
  loading.value = true
  try {
    const res = await getCategories({ name: name.trim(), page: 0, size: 10, sort: 'ASC' })
    results.value = res.data.result.content ?? []
  } catch {
    results.value = []
  } finally {
    loading.value = false
  }
}

// ── Debounced search ──────────────────────────────────────────
let debounceTimer = null
const onSearchInput = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => fetchCategories(keyword.value), 300)
}

// ── Toggle ────────────────────────────────────────────────────
const toggleDropdown = async () => {
  open.value = !open.value
  if (open.value) {
    keyword.value = ''
    await fetchCategories()
    await nextTick()
    searchInput.value?.focus()
  }
}

// ── Select ────────────────────────────────────────────────────
const select = (cat) => {
  const newVal = cat ? cat.name : null   // ✅ đổi sang name
  selectedName.value = cat ? cat.name : ''
  emit('update:modelValue', newVal)
  emit('change', newVal)
  open.value = false
  keyword.value = ''
}

// ── Click outside ─────────────────────────────────────────────
const onClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    open.value = false
  }
}

// ── Init: nếu đã có sẵn modelValue thì load tên ──────────────
const initSelectedName = async () => {
  if (!props.modelValue) return
  try {
    // Tìm tên category khớp với id đang được chọn
    const res = await getCategories({ page: 0, size: 50, sort: 'ASC' })
    const all = res.data.result.content ?? []
    const found = all.find(c => c.id === props.modelValue)
    if (found) selectedName.value = found.name
  } catch { /* silent */ }
}

onMounted(async () => {
  document.addEventListener('mousedown', onClickOutside)
  await initSelectedName()
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onClickOutside)
  clearTimeout(debounceTimer)
})
</script>