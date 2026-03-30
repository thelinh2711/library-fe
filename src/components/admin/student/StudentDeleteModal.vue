<!-- src/components/student/StudentDeleteModal.vue -->
<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0"
                leave-active-class="transition duration-150" leave-to-class="opacity-0">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-sm" @click.self="$emit('close')">
        <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 scale-95 translate-y-1"
                    leave-active-class="transition duration-150" leave-to-class="opacity-0 scale-95 translate-y-1">
          <div v-if="show" class="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-7 text-center">

            <div class="w-12 h-12 mx-auto mb-4 rounded-2xl bg-rose-50 flex items-center justify-center">
              <Trash2 class="h-5 w-5 text-rose-500" />
            </div>

            <h2 class="text-base font-bold text-slate-800 mb-2">Xóa sinh viên?</h2>
            <p class="text-sm text-slate-500 leading-relaxed mb-6">
              Bạn sắp xóa <strong class="text-slate-700">{{ student?.fullName }}</strong>
              ({{ student?.studentCode }}). Hành động này không thể hoàn tác.
            </p>

            <div class="flex gap-3">
              <button
                class="flex-1 py-2 text-sm font-semibold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                @click="$emit('close')"
              >Hủy</button>
              <button
                :disabled="submitting"
                class="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition"
                @click="$emit('confirm')"
              >
                <Loader2 v-if="submitting" class="h-4 w-4 animate-spin" />
                Xóa
              </button>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { Trash2, Loader2 } from "lucide-vue-next";
defineProps({
  show:       { type: Boolean, default: false },
  student:    { type: Object,  default: null  },
  submitting: { type: Boolean, default: false },
});
defineEmits(["close", "confirm"]);
</script>