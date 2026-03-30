// services/fineService.js
import axiosClient from "./axiosClient";
 
export default {
  /**
   * Tìm kiếm phiếu phạt
   * @param {Object} params - { status: 'UNPAID'|'PAID'|undefined, keyword: string, page, size }
   */
  search({ status, keyword, page = 0, size = 20 } = {}) {
    return axiosClient.get('/fines', {
      params: {
        ...(status  && { status }),
        ...(keyword && { keyword }),
        page,
        size,
      },
    })
  },
 
  /** Thủ thư xem fine của 1 sinh viên */
  getByStudent(studentId, page = 0, size = 20) {
    return axiosClient.get(`/fines/student/${studentId}`, { params: { page, size } })
  },
 
  /** Xác nhận thu tiền phạt */
  pay(id) {
    return axiosClient.patch(`/fines/${id}/pay`)
  },
}