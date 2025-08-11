import axios from "axios";
import { getToken } from "./UserService";

const BASE_URL = "http://localhost:8080/booking-payments";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const BookingPaymentService = {
  createBookingPaymentOrder: async (bookingId) => {
    try {
      const response = await api.post(`/create-order/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },


  verifyBookingPayment: async (verificationData) => {
    try {
      const response = await api.post("/verify", null, {
        params: verificationData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  handleBookingPaymentFailure: async (paymentId, reason) => {
    try {
      const response = await api.post("/failure", null, {
        params: { paymentId, reason }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  loadRazorpayScript: () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  },
};

export default BookingPaymentService;
