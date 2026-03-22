<template>
  <div class="mb-4">
    <label class="block mb-1">{{ label }}</label>

    <input
      :type="type"
      :placeholder="placeholder"
      v-model="model"
      :class="[
        'w-full px-4 py-2 border rounded-lg focus:outline-none',
        error ? 'border-red-500' : 'focus:ring'
      ]"
    />

    <p v-if="error" class="text-red-500 text-sm mt-1">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
const model = defineModel();

defineProps({
  label: String,
  type: {
    type: String,
    default: "text",
  },
  placeholder: String,
  error: String,
});
</script>