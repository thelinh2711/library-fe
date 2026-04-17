<!-- src/components/auth/ForgotPasswordForm.vue -->
<template>
  <div>

    <!-- Header -->
    <div class="flex items-center gap-3 mb-5">
      <button
        type="button"
        class="w-9 h-9 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-xl transition-all flex-shrink-0"
        @click="$emit('back')"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
      </button>
      <div class="w-11 h-11 flex items-center justify-center bg-blue-50 rounded-2xl text-blue-600 flex-shrink-0">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>
    </div>

    <h2 class="text-2xl font-bold text-slate-900 tracking-tight mb-1.5">Quên mật khẩu?</h2>
    <p class="text-sm text-slate-400 leading-relaxed mb-5">
      Nhập email đã đăng ký. Chúng tôi sẽ gửi mã OTP để xác minh danh tính của bạn.
    </p>

    <!-- Email input -->
    <div class="mb-4">
      <label class="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide">
        Địa chỉ email
      </label>
      <div
        class="flex items-center border rounded-xl px-3.5 bg-white transition-all duration-200"
        :class="errorMsg
          ? 'border-red-400 ring-2 ring-red-100'
          : focused
            ? 'border-blue-400 ring-2 ring-blue-100'
            : 'border-slate-200 hover:border-slate-300'"
      >
        <svg class="w-4 h-4 text-slate-400 flex-shrink-0 mr-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        <input
          v-model="email"
          type="email"
          placeholder="example@email.com"
          class="flex-1 py-2.5 text-sm text-slate-800 bg-transparent outline-none placeholder-slate-300"
          @focus="focused = true"
          @blur="focused = false"
          @keyup.enter="handleSubmit"
        />
      </div>
      <p v-if="errorMsg" class="flex items-center gap-1.5 mt-1.5 text-xs text-red-500">
        <svg class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {{ errorMsg }}
      </p>
    </div>

    <!-- Rate limit alert -->
    <div v-if="rateLimitMsg" class="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-3 mb-4">
      <svg class="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      <p class="text-xs text-amber-700 leading-relaxed">{{ rateLimitMsg }}</p>
    </div>

    <!-- Submit -->
    <button
      :disabled="loading || !!rateLimitMsg"
      class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
      @click="handleSubmit"
    >
      <span v-if="loading" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
      <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
      {{ loading ? "Đang gửi..." : "Gửi mã OTP" }}
    </button>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { sendOtpApi } from "@/services/forgotPasswordService";

const emit = defineEmits(["back", "otp-sent"]);

const email     = ref("");
const loading   = ref(false);
const errorMsg  = ref("");
const rateLimitMsg = ref("");
const focused   = ref(false);

const handleSubmit = async () => {
  errorMsg.value     = "";
  rateLimitMsg.value = "";

  if (!email.value) {
    errorMsg.value = "Vui lòng nhập địa chỉ email";
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errorMsg.value = "Địa chỉ email không hợp lệ";
    return;
  }

  loading.value = true;
  try {
    const res = await sendOtpApi(email.value);
    const { code, message, result } = res.data;  // 👈 đổi theo format BE

    if (code === 1000) {                          // 👈 thay vì res.data.success
      emit("otp-sent", email.value);
    } else {
      if (message?.includes("quá 3 lần")) rateLimitMsg.value = message;
      else errorMsg.value = message || "Có lỗi xảy ra";
    }
  } catch (err) {
    const message = err.response?.data?.message;
    if (message?.includes("quá 3 lần")) rateLimitMsg.value = message;
    else errorMsg.value = message || "Có lỗi xảy ra, vui lòng thử lại";
  } finally {
    loading.value = false;
  }
};
</script>