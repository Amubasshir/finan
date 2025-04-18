// Add this file if it doesn't exist
import axios from 'axios'

export const loanInfoAPI = {
  getLoanInfoById: async (id: string) => {
    return axios.get(`/api/loan-info/${id}`)
  },
  
  createLoanInfo: async (data: any) => {
    return axios.post('/api/loan-info', data)
  },
  
  updateLoanInfo: async (id: string, data: any) => {
    return axios.put(`/api/loan-info/${id}`, data)
  },
  
  deleteLoanInfo: async (id: string) => {
    return axios.delete(`/api/loan-info/${id}`)
  }
}