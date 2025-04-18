import axios from 'axios';

export const loanInfoAPI = {
  // Get loan info by ID
  getLoanInfoById: async (id) => {
    return axios.get(`/api/loan-info/${id}`);
  },
  
  // Create new loan info
  createLoanInfo: async (data) => {
    return axios.post('/api/loan-info', data);
  },
  
  // Update existing loan info
  updateLoanInfo: async (id, data) => {
    return axios.put(`/api/loan-info/${id}`, data);
  },
  
  // Delete loan info
  deleteLoanInfo: async (id) => {
    return axios.delete(`/api/loan-info/${id}`);
  },
  
  // Get all loan info for current user
  getAllLoanInfo: async () => {
    return axios.get('/api/loan-info');
  }
};