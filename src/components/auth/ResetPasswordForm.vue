<!-- src/components/auth/ResetPasswordForm.vue -->
<template>
  <div>

    <!-- Header icon -->
    <div class="flex justify-center mb-4">
      <div class="w-14 h-14 flex items-center justify-center bg-blue-50 rounded-2xl text-blue-600">
        <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <polyline points="9 12 11 14 15 10"/>
        </svg>
      </div>
    </div>

    <h2 class="text-2xl font-bold text-slate-900 tracking-tight mb-1.5 text-center">Đặt lại mật khẩu</h2>
    <p class="text-sm text-slate-400 leading-relaxed mb-5 text-center">
      Tạo mật khẩu mới. Đảm bảo mật khẩu đủ mạnh và dễ nhớ.
    </p>

    <!-- New password -->
    <div class="mb-4">
      <label class="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide">Mật khẩu mới</label>
      <div
        class="flex items-center border rounded-xl px-3.5 bg-white transition-all duration-200"
        :class="fieldErrors.newPassword
          ? 'border-red-400 ring-2 ring-red-100'
          : focusedField === 'new'
            ? 'border-blue-400 ring-2 ring-blue-100'
            : 'border-slate-200 hover:border-slate-300'"
      >
        <svg class="w-4 h-4 text-slate-400 flex-shrink-0 mr-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <input
          v-model="form.newPassword"
          :type="showNew ? 'text' : 'password'"
          placeholder="Tối thiểu 6 ký tự"
          class="flex-1 py-2.5 text-sm text-slate-800 bg-transparent outline-none placeholder-slate-300"
          @focus="focusedField = 'new'"
          @blur="focusedField = ''"
          @input="fieldErrors.newPassword = ''"
        />
        <button type="button" class="text-slate-400 hover:text-slate-600 transition-colors p-0.5" @click="showNew = !showNew">
          <svg v-if="!showNew" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        </button>
      </div>
      <p v-if="fieldErrors.newPassword" class="mt-1.5 text-xs text-red-500">
        {{ fieldErrors.newPassword }}
      </p>

    </div>

    <!-- Confirm password -->
    <div class="mb-4">
      <label class="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide">Xác nhận mật khẩu</label>
      <div
        class="flex items-center border rounded-xl px-3.5 bg-white transition-all duration-200"
        :class="fieldErrors.confirmPassword
          ? 'border-red-400 ring-2 ring-red-100'
          : focusedField === 'confirm'
            ? 'border-blue-400 ring-2 ring-blue-100'
            : 'border-slate-200 hover:border-slate-300'"
      >
        <svg class="w-4 h-4 text-slate-400 flex-shrink-0 mr-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M9 12l2 2 4-4"/>
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <input
          v-model="form.confirmPassword"
          :type="showConfirm ? 'text' : 'password'"
          placeholder="Nhập lại mật khẩu"
          class="flex-1 py-2.5 text-sm text-slate-800 bg-transparent outline-none placeholder-slate-300"
          @focus="focusedField = 'confirm'"
          @blur="focusedField = ''"
          @input="fieldErrors.confirmPassword = ''"
        />
        <button type="button" class="text-slate-400 hover:text-slate-600 transition-colors p-0.5" @click="showConfirm = !showConfirm">
          <svg v-if="!showConfirm" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        </button>
      </div>

      <!-- Match indicator -->
      <p
        v-if="form.confirmPassword && form.newPassword"
        class="flex items-center gap-1 mt-1.5 text-xs font-medium"
        :class="passwordsMatch ? 'text-green-600' : 'text-red-500'"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline v-if="passwordsMatch" points="20 6 9 17 4 12"/>
          <template v-else>
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </template>
        </svg>
        {{ passwordsMatch ? "Mật khẩu khớp" : "Mật khẩu chưa khớp" }}
      </p>
      <p v-if="fieldErrors.confirmPassword" class="mt-1.5 text-xs text-red-500">
        {{ fieldErrors.confirmPassword }}
      </p>
    </div>

    <!-- Alerts -->
    <div v-if="expiredMsg" class="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-3 mb-4">
      <svg class="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
      <p class="text-xs text-amber-700 leading-relaxed">{{ expiredMsg }}</p>
    </div>

    <div v-if="generalError" class="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-3.5 py-3 mb-4">
      <svg class="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
      <p class="text-xs text-red-600 leading-relaxed">{{ generalError }}</p>
    </div>

    <!-- Submit -->
    <button
      :disabled="loading"
      class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
      @click="handleSubmit"
    >
      <span v-if="loading" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
      <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
      {{ loading ? "Đang xử lý..." : "Đặt lại mật khẩu" }}
    </button>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { resetPasswordApi } from "@/services/forgotPasswordService";
import { useToast } from "vue-toastification";

const props = defineProps({ resetToken: String });
const emit  = defineEmits(["success", "token-expired"]);
const toast = useToast();

const form         = reactive({ newPassword: "", confirmPassword: "" });
const fieldErrors  = reactive({ newPassword: "", confirmPassword: "" });
const focusedField = ref("");
const showNew      = ref(false);
const showConfirm  = ref(false);
const loading      = ref(false);
const expiredMsg   = ref("");
const generalError = ref("");

const passwordsMatch = computed(
  () => form.newPassword && form.confirmPassword && form.newPassword === form.confirmPassword
);

const validate = () => {
  let ok = true;
  fieldErrors.newPassword = "";
  fieldErrors.confirmPassword = "";

  if (!form.newPassword) {
    fieldErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    ok = false;
  } else if (form.newPassword.length < 8) {        // 👈 đổi 6 → 8
    fieldErrors.newPassword = "Mật khẩu tối thiểu 8 ký tự";
    ok = false;
  }

  if (!form.confirmPassword) {
    fieldErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    ok = false;
  } else if (form.newPassword !== form.confirmPassword) {
    fieldErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    ok = false;
  }
  return ok;
};

const handleSubmit = async () => {
  expiredMsg.value   = "";
  generalError.value = "";
  if (!validate()) return;

  loading.value = true;
  try {
    const res = await resetPasswordApi(props.resetToken, form.newPassword, form.confirmPassword);
    const { code, message } = res.data;

    if (code === 1000) {
      toast.success("Đặt lại mật khẩu thành công!", {  // 👈
        timeout: 3000,
      });
      emit("success");
    } else {
      if (message?.includes("hết hạn")) {
        expiredMsg.value = message;
        setTimeout(() => emit("token-expired"), 1500);
      } else {
        generalError.value = message || "Có lỗi xảy ra";
      }
    }
  } catch (err) {
    const message = err.response?.data?.message;
    if (message?.includes("hết hạn")) {
      expiredMsg.value = message;
      setTimeout(() => emit("token-expired"), 1500);
    } else {
      generalError.value = message || "Có lỗi xảy ra, vui lòng thử lại";
    }
  } finally {
    loading.value = false;
  }
};
</script>