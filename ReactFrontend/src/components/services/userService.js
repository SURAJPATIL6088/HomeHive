import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export function loginAdmin(formData) {
  return api.post("/users/auth/signin", formData);
}

export function storeToken(jwt) {
  localStorage.setItem("token", jwt);
}

export function removeToken() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function registerUser(formData) {
  return api.post("/users/register", formData);
}

export function getUserByEmail(email) {
  return api.get(`/users/${email}`);
}
