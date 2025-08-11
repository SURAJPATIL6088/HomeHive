import axios from "axios";
import { getToken } from "./UserService";

const BASE_URL = "http://localhost:8080/payments";


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

const PaymentService = {

  createPaymentOrder: async (orderData) => {
    try {
      const response = await api.post("/create-order", orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },


  verifyPayment: async (verificationData) => {
    try {
      const response = await api.post("/verify", verificationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },


  getMyPayments: async () => {
    try {
      const response = await api.get("/my-payments");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },


  getMyPaymentsByStatus: async (status) => {
    try {
      const response = await api.get(`/my-payments/status/${status}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },


  getPaymentById: async (paymentId) => {
    try {
      const response = await api.get(`/${paymentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },


  getPaymentByBillId: async (billId) => {
    try {
      const response = await api.get(`/bill/${billId}`);
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

export async function getAllPayments() {
  const response = await axios.get(`${BASE_URL}/all`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
}

export async function getPaymentById(paymentId) {
  const response = await axios.get(`${BASE_URL}/${paymentId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
}


export default PaymentService;
