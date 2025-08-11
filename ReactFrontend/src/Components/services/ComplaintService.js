import axios from 'axios';
import { getToken } from './UserService';

const BASE_URL = 'http://localhost:8080/complaints';


export function raiseComplaint(complaintData) {
  return axios.post(`${BASE_URL}/raise-complaint`, complaintData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}


export function getMyComplaints() {
  return axios.get(`${BASE_URL}/my-complaints`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}


export function getAllComplaints() {
  return axios.get(`${BASE_URL}/all-complaints`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}


export function updateComplaintStatus(complaintId, statusData) {
  return axios.put(`${BASE_URL}/${complaintId}/status`, statusData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}
