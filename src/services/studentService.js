import axiosClient from "./axiosClient";

const studentService = {
  search(params) {
    // Lọc bỏ các field rỗng để backend dùng default
    const cleaned = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
    );
    return axiosClient.get("/students/search", { params: cleaned });
  },
  getById(id)            { return axiosClient.get(`/students/${id}`); },
  create(data)           { return axiosClient.post("/students", data); },
  update(id, data)       { return axiosClient.put(`/students/${id}`, data); },
  delete(id)             { return axiosClient.delete(`/students/${id}`); },
  importStudents(list)   { return axiosClient.post("/students/import", list); },
  getFaculties()         { return axiosClient.get("/students/faculties"); },
  getClasses(faculty)    {
    const params = faculty ? { faculty } : {};
    return axiosClient.get("/students/classes", { params });
  },

  // ── Profile ───────────────────────────────────────────────────────────────
  getMyProfile()       { return axiosClient.get("/students/me"); },
  changePassword(data) { return axiosClient.put("/auth/change-password", data); },
};

export default studentService;