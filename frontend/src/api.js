import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:80/api/v1",
});

api.interceptors.request.use((config) => {
  // Không thêm Authorization cho login hoặc register
  console.log("➡️ Request URL:", config.url);

  // Log phương thức và body nếu có
  console.log("➡️ Method:", config.method?.toUpperCase());
  if (config.data) {
    console.log("➡️ Body:", config.data);
  } // <-- Đóng ngoặc ở đây

  if (
    config.url.includes("/login") ||
    config.url.includes("/register")
  ) {
    return config;
  }

  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;