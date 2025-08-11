import axios from "axios";
import { getToken } from './UserService';

const BASE_URL = "http://localhost:8080";


export function getAllFeedbacks() {
  return axios.get(`${BASE_URL}/feedback/all-feedback`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}


export function getMyFeedbacks() {
  return axios.get(`${BASE_URL}/feedback/my-feedback`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

export function postFeedback(feedbackData) {
  return axios.post(`${BASE_URL}/feedback/post-feedback`, feedbackData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}
