import api from "./api";

export const loginAPI = (data) => api.post("/auth/login", data);