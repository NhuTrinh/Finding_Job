import api from "../api";

class CandidateService {
  getProfile() {
    // GET /api/v1/candidates/me
    return api.get("/candidates/me");
  }

  updateProfile(profileData) {
    // PUT /api/v1/candidates/me
    return api.put("/candidates/me", profileData);
  }
}

export default new CandidateService();