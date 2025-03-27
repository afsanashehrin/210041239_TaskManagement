import API from "../utils/api";

export const login = (email, password) => API.post("/auth/login", { email, password });
export const register = (userData) => API.post("/auth/register", userData);