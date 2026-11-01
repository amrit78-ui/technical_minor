import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const authApi = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
  toggleFavorite: (propertyId) => api.post(`/auth/favorites/${propertyId}`),
};

// Property APIs
export const propertyApi = {
  getAll: (params) => api.get("/properties", { params }),
  getById: (id) => api.get(`/properties/${id}`),
  getCitiesSummary: () => api.get("/properties/cities-summary"),
  create: (data) => api.post("/properties", data),
};

// Booking APIs
export const bookingApi = {
  create: (data) => api.post("/bookings", data),
  getMyBookings: () => api.get("/bookings/my"),
  cancel: (id, reason) => api.patch(`/bookings/${id}/cancel`, { reason }),
};

// Review APIs
export const reviewApi = {
  add: (propertyId, reviewData) => api.post(`/reviews/${propertyId}`, reviewData),
};

export default api;
