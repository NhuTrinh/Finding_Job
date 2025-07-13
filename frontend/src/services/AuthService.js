import axios from 'axios';
class AuthService {
    login(email, password, role) {
        const endpoint =
            role === "candidate"
                ? "/accounts/candidate/login"
                : "/accounts/recruiter/login";

        return axios.post(`http://localhost:80/api/v1${endpoint}`, {
            email,
            password,
        });
    }

    register({ fullName, email, password, company }) {
        return axios.post("http://localhost:80/api/v1/accounts/recruiter/register", {
            fullName,
            email,
            password,
            company,
        });
    }

    setAuthToken(token) {
        if (token) {
            console.log(axios.defaults.headers.common["Authorization"]);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; 
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    }
}

export default new AuthService();