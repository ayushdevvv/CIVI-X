import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message || err.message || "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export const complaintsApi = {
  create: (payload) => api.post("/complaints", payload).then((r) => r.data),
  list: (params) => api.get("/complaints", { params }).then((r) => r.data),
  get: (id) => api.get(`/complaints/${id}`).then((r) => r.data),
  searchByLocation: (address) => api.get("/complaints/location/search", { params: { address } }).then((r) => r.data),
  updateStatus: (id, status, note) =>
    api.patch(`/complaints/${id}/status`, { status, note }).then((r) => r.data),
  assign: (id, department, status, note) =>
    api.patch(`/complaints/${id}/status`, { department, status, note }).then((r) => r.data),
};

export const dashboardApi = {
  stats: () => api.get("/dashboard/stats").then((r) => r.data),
  queue: () => api.get("/dashboard/queue").then((r) => r.data),
};

export const clustersApi = {
  list: () => api.get("/clusters").then((r) => r.data),
};

export const insightsApi = {
  get: () => api.get("/insights").then((r) => r.data),
};

export const helplineApi = {
  start: (payload) => api.post("/helpline/conversations", payload).then((r) => r.data),
  get: (id) => api.get(`/helpline/conversations/${id}`).then((r) => r.data),
  send: (id, payload) => api.post(`/helpline/conversations/${id}/messages`, payload).then((r) => r.data),
  adminList: () => api.get("/helpline/admin/conversations").then((r) => r.data),
  adminSend: (id, text) => api.post(`/helpline/admin/conversations/${id}/messages`, { text }).then((r) => r.data),
  setStatus: (id, status) => api.patch(`/helpline/admin/conversations/${id}/status`, { status }).then((r) => r.data),
};
