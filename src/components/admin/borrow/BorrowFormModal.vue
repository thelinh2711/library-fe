<!-- src/components/borrow/BorrowFormModal.vue -->
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 overflow-hidden">

      <!-- Header -->
      <div class="bg-gradient-to-br from-slate-800 to-slate-700 px-6 py-5 flex items-center justify-between gap-3">
        <div>
          <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Thủ thư</p>
          <h2 class="text-white text-lg font-bold leading-snug">Tạo phiếu mượn</h2>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Body -->
      <div class="overflow-y-auto max-h-[70vh] px-6 py-5 space-y-5">

        <!-- Sinh viên -->
        <div>
          <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">Sinh viên</p>
          <StudentPicker v-model="form.student" @select="onStudentSelect" />

          <!-- Reservations CONFIRMED của sinh viên này -->
          <transition name="slide-down">
            <div v-if="confirmedReservations.length > 0" class="mt-2 rounded-xl border border-emerald-200 bg-emerald-50/50 overflow-hidden">
              <div class="flex items-center gap-2 px-3 py-2 border-b border-emerald-100">
                <BookMarked class="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <p class="text-xs font-semibold text-emerald-700">
                  Sinh viên có {{ confirmedReservations.length }} đặt trước đang chờ
                </p>
              </div>
              <div class="divide-y divide-emerald-100">
                <div
                  v-for="r in confirmedReservations"
                  :key="r.id"
                  class="flex items-center gap-3 px-3 py-2.5 hover:bg-emerald-50 transition cursor-pointer"
                  :class="form.reservationId === r.id ? 'bg-emerald-100/60' : ''"
                  @click="toggleReservation(r)"
                >
                  <!-- Checkbox visual -->
                  <div
                    class="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition"
                    :class="form.reservationId === r.id
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-slate-300 bg-white'"
                  >
                    <Check v-if="form.reservationId === r.id" class="w-2.5 h-2.5" />
                  </div>

                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-slate-700 truncate">{{ r.bookTitle }}</p>
                    <p class="text-[10px] text-slate-400 mt-0.5">
                      Giữ chỗ đến
                      <span :class="isExpiringSoon(r.expiredAt) ? 'text-amber-500 font-semibold' : 'text-slate-500'">
                        {{ formatDateShort(r.expiredAt) }}
                      </span>
                    </p>
                  </div>

                  <!-- Nếu đang được chọn: hiện hạn trả ngay tại đây -->
                  <div v-if="form.reservationId === r.id" class="flex-shrink-0" @click.stop>
                    <input
                      type="date"
                      v-model="form.items[0].dueDate"
                      :min="minDate"
                      placeholder="Hạn trả"
                      class="w-28 border border-emerald-300 rounded-lg px-2 py-1 text-xs text-slate-700 outline-none focus:border-emerald-500 bg-white"
                    />
                  </div>

                  <span
                    v-if="isExpiringSoon(r.expiredAt) && form.reservationId !== r.id"
                    class="flex-shrink-0 text-[10px] font-semibold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-full"
                  >
                    Sắp hết hạn
                  </span>
                </div>
              </div>
            </div>
          </transition>

          <!-- Spinner khi đang load reservations -->
          <div v-if="resLoading" class="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <Loader2 class="w-3 h-3 animate-spin" /> Đang kiểm tra đặt trước...
          </div>
        </div>

        <!-- Danh sách sách mượn -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest">
              Sách mượn
              <span
                class="normal-case font-normal ml-1"
                :class="form.items.length >= 5 ? 'text-rose-400' : 'text-slate-300'"
              >
                ({{ form.items.length }}/5)
              </span>
            </p>
            <button
              type="button"
              :disabled="form.items.length >= 5"
              @click="addItem"
              class="inline-flex items-center gap-1 text-xs font-semibold text-indigo-500 hover:text-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <Plus class="w-3.5 h-3.5" /> Thêm sách
            </button>
          </div>

          <div class="space-y-2">
            <div v-for="(item, i) in form.items" :key="i">
              <!-- Item đầu tiên từ reservation: chỉ hiện tên sách, không cho xoá -->
              <div
                v-if="i === 0 && form.reservationId && item.bookId"
                class="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200"
              >
                <span class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-200 text-[10px] font-bold text-emerald-700">1</span>
                <BookMarked class="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                <p class="flex-1 text-sm font-medium text-emerald-700 truncate">{{ item.book?.title }}</p>
                <span class="text-[10px] text-emerald-500 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">Đặt trước</span>
              </div>

              <!-- Các item còn lại: dùng BookItemRow bình thường -->
              <BookItemRow
                v-else
                v-model="form.items[i]"
                :index="i"
                @remove="removeItem(i)"
              />
            </div>

            <div
              v-if="form.items.length === 0"
              class="flex flex-col items-center gap-1 py-8 text-slate-300 border-2 border-dashed border-slate-100 rounded-xl"
            >
              <BookOpen class="w-8 h-8" />
              <p class="text-xs">Chưa có sách nào — nhấn "Thêm sách"</p>
            </div>
          </div>
        </div>

        <!-- Ghi chú -->
        <div>
          <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">Ghi chú</p>
          <textarea
            v-model="form.staffNote"
            placeholder="Ghi chú tình trạng sách, dặn dò sinh viên..."
            rows="2"
            class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition resize-none"
          />
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <p v-if="validationError" class="text-xs text-rose-500">{{ validationError }}</p>
        <div class="flex gap-2 ml-auto">
          <button
            @click="$emit('close')"
            class="text-slate-500 hover:text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition"
          >
            Huỷ
          </button>
          <button
            @click="handleSave"
            :disabled="submitting || !!validationError"
            class="bg-slate-800 hover:bg-slate-700 disabled:opacity-60 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-150 flex items-center gap-2"
          >
            <Loader2 v-if="submitting" class="w-4 h-4 animate-spin" />
            Tạo phiếu mượn
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { X, Plus, BookOpen, BookMarked, Check, Loader2 } from "lucide-vue-next";
import StudentPicker from "@/components/admin/borrow/StudentPicker.vue";
import BookItemRow   from "@/components/admin/borrow/BookItemRow.vue";
import api from "@/services/axiosClient";

