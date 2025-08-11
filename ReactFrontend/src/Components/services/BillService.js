import axios from "axios";
import { getToken } from './UserService';

const BASE_URL = "http://localhost:8080/bills";

const BillService = {
  async getMyBills() {
    try {
      const response = await axios.get(`${BASE_URL}/my-bills`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching my bills:', error);
      throw error.response?.data || error;
    }
  },

  async getBillById(billId) {
    try {
      const response = await axios.get(`${BASE_URL}/${billId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching bill by ID:', error);
      throw error.response?.data || error;
    }
  },

  async generateBill(data) {
    try {
      const response = await axios.post(`${BASE_URL}/generate`, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error generating bill:', error);
      throw error.response?.data || error;
    }
  },

  async getAllBills() {
    try {
      const response = await axios.get(`${BASE_URL}/all-bills`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all bills:', error);
      throw error.response?.data || error;
    }
  },

  async applyPenaltyOnOverdueBills() {
    try {
      const response = await axios.post(`${BASE_URL}/apply-penalties`, null, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error applying penalties:', error);
      throw error.response?.data || error;
    }
  },

  async getOverdueBills() {
    try {
      const response = await axios.get(`${BASE_URL}/overdue`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching overdue bills:', error);
      throw error.response?.data || error;
    }
  }
};

export default BillService;
