import axios from 'axios';

class CandidateService {
  // Lấy profile của recruiter hiện tại (dựa vào token backend xác định accountId)
  getProfile(token) {
    return axios.get("http://localhost:80/api/v1/candidates/profile-cv", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Cập nhật profile recruiter
  updateProfile(token, profileData) {
    return axios.put("http://localhost:80/api/v1/recruiters/profile", profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new CandidateService();