<template>
  <AuthLayout>
    <LoginForm
      v-if="currentStep === 'login'"
      :loading="loading"
      :error="error"
      @submit="handleLogin"
      @forgot-password="currentStep = 'forgot'"
      @login-google="handleLoginGoogle"
    />

    <ForgotPasswordForm
      v-else-if="currentStep === 'forgot'"
      @back="currentStep = 'login'"
      @otp-sent="handleOtpSent"
    />

    <VerifyOtpForm
      v-else-if="currentStep === 'verify'"
      :email="forgotEmail"
      @back="currentStep = 'forgot'"
      @verified="handleVerified"
    />

    <ResetPasswordForm
      v-else-if="currentStep === 'reset'"
      :reset-token="resetToken"
      @success="handleResetSuccess"
      @token-expired="currentStep = 'verify'"
    />
  </AuthLayout>
</template>

<script setup>
import { ref } from "vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import LoginForm from "@/components/auth/LoginForm.vue";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm.vue";
import VerifyOtpForm from "@/components/auth/VerifyOtpForm.vue";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm.vue";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();

const currentStep = ref("login");
const loading     = ref(false);
const error       = ref("");
const forgotEmail = ref("");
const resetToken  = ref("");

const handleLogin = async (data) => {
  try {
    loading.value = true;
    error.value   = "";
    await authStore.login(data.email, data.password);
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      err.message ||
      "Đăng nhập thất bại";
  } finally {
    loading.value = false;
  }
};

const handleLoginGoogle = () => {
  window.location.href = `${import.meta.env.VITE_OAUTH_URL}/oauth2/authorization/google`
};

const handleOtpSent = (email) => {
  forgotEmail.value = email;
  currentStep.value = "verify";
};

const handleVerified = (token) => {
  resetToken.value  = token;
  currentStep.value = "reset";
};

const handleResetSuccess = () => {
  currentStep.value = "login";
  error.value = "";
};
</script>