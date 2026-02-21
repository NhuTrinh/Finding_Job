import axios from "axios";

class ApplicationService {
  // Lấy danh sách đơn ứng tuyển theo recruiter (dành cho nhà tuyển dụng)
  getApplicationsByRecruiter(token) {
    return axios.get("http://127.0.0.1:8000/api/v1/applications/recruiter", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  acceptApplication(id, token) {
    return axios.patch(
      `http://127.0.0.1:8000/api/v1/applications/${id}/accept`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  rejectApplication(id, token) {
    return axios.patch(
      `http://127.0.0.1:8000/api/v1/applications/${id}/reject`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}

export default new ApplicationService();