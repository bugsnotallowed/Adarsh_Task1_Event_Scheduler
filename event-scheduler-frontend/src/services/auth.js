import api from "./api";

export async function register(payload) {
  const res = await api.post("/api/auth/register", payload);
  return res.data;
}

export async function login(payload) {
  const res = await api.post("/api/auth/login", payload);
  return res.data;
}

export function setToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function removeToken() {
  localStorage.removeItem("token");
}
