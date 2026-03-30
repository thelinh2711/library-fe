import { defineStore } from "pinia";
import { ref } from "vue";
import studentService from "@/services/studentService";

export const useStudentStore = defineStore("student", () => {

  // ─── Danh sách sinh viên (admin/librarian) ───────────────────────────────
  const students = ref([]);
  const total    = ref(0);
  const loading  = ref(false);
  const error    = ref(null);

  const searchParams = ref({
    keyword: "", className: "", faculty: "",
    page: 0, size: 20, sortBy: "fullName", sortDir: "asc",
  });

  async function fetchStudents() {
    loading.value = true; error.value = null;
    try {
      const res = await studentService.search(searchParams.value);
      students.value = res.data.result.content;
      total.value    = res.data.result.totalElements;
    } catch (e) {
      error.value = e?.response?.data?.message ?? "Lỗi tải danh sách";
    } finally { loading.value = false; }
  }

  async function createStudent(data)     { await studentService.create(data);           await fetchStudents(); }
  async function updateStudent(id, data) { await studentService.update(id, data);       await fetchStudents(); }
  async function deleteStudent(id)       { await studentService.delete(id);             await fetchStudents(); }
  async function importStudents(list)    { await studentService.importStudents(list);   await fetchStudents(); }

  function setPage(page)     { searchParams.value.page = page; fetchStudents(); }
  function setSearch(params) { Object.assign(searchParams.value, params, { page: 0 }); fetchStudents(); }

  // ─── Profile (student tự xem thông tin của mình) ────────────────────────
  const profile        = ref(null);
  const profileLoading = ref(true);   // ← true để tránh render v-else trước khi fetch xong
  const profileError   = ref(null);

  async function fetchMyProfile() {
    profileLoading.value = true; profileError.value = null;
    try {
      const res = await studentService.getMyProfile();
      profile.value = res.data.result;
    } catch (e) {
      profileError.value = e?.response?.data?.message ?? "Không thể tải thông tin cá nhân.";
    } finally { profileLoading.value = false; }
  }

  // ─── Đổi mật khẩu ───────────────────────────────────────────────────────
  const pwLoading = ref(false);
  const pwError   = ref(null);
  const pwSuccess = ref(false);

  async function changePassword(payload) {
    // payload: { oldPassword, newPassword, confirmPassword }
    pwLoading.value = true; pwError.value = null; pwSuccess.value = false;
    try {
      await studentService.changePassword(payload);
      pwSuccess.value = true;
    } catch (e) {
      pwError.value = e?.response?.data?.message ?? "Đổi mật khẩu thất bại. Vui lòng thử lại.";
      throw e;
    } finally { pwLoading.value = false; }
  }

  function resetPwState() {
    pwError.value = null;
    pwSuccess.value = false;
  }

  return {
    // danh sách
    students, total, loading, error, searchParams,
    fetchStudents, createStudent, updateStudent, deleteStudent, importStudents,
    setPage, setSearch,

    // profile
    profile, profileLoading, profileError,
    fetchMyProfile,

    // đổi mật khẩu
    pwLoading, pwError, pwSuccess,
    changePassword, resetPwState,
  };
});