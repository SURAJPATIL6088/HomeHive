import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:8080";

export function loginUser(formData) {
  return axios.post(`${BASE_URL}/users/auth/signin`, formData);
}

export function registerUser(formData) {
  return axios.post(`${BASE_URL}/users/auth/signup`, formData);
}

export function getUserProfile() {
  return axios.get(`${BASE_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

export function getAllUsers() {
  return axios.get(`${BASE_URL}/users/all`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

export function grantUserRole(userId, role) {
  return axios.put(
    `${BASE_URL}/users/${userId}/role`,
    { role },
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );
}

export function deactivateUser(userId) {
  return axios.delete(`${BASE_URL}/users/admin/${userId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
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


export function getUserRole() {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    if (decoded.role) return decoded.role;
    if (decoded.roles && decoded.roles.length > 0) return decoded.roles[0];
    if (decoded.authorities && decoded.authorities.length > 0)
      return decoded.authorities[0];
    return null;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}

export function isAdmin() {
  const roles = getUserRole();
  if (!roles) return false;

  if (typeof roles === "string") {
    return roles.toUpperCase() === "ROLE_ADMIN";
  }
  return false;
}
