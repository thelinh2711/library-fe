<!-- src/components/student/StudentFormModal.vue -->
<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" @click.self="$emit('close')">
        <Transition
          enter-active-class="transition duration-200"
          enter-from-class="opacity-0 scale-95 translate-y-2"
          leave-active-class="transition duration-150"
          leave-to-class="opacity-0 scale-95 translate-y-2"
        >
          <div v-if="show" class="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">

            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <GraduationCap class="h-4 w-4 text-white" />
                </div>
                <h2 class="text-[15px] font-bold text-slate-800">
                  {{ isEdit ? "Cập nhật sinh viên" : "Thêm sinh viên" }}
                </h2>
              </div>
              <button class="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 transition" @click="$emit('close')">
                <X class="h-4 w-4" />
              </button>
            </div>

            <!-- Body -->
            <div class="overflow-y-auto flex-1 px-6 py-5">
              <div class="grid grid-cols-2 gap-4">

                <!-- Họ tên -->
                <div class="col-span-2 flex flex-col gap-1.5">
                  <label :class="LABEL">Họ và tên <span class="text-rose-400">*</span></label>
                  <input v-model="form.fullName" type="text" placeholder="Nguyễn Văn A"
                    :class="[INPUT, errors.fullName && 'border-rose-400 focus:ring-rose-100']" />
                  <p v-if="errors.fullName" class="text-xs text-rose-500">{{ errors.fullName }}</p>
                </div>

                <!-- Email (create only) -->
                <div v-if="!isEdit" class="flex flex-col gap-1.5">
                  <label :class="LABEL">Email <span class="text-rose-400">*</span></label>
                  <input v-model="form.email" type="email" placeholder="sv@school.edu.vn"
                    :class="[INPUT, errors.email && 'border-rose-400 focus:ring-rose-100']" />
                  <p v-if="errors.email" class="text-xs text-rose-500">{{ errors.email }}</p>
                </div>

                <!-- MSSV (create only) -->
                <div v-if="!isEdit" class="flex flex-col gap-1.5">
                  <label :class="LABEL">MSSV <span class="text-rose-400">*</span></label>
                  <input v-model="form.studentCode" type="text" placeholder="SV001"
                    :class="[INPUT, errors.studentCode && 'border-rose-400 focus:ring-rose-100']" />
                  <p v-if="errors.studentCode" class="text-xs text-rose-500">{{ errors.studentCode }}</p>
                </div>

                <!-- Lớp -->
                <div class="flex flex-col gap-1.5">
                  <label :class="LABEL">Lớp</label>
                  <input v-model="form.className" type="text" placeholder="CNTT-01" :class="INPUT" />
                </div>

                <!-- Khoa -->
                <div class="flex flex-col gap-1.5">
                  <label :class="LABEL">Khoa</label>
                  <input v-model="form.faculty" type="text" placeholder="Công nghệ thông tin" :class="INPUT" />
                </div>

                <!-- Ngày sinh -->
                <div class="flex flex-col gap-1.5">
                  <label :class="LABEL">Ngày sinh</label>
                  <input v-model="form.dateOfBirth" type="date" :class="INPUT" />
                </div>

                <!-- Giới tính -->
                <div class="flex flex-col gap-1.5">
                  <label :class="LABEL">Giới tính</label>
                  <select v-model="form.gender" :class="INPUT">
                    <option value="">-- Chọn --</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <!-- Khóa -->
                <div class="flex flex-col gap-1.5">
                  <label :class="LABEL">Khóa (năm)</label>
                  <input v-model.number="form.courseYear" type="number" placeholder="2022" min="2000" max="2100" :class="INPUT" />
                </div>

                <!-- SĐT -->
                <div class="flex flex-col gap-1.5">
                  <label :class="LABEL">Số điện thoại</label>
                  <input v-model="form.phone" type="text" placeholder="0912345678"
                    :class="[INPUT, errors.phone && 'border-rose-400 focus:ring-rose-100']" />
                  <p v-if="errors.phone" class="text-xs text-rose-500">{{ errors.phone }}</p>
                </div>

                <!-- Trạng thái (edit only) -->
                <div v-if="isEdit" class="flex flex-col gap-1.5">
                  <label :class="LABEL">Trạng thái</label>
                  <select v-model="form.status" :class="INPUT">
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="INACTIVE">Ngừng</option>
                    <option value="SUSPENDED">Khóa</option>
                  </select>
                </div>

                <!-- Địa chỉ -->
                <div class="col-span-2 flex flex-col gap-1.5">
                  <label :class="LABEL">Địa chỉ</label>
                  <input v-model="form.address" type="text" placeholder="123 Đường ABC, TP.HCM" :class="INPUT" />
                </div>
              </div>

              <!-- API Error -->
              <div v-if="apiError" class="mt-4 flex items-center gap-2 px-4 py-3 bg-rose-50 text-rose-600 text-sm rounded-xl">
                <AlertCircle class="h-4 w-4 flex-shrink-0" /> {{ apiError }}
              </div>
            </div>

            <!-- Footer -->
            <div class="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button class="px-4 py-2 text-sm font-semibold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition" @click="$emit('close')">
                Hủy
              </button>
              <button
                class="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 rounded-xl hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition"
                :disabled="submitting"
                @click="submit"
              >
                <Loader2 v-if="submitting" class="h-4 w-4 animate-spin" />
                {{ isEdit ? "Lưu thay đổi" : "Thêm sinh viên" }}
              </button>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { GraduationCap, X, AlertCircle, Loader2 } from "lucide-vue-next";

const LABEL = "text-xs font-semibold text-slate-500";
const INPUT  = "w-full px-3 py-2 text-sm text-slate-700 border border-slate-200 rounded-xl bg-white outline-none placeholder-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition";

const props = defineProps({
  show:       { type: Boolean, default: false },
  student:    { type: Object,  default: null  },
  submitting: { type: Boolean, default: false },
  apiError:   { type: String,  default: ""    },
});
const emits = defineEmits(["close", "submit"]);

const isEdit = ref(false);
const empty  = () => ({ fullName:"", email:"", studentCode:"", className:"", faculty:"", dateOfBirth:"", gender:"", courseYear:null, phone:"", address:"", status:"ACTIVE" });
const form   = reactive(empty());
const errors = reactive({});

watch(() => props.show, (v) => {
  if (!v) return;
  isEdit.value = !!props.student;
  Object.assign(form, empty());
  if (props.student) Object.assign(form, props.student);
  Object.keys(errors).forEach((k) => delete errors[k]);
});

const validate = () => {
  Object.keys(errors).forEach((k) => delete errors[k]);
  if (!form.fullName?.trim())  errors.fullName = "Không được để trống";
  if (!isEdit.value) {
    if (!form.email?.trim()) errors.email = "Không được để trống";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Email không hợp lệ";
    if (!form.studentCode?.trim()) errors.studentCode = "Không được để trống";
  }
  if (form.phone && !/^\d{9,15}$/.test(form.phone)) errors.phone = "SĐT 9–15 chữ số";
  return !Object.keys(errors).length;
};

const submit = () => {
  if (!validate()) return;
  const payload = { ...form };
  if (!payload.dateOfBirth) delete payload.dateOfBirth;
  if (!payload.gender)      delete payload.gender;
  if (!payload.courseYear)  delete payload.courseYear;
  emits("submit", payload);
};
</script>