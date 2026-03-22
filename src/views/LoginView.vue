<template>
  <AuthLayout>
    <LoginForm
      :loading="loading"
      :error="error"
      @submit="handleLogin"
    />
  </AuthLayout>
</template>

<script setup>
import { ref } from "vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import LoginForm from "@/components/auth/LoginForm.vue";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore(); 
const loading = ref(false);
const error = ref("");

const handleLogin = async (data) => {
  try {
    loading.value = true;
    error.value = "";

    console.log("Login data:", data);

    await authStore.login(data.email, data.password);

  } catch (err) {
  console.error("❌ FULL ERROR:", err);
  console.error("❌ RESPONSE:", err.response);

  error.value =
    err.response?.data?.message ||
    err.message ||
    "Đăng nhập thất bại";
  } finally {
    loading.value = false;
  }
};
</script>