const props = defineProps({
  submitting: { type: Boolean, default: false },
});
const emit = defineEmits(["close", "save"]);

// ── State ─────────────────────────────────────────────────────
const form = ref({
  student:       null,
  reservationId: null,
  staffNote:     "",
  items:         [],
});

const confirmedReservations = ref([]);
const resLoading = ref(false);

// ── Khi chọn sinh viên: fetch reservation CONFIRMED của họ ────
const onStudentSelect = async (student) => {
  // Reset reservation khi đổi sinh viên
  form.value.reservationId = null;
  form.value.items = form.value.items.filter((_, i) => i !== 0 || !form.value.reservationId);
  confirmedReservations.value = [];

  if (!student) return;

  resLoading.value = true;
  try {
    const res = await api.get(`/reservations/student/${student.id}`, {
      params: { status: "CONFIRMED", page: 0, size: 10 },
    });
    confirmedReservations.value = res.data.result.content ?? [];
  } catch {
    confirmedReservations.value = [];
  } finally {
    resLoading.value = false;
  }
};

// ── Chọn / bỏ chọn reservation ────────────────────────────────
const toggleReservation = (r) => {
  if (form.value.reservationId === r.id) {
    // Bỏ chọn: xoá item đầu tiên nếu là từ reservation
    form.value.reservationId = null;
    if (form.value.items[0]?.bookId === r.bookId) {
      form.value.items.splice(0, 1);
    }
  } else {
    // Chọn: gán reservationId và thêm item vào đầu danh sách
    form.value.reservationId = r.id;
    const reservedItem = { book: { id: r.bookId, title: r.bookTitle }, bookId: r.bookId, dueDate: "" };
    // Nếu đã có item đặt trước trước đó thì thay, không thì thêm vào đầu
    const hadPrev = form.value.items[0]?._fromReservation;
    if (hadPrev) {
      form.value.items[0] = { ...reservedItem, _fromReservation: true };
    } else {
      form.value.items.unshift({ ...reservedItem, _fromReservation: true });
    }
  }
};

// ── Thêm / xoá item bình thường ───────────────────────────────
const addItem = () => {
  if (form.value.items.length >= 5) return;
  form.value.items.push({ book: null, bookId: null, dueDate: "" });
};

const removeItem = (i) => {
  form.value.items.splice(i, 1);
};

// ── Validation ────────────────────────────────────────────────
const validationError = computed(() => {
  if (!form.value.student)           return "Vui lòng chọn sinh viên";
  if (form.value.items.length === 0) return "Thêm ít nhất 1 quyển sách";
  for (const item of form.value.items) {
    if (!item.bookId)  return "Có sách chưa được chọn";
    if (!item.dueDate) return "Có sách chưa có hạn trả";
  }
  return "";
});

// ── Save ──────────────────────────────────────────────────────
const handleSave = () => {
  if (validationError.value) return;
  emit("save", {
    studentId:     form.value.student.id,
    reservationId: form.value.reservationId ?? null,
    staffNote:     form.value.staffNote || null,
    items:         form.value.items.map(({ bookId, dueDate }) => ({ bookId, dueDate })),
  });
};

// ── Utils ─────────────────────────────────────────────────────
const minDate = new Date(Date.now() + 86400000).toISOString().split("T")[0];

const formatDateShort = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("vi-VN");
};

const isExpiringSoon = (iso) => {
  const diff = new Date(iso) - Date.now();
  return diff > 0 && diff < 24 * 60 * 60 * 1000;
};
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from,
.slide-down-leave-to     { opacity: 0; transform: translateY(-6px); }
</style>