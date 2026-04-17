<template>
  <div class="max-w-5xl mx-auto">

    <!-- Page title -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-stone-800" style="font-family: 'Lora', serif">Hồ sơ của tôi</h1>
      <p class="text-sm text-stone-400 mt-1">Xem thông tin cá nhân và cài đặt tài khoản</p>
    </div>

    <!-- Loading -->
    <div v-if="studentStore.profileLoading" class="flex items-center justify-center py-32">
      <div class="flex flex-col items-center gap-4">
        <div class="w-10 h-10 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin"></div>
        <p class="text-sm text-stone-400">Đang tải thông tin...</p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="studentStore.profileError" class="flex items-center justify-center py-32">
      <div class="flex flex-col items-center gap-3 text-center">
        <div class="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
          <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <p class="text-sm font-medium text-stone-600">{{ studentStore.profileError }}</p>
        <button @click="studentStore.fetchMyProfile()" class="text-sm text-blue-600 hover:underline">Thử lại</button>
      </div>
    </div>

    <template v-else-if="profile">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- ── Left: Avatar card ─────────────────────────────────────────── -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
            <div class="h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-violet-600"></div>
            <div class="px-6 pb-6">
              <div class="-mt-10 mb-4">
                <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold shadow-lg ring-4 ring-white tracking-wide">
                  {{ initial }}
                </div>
              </div>

              <h2 class="text-lg font-bold text-stone-800 leading-tight">{{ profile.fullName }}</h2>
              <p class="text-sm text-stone-400 mt-0.5">{{ profile.email }}</p>

              <div class="mt-4">
                <span
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
                  :class="profile.status === 'ACTIVE'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-red-50 text-red-600 border-red-200'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="profile.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'"></span>
                  {{ profile.status === 'ACTIVE' ? 'Đang hoạt động' : 'Bị khóa' }}
                </span>
              </div>

              <div class="mt-5 space-y-3">
                <div class="flex items-center gap-2.5 text-sm">
                  <div class="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"/>
                    </svg>
                  </div>
                  <span class="text-stone-500">MSSV: <span class="font-semibold text-stone-700">{{ profile.studentCode }}</span></span>
                </div>
                <div class="flex items-center gap-2.5 text-sm">
                  <div class="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                    <svg class="w-3.5 h-3.5 text-violet-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"/>
                    </svg>
                  </div>
                  <span class="text-stone-500 truncate">{{ profile.faculty }}</span>
                </div>
                <div class="flex items-center gap-2.5 text-sm">
                  <div class="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <svg class="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
                    </svg>
                  </div>
                  <span class="text-stone-500">Khoá <span class="font-semibold text-stone-700">{{ profile.courseYear }}</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Right ─────────────────────────────────────────────────────── -->
        <div class="lg:col-span-2 flex flex-col gap-6">

          <!-- Thông tin chi tiết -->
          <div class="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6">
            <h3 class="text-base font-bold text-stone-800 mb-5 flex items-center gap-2">
              <svg class="w-[18px] h-[18px] text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
              </svg>
              Thông tin cá nhân
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-stone-400 uppercase tracking-wide">Họ và tên</span>
                <span class="text-sm font-medium text-stone-700">{{ profile.fullName || '—' }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-stone-400 uppercase tracking-wide">Email</span>
                <span class="text-sm font-medium text-stone-700">{{ profile.email || '—' }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-stone-400 uppercase tracking-wide">Mã sinh viên</span>
                <span class="text-sm font-medium text-stone-700">{{ profile.studentCode || '—' }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-stone-400 uppercase tracking-wide">Lớp</span>
                <span class="text-sm font-medium text-stone-700">{{ profile.className || '—' }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-stone-400 uppercase tracking-wide">Khoa</span>
                <span class="text-sm font-medium text-stone-700">{{ profile.faculty || '—' }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-stone-400 uppercase tracking-wide">Khoá học</span>
                <span class="text-sm font-medium text-stone-700">{{ profile.courseYear || '—' }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-stone-400 uppercase tracking-wide">Ngày sinh</span>
                <span class="text-sm font-medium text-stone-700">{{ formatDate(profile.dateOfBirth) }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-stone-400 uppercase tracking-wide">Giới tính</span>
                <span class="text-sm font-medium text-stone-700">{{ profile.gender || '—' }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-stone-400 uppercase tracking-wide">Số điện thoại</span>
                <span class="text-sm font-medium text-stone-700">{{ profile.phone || '—' }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-stone-400 uppercase tracking-wide">Địa chỉ</span>
                <span class="text-sm font-medium text-stone-700">{{ profile.address || '—' }}</span>
              </div>
            </div>
          </div>

          <!-- Đổi mật khẩu -->
          <div class="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6">
            <h3 class="text-base font-bold text-stone-800 mb-1 flex items-center gap-2">
              <svg class="w-[18px] h-[18px] text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
              </svg>
              Đổi mật khẩu
            </h3>
            <p class="text-xs text-stone-400 mb-5">Mật khẩu phải có ít nhất 8 ký tự</p>

            <form @submit.prevent="handleChangePassword" class="space-y-4">

              <!-- Mật khẩu hiện tại -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-stone-600">Mật khẩu hiện tại</label>
                <div class="relative">
                  <input :type="showPw.old ? 'text' : 'password'" v-model="pwForm.oldPassword"
                    placeholder="Nhập mật khẩu hiện tại"
                    class="w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm outline-none transition-all"
                    :class="pwErrors.oldPassword ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100' : 'border-stone-200 bg-stone-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white'"
                  />
                  <button type="button" @click="showPw.old = !showPw.old" class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors">
                    <svg v-if="!showPw.old" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
                  </button>
                </div>
                <p v-if="pwErrors.oldPassword" class="text-xs text-red-500">{{ pwErrors.oldPassword }}</p>
              </div>

              <!-- Mật khẩu mới -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-stone-600">Mật khẩu mới</label>
                <div class="relative">
                  <input :type="showPw.new ? 'text' : 'password'" v-model="pwForm.newPassword"
                    placeholder="Tối thiểu 8 ký tự"
                    class="w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm outline-none transition-all"
                    :class="pwErrors.newPassword ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100' : 'border-stone-200 bg-stone-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white'"
                  />
                  <button type="button" @click="showPw.new = !showPw.new" class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors">
                    <svg v-if="!showPw.new" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
                  </button>
                </div>
                <p v-if="pwErrors.newPassword" class="text-xs text-red-500">{{ pwErrors.newPassword }}</p>
              </div>

              <!-- Xác nhận mật khẩu -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-stone-600">Xác nhận mật khẩu mới</label>
                <div class="relative">
                  <input :type="showPw.confirm ? 'text' : 'password'" v-model="pwForm.confirmPassword"
                    placeholder="Nhập lại mật khẩu mới"
                    class="w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm outline-none transition-all"
                    :class="pwErrors.confirmPassword ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100' : 'border-stone-200 bg-stone-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white'"
                  />
                  <button type="button" @click="showPw.confirm = !showPw.confirm" class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors">
                    <svg v-if="!showPw.confirm" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
                  </button>
                </div>
                <p v-if="pwErrors.confirmPassword" class="text-xs text-red-500">{{ pwErrors.confirmPassword }}</p>
              </div>

              <div class="flex justify-end pt-1">
                <button type="submit" :disabled="studentStore.pwLoading"
                  class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-blue-200"
                >
                  <svg v-if="studentStore.pwLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ studentStore.pwLoading ? 'Đang lưu...' : 'Cập nhật mật khẩu' }}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, reactive, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useStudentStore } from '@/stores/studentStore'

const toast        = useToast()
const studentStore = useStudentStore()
const profile      = computed(() => studentStore.profile)

// Avatar: chữ cái đầu của từ ĐẦU + từ CUỐI trong họ tên
// VD: "Nguyễn Trường Giang" → "NG"
const initial = computed(() => {
  const name = profile.value?.fullName?.trim()
  if (!name) return 'U'
  const parts = name.split(' ').filter(Boolean)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
})

function formatDate(d) {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

// ─── Show/hide mật khẩu ──────────────────────────────────────────────────────
const showPw = reactive({ old: false, new: false, confirm: false })

// ─── Form đổi mật khẩu ───────────────────────────────────────────────────────
const pwForm   = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })
const pwErrors = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })

function resetForm() {
  pwForm.oldPassword = pwForm.newPassword = pwForm.confirmPassword = ''
  pwErrors.oldPassword = pwErrors.newPassword = pwErrors.confirmPassword = ''
  showPw.old = showPw.new = showPw.confirm = false
}

function validate() {
  let ok = true
  pwErrors.oldPassword = pwErrors.newPassword = pwErrors.confirmPassword = ''

  if (!pwForm.oldPassword)                { pwErrors.oldPassword = 'Vui lòng nhập mật khẩu hiện tại'; ok = false }
  else if (pwForm.oldPassword.length < 8)  { pwErrors.oldPassword = 'Tối thiểu 8 ký tự'; ok = false }

  if (!pwForm.newPassword)                { pwErrors.newPassword = 'Vui lòng nhập mật khẩu mới'; ok = false }
  else if (pwForm.newPassword.length < 8)  { pwErrors.newPassword = 'Tối thiểu 8 ký tự'; ok = false }

  if (!pwForm.confirmPassword)            { pwErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu'; ok = false }
  else if (pwForm.newPassword !== pwForm.confirmPassword) { pwErrors.confirmPassword = 'Mật khẩu không khớp'; ok = false }

  return ok
}

async function handleChangePassword() {
  if (!validate()) return
  try {
    await studentStore.changePassword({ ...pwForm })
  } catch {
    toast.error(studentStore.pwError || 'Đổi mật khẩu thất bại. Vui lòng thử lại.')
  }
}

watch(() => studentStore.pwSuccess, (val) => {
  if (val) {
    toast.success('Đổi mật khẩu thành công!')
    resetForm()
    studentStore.resetPwState()
  }
})

onMounted(() => {
  if (!studentStore.profile) studentStore.fetchMyProfile()
})
</script>