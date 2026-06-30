import api from "./api";

export const getServices = () => api.get("/services");
export const createService = (data) => api.post("/services", data);