import axios from "axios";
import { getToken } from './UserService';

const BASE_URL = "http://localhost:8080";


export function getAllFacilities() {
  return axios.get(`${BASE_URL}/facilities/all-facilities`);
}


export function getFacilityById(facilityId) {
  return axios.get(`${BASE_URL}/facilities/${facilityId}`);
}

export function addFacility(facilityData) {
  return axios.post(`${BASE_URL}/facilities/add-facilities`, facilityData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}


export function updateFacility(facilityId, updatedData) {
  return axios.put(`${BASE_URL}/facilities/${facilityId}`, updatedData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

export function deleteFacility(facilityId) {
  return axios.delete(`${BASE_URL}/facilities/${facilityId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}