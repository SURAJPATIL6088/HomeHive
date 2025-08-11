import axios from "axios";
import { getToken } from './UserService';

const BASE_URL = "http://localhost:8080";


export function getActiveNotices() {
  return axios.get(`${BASE_URL}/notices/getActive`);
}


export function getAllNotices() {
  return axios.get(`${BASE_URL}/notices/getAll`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}


export function createNotice(formData) {
  return axios.post(`${BASE_URL}/notices/post-notice`, formData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}


export function updateNotice(noticeId, formData) {
  return axios.put(`${BASE_URL}/notices/update-notice/${noticeId}`, formData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}


export function deleteNotice(noticeId) {
  return axios.delete(`${BASE_URL}/notices/remove/${noticeId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}
