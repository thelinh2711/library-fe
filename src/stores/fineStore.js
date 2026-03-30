// stores/fineStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import fineService from '@/services/fineService'

export const useFineStore = defineStore('fine', () => {
  const toast = useToast()

  // ── State ────────────────────────────────────────────────────────────────
  const fines        = ref([])
  const loading      = ref(false)
  const error        = ref(null)
  const totalElements = ref(0)
  const totalPages    = ref(1)
  const currentPage   = ref(0)

  // Filter — gửi thẳng lên BE, không filter ở FE nữa
  const statusFilter = ref('')      // '' | 'UNPAID' | 'PAID'
  const typeFilter   = ref('ALL')   // filter type vẫn giữ ở FE vì BE chưa có
  const search       = ref('')

  const selectedFine = ref(null)

  // ── Getters ──────────────────────────────────────────────────────────────
  const unpaidCount = computed(() =>
    fines.value.filter(f => f.paymentStatus === 'UNPAID').length
  )

  const stats = computed(() => ({
    unpaid:      fines.value.filter(f => f.paymentStatus === 'UNPAID').length,
    paid:        fines.value.filter(f => f.paymentStatus === 'PAID').length,
    total:       totalElements.value,
    totalAmount: fines.value
      .filter(f => f.paymentStatus === 'UNPAID')
      .reduce((s, f) => s + (f.amount ?? 0), 0),
  }))

  // Type filter vẫn xử lý ở FE
  const filteredFines = computed(() =>
    typeFilter.value === 'ALL'
      ? fines.value
      : fines.value.filter(f => f.type === typeFilter.value)
  )

  // ── Actions ──────────────────────────────────────────────────────────────
  async function fetchFines(page = 0) {
    loading.value = true
    error.value   = null
    currentPage.value = page
    try {
      const res  = await fineService.search({
        status:  statusFilter.value || undefined,
        keyword: search.value       || undefined,
        page,
        size: 20,
      })
      const result       = res.data?.result
      fines.value        = result?.content      ?? []
      totalElements.value = result?.totalElements ?? 0
      totalPages.value    = result?.totalPages    ?? 1
    } catch (err) {
      error.value = err?.response?.data?.message ?? 'Không tải được danh sách phiếu phạt'
    } finally {
      loading.value = false
    }
  }

  async function payFine(id) {
    try {
      await fineService.pay(id)
      const fine = fines.value.find(f => f.id === id)
      if (fine) {
        fine.paymentStatus = 'PAID'
        fine.paidAt        = new Date().toISOString()
      }
      selectedFine.value = null
      toast.success('Đã xác nhận thu tiền phạt thành công!')
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Xác nhận thất bại, thử lại!')
    }
  }

  function openDetail(fine)  { selectedFine.value = fine }
  function closeDetail()     { selectedFine.value = null  }

  function resetFilters() {
    statusFilter.value = ''
    typeFilter.value   = 'ALL'
    search.value       = ''
  }

  return {
    fines, loading, error,
    totalElements, totalPages, currentPage,
    statusFilter, typeFilter, search,
    selectedFine,
    unpaidCount, stats, filteredFines,
    fetchFines, payFine, openDetail, closeDetail, resetFilters,
  }
})