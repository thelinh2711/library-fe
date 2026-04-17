<!-- src/components/borrow/BorrowDetailModal.vue -->
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">

      <!-- Header -->
      <div class="bg-gradient-to-br from-slate-800 to-slate-700 px-6 py-5 flex items-start justify-between gap-3">
        <div>
          <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Phiếu mượn</p>
          <h2 class="text-white text-lg font-bold leading-snug">{{ record?.studentName }}</h2>
          <p class="text-slate-400 text-xs mt-0.5">{{ formatDate(record?.borrowedAt) }}</p>
        </div>
        <div class="flex items-center gap-2">
          <span
            class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
            :class="statusClass[record?.status]"
          >
            {{ statusLabel[record?.status] }}
          </span>
          <button @click="$emit('close')" class="text-slate-400 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition">
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="overflow-y-auto max-h-[65vh] px-6 py-5 space-y-5">

        <!-- Ghi chú thủ thư -->
        <div v-if="record?.staffNote" class="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm text-amber-700">
          {{ record.staffNote }}
        </div>

        <!-- Hint khi đang ở return mode -->
        <div v-if="returnMode" class="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5">
          <Info class="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
          <p class="text-xs text-indigo-600">Chọn những quyển muốn trả trong lần này, không cần trả hết cùng lúc.</p>
        </div>

        <!-- Danh sách sách -->
        <div>
          <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">
            Chi tiết sách ({{ record?.items?.length ?? 0 }} quyển)
          </p>

          <div class="space-y-3">
            <div
              v-for="item in record?.items"
              :key="item.id"
              class="rounded-xl border overflow-hidden transition-all"
              :class="[
                item.status === 'BORROWING' ? 'border-slate-200' : 'border-slate-100',
                returnMode && selectedItems[item.id] ? 'ring-2 ring-indigo-300 border-indigo-200' : '',
              ]"
            >
              <!-- Thông tin sách -->
              <div class="flex items-center gap-3 px-4 py-3 bg-slate-50">
                <!-- Checkbox chọn trả — chỉ hiện khi returnMode và item đang BORROWING -->
                <input
                  v-if="returnMode && item.status === 'BORROWING'"
                  type="checkbox"
                  v-model="selectedItems[item.id]"
                  class="w-4 h-4 accent-indigo-600 flex-shrink-0 cursor-pointer"
                />
                <BookOpen v-else class="h-4 w-4 text-slate-400 flex-shrink-0" />

                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-700 truncate">{{ item.bookTitle }}</p>
                  <div class="flex items-center gap-3 mt-0.5">
                    <span class="text-xs text-slate-400">
                      Hạn trả: <span :class="isPastDue(item) ? 'text-rose-500 font-semibold' : 'text-slate-600'">
                        {{ formatDateShort(item.dueDate) }}
                      </span>
                    </span>
                    <span v-if="item.returnDate" class="text-xs text-slate-400">
                      Đã trả: <span class="text-slate-600">{{ formatDateShort(item.returnDate) }}</span>
                    </span>
                  </div>
                </div>
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold flex-shrink-0"
                  :class="itemStatusClass[item.status]"
                >
                  {{ itemStatusLabel[item.status] }}
                </span>
              </div>

              <!-- Fines nếu có -->
              <div v-if="item.fines?.length" class="px-4 py-2 bg-rose-50/50 border-t border-rose-100">
                <div v-for="fine in item.fines" :key="fine.id" class="flex items-center justify-between text-xs py-0.5">
                  <span class="text-rose-600">
                    {{ fineTypeLabel[fine.type] }}
                    <span v-if="fine.note" class="text-rose-400 ml-1">— {{ fine.note }}</span>
                  </span>
                  <div class="flex items-center gap-2">
                    <span class="font-semibold text-rose-600">{{ formatPrice(fine.amount) }}</span>
                    <span
                      class="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                      :class="fine.paymentStatus === 'PAID'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-rose-100 text-rose-500'"
                    >
                      {{ fine.paymentStatus === 'PAID' ? 'Đã trả' : 'Chưa trả' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Form trả sách — chỉ hiện khi item được tích chọn -->
              <div
                v-if="item.status === 'BORROWING' && returnMode && selectedItems[item.id]"
                class="px-4 py-3 border-t border-indigo-100 bg-indigo-50/30"
              >
                <div class="flex items-center gap-2">
                  <select
                    v-model="returnForm[item.id].status"
                    class="flex-1 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-400 bg-white"
                  >
                    <option value="RETURNED">Trả bình thường</option>
                    <option value="DAMAGED">Làm hỏng</option>
                    <option value="LOST">Làm mất</option>
                  </select>

                  <!-- Mức độ hỏng — chỉ hiện khi DAMAGED hoặc LOST -->
                  <select
                    v-if="returnForm[item.id].status !== 'RETURNED'"
                    v-model="returnForm[item.id].damageLevel"
                    class="flex-1 border border-amber-200 rounded-lg px-2.5 py-1.5 text-xs text-amber-700 outline-none focus:border-amber-400 bg-amber-50"
                  >
                    <option value="">-- Mức độ --</option>
                    <option value="LIGHT">Hỏng nhẹ (×0.3)</option>
                    <option value="HEAVY">Hỏng nặng (×0.7)</option>
                    <option value="LOST">Mất sách (×1.5)</option>
                  </select>

                  <input
                    v-model="returnForm[item.id].note"
                    placeholder="Ghi chú..."
                    class="flex-1 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-600 placeholder-slate-400 outline-none focus:border-indigo-400 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <!-- Đếm số quyển đang chọn trả -->
        <p v-if="returnMode" class="text-xs text-slate-400">
          Đã chọn
          <span class="font-semibold text-indigo-600">{{ selectedCount }}</span>
          / {{ borrowingCount }} quyển
        </p>
        <div v-else />

        <div class="flex items-center gap-2">
          <!-- Nút chuyển sang mode trả -->
          <button
            v-if="!returnMode && hasBorrowingItems"
            @click="initReturnMode"
            class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-sm font-semibold transition"
          >
            <RotateCcw class="w-3.5 h-3.5" /> Xử lý trả sách
          </button>

          <!-- Huỷ mode trả -->
          <button
            v-if="returnMode"
            @click="returnMode = false"
            class="text-slate-500 hover:text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-xl border border-slate-200 transition"
          >
            Huỷ
          </button>

          <!-- Xác nhận trả -->
          <button
            v-if="returnMode"
            :disabled="submitting || !returnValid"
            @click="handleReturn"
            class="bg-slate-800 hover:bg-slate-700 disabled:opacity-60 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-150 flex items-center gap-2"
          >
            <Loader2 v-if="submitting" class="w-4 h-4 animate-spin" />
            Xác nhận trả ({{ selectedCount }})
          </button>

          <button
            v-if="!returnMode"
            @click="$emit('close')"
            class="bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
          >
            Đóng
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { X, BookOpen, RotateCcw, Loader2, Info } from "lucide-vue-next";

const props = defineProps({
  record:     { type: Object,  default: null  },
  submitting: { type: Boolean, default: false },
});
const emit = defineEmits(["close", "return"]);

const returnMode    = ref(false);
const returnForm    = ref({});   // { [itemId]: { status, damageLevel, note } }
const selectedItems = ref({});   // { [itemId]: boolean }

const hasBorrowingItems = computed(() =>
  props.record?.items?.some((i) => i.status === "BORROWING") ?? false
);

const borrowingCount = computed(() =>
  props.record?.items?.filter((i) => i.status === "BORROWING").length ?? 0
);

const selectedCount = computed(() =>
  Object.values(selectedItems.value).filter(Boolean).length
);

// Khởi tạo form trả — mặc định chưa tích chọn item nào
const initReturnMode = () => {
  returnForm.value    = {};
  selectedItems.value = {};
  for (const item of props.record?.items ?? []) {
    if (item.status === "BORROWING") {
      returnForm.value[item.id]    = { status: "RETURNED", damageLevel: "", note: "" };
      selectedItems.value[item.id] = false;
    }
  }
  returnMode.value = true;
};

// Reset khi record thay đổi
watch(() => props.record, () => { returnMode.value = false; });

// Hợp lệ khi: có ít nhất 1 item được chọn, và mọi item được chọn đều có damageLevel nếu cần
const returnValid = computed(() => {
  if (selectedCount.value === 0) return false;
  return Object.entries(selectedItems.value)
    .filter(([, checked]) => checked)
    .every(([id]) => {
      const val = returnForm.value[id];
      return val.status === "RETURNED" || !!val.damageLevel;
    });
});

const handleReturn = () => {
  const items = Object.entries(returnForm.value)
    .filter(([id]) => selectedItems.value[id])
    .map(([borrowItemId, val]) => ({
      borrowItemId,
      status:      val.status,
      // ✅ Chỉ gửi damageLevel khi không phải RETURNED, và bỏ nếu rỗng
      ...(val.status !== "RETURNED" && val.damageLevel
        ? { damageLevel: val.damageLevel }
        : {}),
      // ✅ Chỉ gửi note nếu có
      ...(val.note ? { note: val.note } : {}),
    }));
  emit("return", { items });
};

// ── Utils ────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const formatDateShort = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("vi-VN");
};

const formatPrice = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);

const isPastDue = (item) =>
  item.status === "BORROWING" && new Date(item.dueDate) < new Date();

const statusClass = {
  BORROWING: "bg-blue-50 text-blue-600",
  COMPLETED: "bg-emerald-50 text-emerald-600",
  OVERDUE:   "bg-rose-50 text-rose-500",
};
const statusLabel = {
  BORROWING: "Đang mượn",
  COMPLETED: "Hoàn tất",
  OVERDUE:   "Quá hạn",
};
const itemStatusClass = {
  BORROWING: "bg-blue-50 text-blue-600",
  RETURNED:  "bg-emerald-50 text-emerald-600",
  DAMAGED:   "bg-amber-50 text-amber-600",
  LOST:      "bg-rose-50 text-rose-500",
};
const itemStatusLabel = {
  BORROWING: "Đang mượn",
  RETURNED:  "Đã trả",
  DAMAGED:   "Hỏng",
  LOST:      "Mất",
};
const fineTypeLabel = {
  LATE:    "Phạt trả muộn",
  DAMAGED: "Phạt làm hỏng",
  LOST:    "Phạt làm mất",
};
</script>