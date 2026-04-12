<template>
  <div class="min-h-screen flex items-center justify-center">
    <p class="text-slate-400 text-sm">Đang đăng nhập...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore, parseJwt } from '@/stores/authStore'

const route     = useRoute()
const authStore = useAuthStore()

onMounted(() => {
  const token = route.query.token

  if (token) {
    authStore.accessToken = token
    localStorage.setItem('accessToken', token)

    const decoded = parseJwt(token)
    authStore.user = decoded
    authStore.redirectByRole(decoded?.role)
  } else {
    window.location.href = '/login?error=unauthorized'
  }
})
</script>