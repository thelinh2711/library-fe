<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-1 flex-1 min-w-[160px]">
    <span class="text-xs text-gray-400 font-medium">{{ label }}</span>
    <span class="text-2xl font-extrabold" :style="{ color: color || '#1F2937' }">{{ value }}</span>
    <span v-if="sub" class="text-[11px] text-gray-300">{{ sub }}</span>
  </div>
</template>
 
<script setup>
defineProps({
  label: String,
  value: [String, Number],
  sub: String,
  color: String,
})
</script>