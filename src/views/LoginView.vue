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
</script>