import axios from "axios";

class CompanyService {
  // 1. Tạo công ty
  createCompany(token, companyData) {
    return axios.post("http://localhost:80/api/v1/companies", companyData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // 2. Lấy danh sách công ty
  getAllCompanies() {
    return axios.get("http://localhost:80/api/v1/companies");
  }

  // 3. Lấy thông tin chi tiết 1 công ty theo ID
  getCompanyById(id) {
    return axios.get(`http://localhost:80/api/v1/companies/${id}`);
  }

  // 4. Cập nhật công ty
  updateCompany(id, updatedData, token) {
    return axios.put(`http://localhost:80/api/v1/companies/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // 5. Xóa công ty
  deleteCompany(id, token) {
    return axios.delete(`http://localhost:80/api/v1/companies/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new CompanyService();