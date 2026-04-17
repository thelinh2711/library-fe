<template>
  <div class="flex justify-between items-center border-b border-gray-50 pb-2.5">
    <span class="text-xs text-gray-400">{{ label }}</span>
    <span class="text-xs text-gray-700 font-medium max-w-[60%] text-right">
      <slot>{{ value }}</slot>
    </span>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
})
</script>