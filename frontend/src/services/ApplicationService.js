import axios from "axios";

class ApplicationService {
  // Lấy danh sách đơn ứng tuyển theo recruiter (dành cho nhà tuyển dụng)
  getApplicationsByRecruiter(token) {
    return axios.get("http://localhost:80/api/v1/applications/recruiter", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  acceptApplication(id, token) {
    return axios.patch(
      `http://localhost:80/api/v1/applications/${id}/accept`,
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
      `http://localhost:80/api/v1/applications/${id}/reject`,
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