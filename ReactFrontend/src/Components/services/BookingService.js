import axios from "axios";
import { getToken } from './UserService';

const BASE_URL = "http://localhost:8080/bookings";


export function bookFacility(formData) {
  return axios.post(`${BASE_URL}/add-booking`, formData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}


export function getMyBookings() {
  return axios.get(`${BASE_URL}/my-bookings`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}


export function checkAvailability(data) {
  return axios.post(`${BASE_URL}/check-availability`, data);
}


export function getAllBookings() {
  return axios.get(`${BASE_URL}/all`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}


export function updateBookingStatus(bookingId, statusData) {
  return axios.put(`${BASE_URL}/${bookingId}/status`, statusData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}


export function getPendingBookings() {
  return axios.get(`${BASE_URL}/pending`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}


export function acceptBookingRequest(bookingId, adminComments = '') {
  return axios.post(`${BASE_URL}/${bookingId}/accept`, null, {
    params: { adminComments },
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}


export function rejectBookingRequest(bookingId, rejectionReason) {
  return axios.post(`${BASE_URL}/${bookingId}/reject`, null, {
    params: { rejectionReason },
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}


export function getAcceptedBookings() {
  return axios.get(`${BASE_URL}/accepted`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

export function getAllBookingsForAdmin() {
  return axios.get(`${BASE_URL}/admin/all`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}


export function getBookingsWithPayments() {
  return axios.get(`${BASE_URL}/accountant/with-payments`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}
