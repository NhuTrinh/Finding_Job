import axios from 'axios';

class RecruiterService {
  // Lấy profile của recruiter hiện tại (dựa vào token backend xác định accountId)
  getProfile(token) {
    return axios.get("http://127.0.0.1:8000/api/v1/recruiters/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Cập nhật profile recruiter
  updateProfile(token, profileData) {
    return axios.put("http://127.0.0.1:8000/api/v1/recruiters/profile", profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new RecruiterService();