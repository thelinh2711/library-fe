<template>
  <div class="min-h-screen bg-[#F7F6F3] font-sans">

    <!-- ── Header ── -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200/80 shadow-sm">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center gap-8">

        <!-- Logo -->
        <div class="flex items-center gap-2.5 flex-shrink-0">
          <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 14V7l6-3 6 3v7" stroke="white" stroke-width="1.4" fill="none" stroke-linecap="round"/>
              <rect x="6.5" y="9.5" width="5" height="4.5" fill="white" opacity="0.85" rx="0.5"/>
            </svg>
          </div>
          <span class="text-[17px] font-bold text-stone-800 tracking-tight" style="font-family: 'Lora', serif">
            LibraSpace
          </span>
        </div>

        <!-- Nav -->
        <nav class="flex items-center gap-1">
          <router-link
            to="/student"
            class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-all"
            active-class="!text-blue-600 !bg-blue-50"
            exact
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
            Thư viện
          </router-link>

          <router-link
            to="/student/reservations"
            class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-all"
            active-class="!text-blue-600 !bg-blue-50"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
            Phiếu đăng kí
          </router-link>

          <router-link
            to="/student/borrowings"
            class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-all"
            active-class="!text-blue-600 !bg-blue-50"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            Sách đang mượn
          </router-link>
        </nav>

        <!-- Right: user -->
        <div class="ml-auto relative" ref="menuRef">
          <button
            @click="open = !open"
            class="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-stone-100 transition-all group"
          >
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-[11px] font-bold shadow-sm tracking-wide">
              {{ initial }}
            </div>
            <span class="text-sm font-medium text-stone-700 max-w-[160px] truncate">{{ name }}</span>
            <svg
              class="w-3.5 h-3.5 text-stone-400 transition-transform duration-200"
              :class="open && 'rotate-180'"
              fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          <!-- Dropdown -->
          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 scale-95 -translate-y-1"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="open"
              class="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-200/80 overflow-hidden z-50"
            >
              <div class="px-4 py-3 border-b border-stone-100">
                <p class="text-sm font-semibold text-stone-800 truncate">{{ name }}</p>
                <p class="text-xs text-stone-400 mt-0.5 truncate">{{ email }}</p>
              </div>
              <router-link
                to="/student/profile"
                @click="open = false"
                class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Hồ sơ của tôi
              </router-link>
              <div class="p-1.5">
                <button
                  @click="logout"
                  class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  Đăng xuất
                </button>
              </div>
            </div>
          </Transition>
        </div>

      </div>
    </header>

    <!-- ── Page content ── -->
    <main class="max-w-7xl mx-auto px-6 py-8">
      <router-view />
    </main>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useStudentStore } from '@/stores/studentStore'

const router        = useRouter()
const authStore     = useAuthStore()
const studentStore  = useStudentStore()
const menuRef       = ref(null)
const open          = ref(false)

// ── Lấy thông tin hiển thị ──────────────────────────────────────────────────
// Ưu tiên: profile từ API → fallback về authStore.user
const name = computed(() =>
  studentStore.profile?.fullName ||
  authStore.user?.fullName ||
  authStore.user?.username ||
  'Người dùng'
)

const email = computed(() =>
  studentStore.profile?.email ||
  authStore.user?.email ||
  ''
)

// Avatar: chữ đầu của từ đầu + chữ đầu của từ cuối trong tên
// VD: "Nguyễn Văn An" → "NA" | "Admin" → "A"
const initial = computed(() => {
  const parts = name.value.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  const first = parts[0].charAt(0).toUpperCase()
  const last  = parts[parts.length - 1].charAt(0).toUpperCase()
  return first + last
})

// ── Actions ─────────────────────────────────────────────────────────────────
function logout() {
  authStore.logout()
  router.push('/login')
}

function onClickOutside(e) {
  if (menuRef.value && !menuRef.value.contains(e.target)) open.value = false
}

// Fetch profile khi layout mount (chỉ gọi nếu chưa có)
onMounted(() => {
  if (!studentStore.profile) {
    studentStore.fetchMyProfile()
  }
  document.addEventListener('mousedown', onClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onClickOutside)
})
</script>