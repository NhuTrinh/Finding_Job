import api from "../api";

class CandidateApplicationService {
    listMyApplications() {
        return api.get("/candidate/applications");
    }

    withdraw(applicationId) {
        return api.delete(`/candidate/applications/${applicationId}`);
    }

    apply(jobId) {
        return api.post("/candidate/applications", { jobId });
    }
}

export default new CandidateApplicationService();