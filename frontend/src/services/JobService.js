import axios from "axios";

class JobService {
    getJobsByRecruiterId(token) {
        return axios.get("http://localhost:80/api/v1/jobs/recruiter", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    createJob(data, token) {
        return axios.post("http://localhost:80/api/v1/jobs", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    updateJob(id, data, token) {
        return axios.put(`http://localhost:80/api/v1/jobs/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    deleteJob(id, token) {
        return axios.delete(`http://localhost:80/api/v1/jobs/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    getJobById(id) {
        return axios.get(`http://localhost:80/api/v1/jobs/${id}`);
    }

    getJobs({ search = "", city = "", page = 0, jobsPerPage = 20 }) {
        const params = new URLSearchParams();

        if (search) params.append("search", search);
        if (city) params.append("city", city);
        params.append("page", page);
        params.append("jobsPerPage", jobsPerPage);

        return axios.get(`http://localhost:80/api/v1/jobs?${params.toString()}`);
    }
}
export default new JobService();