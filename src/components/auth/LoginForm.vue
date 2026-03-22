<template>
  <form @submit.prevent="onSubmit">

    <h2 class="text-2xl font-semibold text-blue-700 mb-2">
      Đăng nhập
    </h2>

    <p class="text-sm text-gray-400 mb-6">
      Chào mừng đến với hệ thống thư viện trực tuyến
    </p>

    <BaseInput
      v-model="form.email"
      label="Tên tài khoản *"
      type="text"
      :error="formErrors.email"
    />

    <BaseInput
      v-model="form.password"
      label="Mật khẩu *"
      type="password"
      :error="formErrors.password"
    />

    <!-- Options -->
    <div class="flex justify-between items-center text-sm mb-6">
      <label class="flex items-center gap-2">
        <input type="checkbox" />
        Nhớ tài khoản
      </label>

      <a href="#" class="text-blue-500 hover:underline">
        Quên mật khẩu
      </a>
    </div>

    <button
      type="submit"
      :disabled="loading"
      class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
    >
      {{ loading ? "Đang đăng nhập..." : "Đăng nhập" }}
    </button>

    <p v-if="error" class="text-red-500 mt-4 text-center">
      {{ error }}
    </p>

  </form>
</template>
<script setup>
import { reactive } from "vue";
import BaseInput from "@/components/common/BaseInput.vue";

const emit = defineEmits(["submit"]);

const props = defineProps({
  error: String,
  loading: Boolean,
});

const form = reactive({
  email: "",
  password: "",
});

const formErrors = reactive({
  email: "",
  password: "",
});

const validate = () => {
  let valid = true;

  formErrors.email = "";
  formErrors.password = "";

  if (!form.email) {
    formErrors.email = "Email không được để trống";
    valid = false;
  }

  if (!form.password) {
    formErrors.password = "Password không được để trống";
    valid = false;
  }

  return valid;
};

const onSubmit = () => {
  if (!validate()) return;

  emit("submit", { ...form });
};
</script>