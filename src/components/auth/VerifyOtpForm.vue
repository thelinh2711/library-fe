<!-- src/components/auth/VerifyOtpForm.vue -->
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
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>
    </div>

    <h2 class="text-2xl font-bold text-slate-900 tracking-tight mb-1.5">Xác minh OTP</h2>
    <p class="text-sm text-slate-400 leading-relaxed mb-5">
      Nhập mã 6 chữ số đã được gửi đến<br>
      <span class="font-semibold text-blue-600">{{ email }}</span>
    </p>

    <!-- OTP boxes -->
    <div class="flex gap-2 justify-center mb-5">
      <input
        v-for="(_, i) in 6"
        :key="i"
        :ref="el => { if (el) inputRefs[i] = el }"
        v-model="otpDigits[i]"
        type="text"
        inputmode="numeric"
        maxlength="1"
        style="height: 52px;"
        class="w-11 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all duration-150 caret-transparent"
        :class="lockMsg
          ? 'border-red-300 bg-red-50 text-red-600'
          : verifiedSuccess
            ? 'border-green-300 bg-green-50 text-green-600'
            : otpDigits[i]
              ? 'border-blue-300 bg-blue-50 text-blue-700'
              : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'"
        @input="handleInput(i, $event)"
        @keydown="handleKeydown(i, $event)"
        @paste="handlePaste($event)"
        @focus="inputRefs[i]?.select()"
      />
    </div>

    <!-- Alerts -->
    <transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition-all duration-150"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div v-if="errorMsg" class="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-3.5 py-3 mb-4">
        <svg class="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <p class="text-xs text-red-600 leading-relaxed">{{ errorMsg }}</p>
      </div>
    </transition>

    <transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition-all duration-150"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div v-if="lockMsg" class="flex items-start gap-2.5 bg-violet-50 border border-violet-200 rounded-xl px-3.5 py-3 mb-4">
        <svg class="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <p class="text-xs text-violet-700 leading-relaxed">{{ lockMsg }}</p>
      </div>
    </transition>

    <transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition-all duration-150"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div v-if="expiredMsg" class="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-3 mb-4">
        <svg class="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <p class="text-xs text-amber-700 leading-relaxed">{{ expiredMsg }}</p>
      </div>
    </transition>

    <!-- Submit -->
    <button
      :disabled="loading || otpValue.length < 6 || !!lockMsg"
      class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 mb-4"
      @click="handleVerify"
    >
      <span v-if="loading" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
      <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      {{ loading ? "Đang xác minh..." : "Xác minh OTP" }}
    </button>

    <!-- Resend -->
    <div class="flex items-center justify-center gap-1.5 text-sm">
      <span class="text-slate-400">Không nhận được mã?</span>
      <button
        :disabled="resendCooldown > 0 || loading"
        class="font-semibold transition-colors"
        :class="resendCooldown > 0
          ? 'text-slate-400 cursor-default'
          : 'text-blue-500 hover:text-blue-700 hover:underline'"
        @click="handleResend"
      >
        <template v-if="resendCooldown > 0">Gửi lại sau ({{ resendCooldown }}s)</template>
        <template v-else>Gửi lại OTP</template>
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { verifyOtpApi, sendOtpApi } from "@/services/forgotPasswordService";

const props = defineProps({ email: String });
const emit  = defineEmits(["back", "verified"]);

const otpDigits      = ref(["", "", "", "", "", ""]);
const inputRefs      = ref([]);
const loading        = ref(false);
const errorMsg       = ref("");
const lockMsg        = ref("");
const expiredMsg     = ref("");
const verifiedSuccess = ref(false);
const resendCooldown = ref(0);
let cooldownTimer    = null;

const otpValue = computed(() => otpDigits.value.join(""));

onMounted(() => {
  setTimeout(() => inputRefs.value[0]?.focus(), 50);
  startCooldown(60);
});
onUnmounted(() => clearInterval(cooldownTimer));

const startCooldown = (seconds) => {
  resendCooldown.value = seconds;
  clearInterval(cooldownTimer);
  cooldownTimer = setInterval(() => {
    resendCooldown.value--;
    if (resendCooldown.value <= 0) clearInterval(cooldownTimer);
  }, 1000);
};

const clearAlerts = () => {
  errorMsg.value  = "";
  expiredMsg.value = "";
};

const handleInput = (i, e) => {
  clearAlerts();
  const raw = e.target.value.replace(/\D/g, "");
  
  if (!raw) {
    otpDigits.value[i] = "";
    return;
  }

  // Lấy ký tự mới nhất (loại bỏ ký tự cũ đang có ở ô này)
  const current = otpDigits.value[i];
  const newChar = raw.replace(current, "").slice(-1) || raw.slice(-1);
  
  otpDigits.value[i] = newChar;
  e.target.value = newChar; // 👈 reset lại input để tránh double char

  if (newChar && i < 5) inputRefs.value[i + 1]?.focus();
};

const handleKeydown = (i, e) => {
  if (e.key === "Backspace" && !otpDigits.value[i] && i > 0) {
    otpDigits.value[i - 1] = "";
    inputRefs.value[i - 1]?.focus();
  }
  if (e.key === "ArrowLeft"  && i > 0) inputRefs.value[i - 1]?.focus();
  if (e.key === "ArrowRight" && i < 5) inputRefs.value[i + 1]?.focus();
};

const handlePaste = (e) => {
  e.preventDefault();
  const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
  pasted.split("").forEach((d, i) => { otpDigits.value[i] = d; });
  inputRefs.value[Math.min(pasted.length, 5)]?.focus();
};

const resetOtpBoxes = () => {
  otpDigits.value = ["", "", "", "", "", ""];
  nextTick(() => inputRefs.value[0]?.focus());
};

const handleVerify = async () => {
  clearAlerts();
  if (otpValue.value.length < 6) return;

  loading.value = true;
  try {
    const res = await verifyOtpApi(props.email, otpValue.value);
    console.log("VERIFY RESPONSE:", res.data); // 👈
    
    const { code, message, result } = res.data;

    if (code === 1000) {
      console.log("✅ VERIFY OK, resetToken:", result?.resetToken); // 👈
      verifiedSuccess.value = true;
      setTimeout(() => emit("verified", result?.resetToken), 300);
    } else {
      console.log("❌ VERIFY FAIL, message:", message); // 👈
      if (message?.includes("khóa")) {
        lockMsg.value = message;
      } else if (message?.includes("hết hạn")) {
        expiredMsg.value = message;
        resetOtpBoxes();
      } else {
        errorMsg.value = message || "Có lỗi xảy ra";
        resetOtpBoxes();
      }
    }
  } catch (err) {
    console.log("💥 VERIFY ERROR:", err.response?.data); // 👈
    const message = err.response?.data?.message;
    if (message?.includes("khóa")) lockMsg.value = message;
    else errorMsg.value = message || "Có lỗi xảy ra, vui lòng thử lại";
  } finally {
    loading.value = false;
  }
};

const handleResend = async () => {
  if (resendCooldown.value > 0) return;
  clearAlerts();
  lockMsg.value = "";

  try {
    await sendOtpApi(props.email);
    startCooldown(60);
    resetOtpBoxes();
  } catch {
    errorMsg.value = "Gửi lại thất bại, thử lại sau";
  }
};
</script>