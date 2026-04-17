<template>
  <div class="min-h-screen bg-[#F8F9FB] p-7">
    <FineDetailModal
      :fine="store.selectedFine"
      @close="store.closeDetail"
      @pay="store.payFine"
    />

    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-extrabold text-gray-800">Phiếu phạt</h1>
      <p class="text-sm text-gray-400 mt-1">Quản lý và xử lý các khoản phạt thư viện</p>
    </div>

    <!-- Stats -->
    <div class="flex flex-wrap gap-3.5 mb-6">
      <FineStatCard label="Chưa thanh toán"   :value="store.stats.unpaid"                sub="phiếu phạt" color="#EF4444" />
      <FineStatCard label="Đã thanh toán"      :value="store.stats.paid"                  sub="phiếu phạt" color="#22C55E" />
      <FineStatCard label="Tổng tiền còn lại"  :value="formatVND(store.stats.totalAmount)" sub="cần thu"    color="#6366F1" />
      <FineStatCard label="Tổng phiếu"         :value="store.totalElements"               sub="phiếu phạt" />
    </div>

    <!-- Filters -->
    <FineFilters
      v-model:statusFilter="store.statusFilter"
      v-model:typeFilter="store.typeFilter"
      v-model:search="store.search"
      :unpaid-count="store.unpaidCount"
      class="mb-4"
      @fetch="store.fetchFines(0)"
    />

    <!-- Loading -->
    <div v-if="store.loading" class="flex justify-center py-16">
      <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>

    <!-- Error -->
    <div
      v-else-if="store.error"
      class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-5 py-4"
    >
      {{ store.error }}
    </div>

    <!-- Table -->
    <FineTable
      v-else
      :fines="store.filteredFines"
      @view="store.openDetail"
      @pay="store.payFine"
    />

    <!-- Pagination -->
    <div class="mt-4 flex items-center justify-between text-xs text-gray-400">
      <span>Trang {{ store.currentPage + 1 }} / {{ store.totalPages }} · {{ store.totalElements }} phiếu</span>
      <div class="flex gap-2">
        <button
          :disabled="store.currentPage === 0"
          @click="store.fetchFines(store.currentPage - 1)"
          class="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
        >‹</button>
        <button
          :disabled="store.currentPage + 1 >= store.totalPages"
          @click="store.fetchFines(store.currentPage + 1)"
          class="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
        >›</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useFineStore } from '@/stores/fineStore'

import FineStatCard    from '@/components/admin/fine/FineStatCard.vue'
import FineFilters     from '@/components/admin/fine/FineFilters.vue'
import FineTable       from '@/components/admin/fine/FineTable.vue'
import FineDetailModal from '@/components/admin/fine/FineDetailModal.vue'

const store = useFineStore()

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)

onMounted(() => store.fetchFines(0))
onUnmounted(() => store.resetFilters())
</script>