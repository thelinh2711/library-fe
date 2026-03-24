import { defineStore } from "pinia";
import { ref } from "vue";
import studentService from "@/services/studentService";

export const useStudentStore = defineStore("student", () => {
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
      console.log("🔍 RAW RESPONSE:", res);
      console.log("🔍 res.data:", res.data);
      console.log("🔍 res.data.result:", res.data?.result);
      console.log("🔍 content:", res.data?.result?.content);
      students.value = res.data.result.content;
      total.value    = res.data.result.totalElements;
    } catch (e) {
      error.value = e?.response?.data?.message ?? "Lỗi tải danh sách";
    } finally { loading.value = false; }
  }

  async function createStudent(data)     { await studentService.create(data);        await fetchStudents(); }
  async function updateStudent(id, data) { await studentService.update(id, data);    await fetchStudents(); }
  async function deleteStudent(id)       { await studentService.delete(id);           await fetchStudents(); }
  async function importStudents(list)    { await studentService.importStudents(list);  await fetchStudents(); }

  function setPage(page)     { searchParams.value.page = page; fetchStudents(); }
  function setSearch(params) { Object.assign(searchParams.value, params, { page: 0 }); fetchStudents(); }

  return { students, total, loading, error, searchParams,
           fetchStudents, createStudent, updateStudent, deleteStudent, importStudents,
           setPage, setSearch };
});