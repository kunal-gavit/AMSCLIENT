import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        return client(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  profile: () => client.get("/auth/profile"),
  refresh: () => client.post("/auth/refresh", {}),
  logout: () => client.post("/auth/logout", {}),
};

export const profileApi = {
  getProfile: () => client.get("/profile"),
  updateProfile: (payload) => client.put("/profile", payload),
  changePassword: (payload) => client.put("/profile/change-password", payload),
};

export const studentApi = {
  getDashboard: () => client.get("/students/dashboard"),
  getAnalytics: () => client.get("/students/analytics"),
  getHistory: () => client.get("/students/history"),
  simulate: (payload) => client.post("/students/simulate", payload),
};

export const teacherApi = {
  getSubjects: () => client.get("/teacher/subjects"),
  getStudents: (subjectId) => client.get(`/teacher/students/${subjectId}`),
  getAnalytics: (subjectId) => client.get(`/teacher/analytics/${subjectId}`),
  getAtRisk: (subjectId) => client.get(`/teacher/at-risk/${subjectId}`),
  getLectures: (subjectId) => client.get(`/teacher/lectures/${subjectId}`),
  markAttendance: (payload) => client.post("/teacher/mark", payload),
};

export const adminApi = {
  getStats: () => client.get("/admin/stats"),
  getSubjects: () => client.get("/admin/subjects"),
  searchStudents: (query) => client.get(`/admin/search?query=${encodeURIComponent(query)}`),
  enrollStudent: (payload) => client.post("/admin/enroll", payload),
};

export default client;
