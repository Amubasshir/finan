import api from '@/lib/axios';

// Auth API endpoints
export const authAPI = {
  signup: (userData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    receiveUpdates?: boolean;
    agreeTerms: boolean;
  }) => api.post('/auth/signup', userData),
  
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials),
  
  forgotPassword: (email: string) => 
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) => 
    api.post('/auth/reset-password', { token, password }),
  
  verifyEmail: (token: string) => 
    api.get(`/auth/verify-email/${token}`),
    
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
    }
    return Promise.resolve();
  }
};

// User API endpoints
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData: any) => api.put('/users/profile', userData),
  updatePassword: (data: { currentPassword: string; newPassword: string }) => 
    api.put('/users/password', data),
  getNotifications: () => api.get('/users/notifications'),
  markNotificationAsRead: (notificationId: string) => 
    api.put(`/users/notifications/${notificationId}/read`),
};

// Loan application API endpoints
export const loanAPI = {
  createApplication: (loanData: any) => 
    api.post('/loan-applications', loanData),
  
  getApplications: () => 
    api.get('/loan-applications'),
  
  getApplicationById: (id: string) => 
    api.get(`/loan-applications/${id}`),
  
  updateApplication: (id: string, data: any) => 
    api.put(`/loan-applications/${id}`, data),
  
  deleteApplication: (id: string) => 
    api.delete(`/loan-applications/${id}`),
    
  // Additional loan-related endpoints
  getLoanOffers: (applicationId: string) => 
    api.get(`/loan-applications/${applicationId}/offers`),
    
  acceptLoanOffer: (applicationId: string, offerId: string) => 
    api.post(`/loan-applications/${applicationId}/offers/${offerId}/accept`),
    
  rejectLoanOffer: (applicationId: string, offerId: string, reason?: string) => 
    api.post(`/loan-applications/${applicationId}/offers/${offerId}/reject`, { reason }),
    
  getLoanStatus: (applicationId: string) => 
    api.get(`/loan-applications/${applicationId}/status`),
    
  getPreApprovalStatus: (applicationId: string) => 
    api.get(`/loan-applications/${applicationId}/pre-approval`),
};

// Loan Info API endpoints
export const loanInfoAPI = {
  // Get all loan info applications
  getAllLoanInfo: () => 
    api.get('/loan-info'),
  
  // Create a new loan info application
  createLoanInfo: (loanInfoData: {
    // Property Information
    propertyType: string;
    propertyValue: number;
    propertyAddress: string;
    propertyUsage: string;
    propertyAge: number;
    bedrooms: number;
    bathrooms: number;
    currentMortgage: number;
    currentLender: string;
    currentInterestRate: number;
    
    // Personal Information
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    maritalStatus: string;
    dependents: number;
    
    // Employment Information
    employmentStatus: string;
    employerName: string;
    jobTitle: string;
    yearsInCurrentJob: number;
    annualIncome: number;
    additionalIncome: number;
    isSelfEmployed: boolean;
    // Self-employed specific fields
    businessType?: string;
    abnAcn?: string;
    businessIndustry?: string;
    annualBusinessRevenue?: number;
    // Partner details
    hasPartner: boolean;
    partnerEmploymentStatus?: string;
    partnerEmployerName?: string;
    partnerJobTitle?: string;
    partnerYearsInCurrentJob?: number;
    partnerAnnualIncome?: number;
    partnerIsSelfEmployed?: boolean;
    partnerBusinessType?: string;
    partnerAbnAcn?: string;
    partnerBusinessIndustry?: string;
    partnerAnnualBusinessRevenue?: number;
    
    // Financial Information
    creditScore: string;
    monthlyExpenses: number;
    existingDebts: number;
    bankruptcyHistory: string;
    savingsBalance: number;
    investments: number;
    otherAssets: number;
    
    // Loan Requirements
    loanAmount: number;
    loanPurpose: string;
    loanTerm: number;
    interestRatePreference: string;
    loanType: string;
    fixedRateTerm: number;
    
    // Additional Features
    offsetAccount: boolean;
    redrawFacility: boolean;
    extraRepayments: boolean;
    interestOnly: boolean;
    fixedRate: boolean;
    splitLoan: boolean;
    packageDiscount: boolean;
    noFees: boolean;
    portability: boolean;
    parentGuarantee: boolean;
  }) => api.post('/loan-info', loanInfoData),
  
  // Get a specific loan info application
  getLoanInfoById: (id: string) => 
    api.get(`/loan-info/${id}`),
  
  // Update a loan info application
  updateLoanInfo: (id: string, data: Partial<{
    // Property Information
    propertyType: string;
    propertyValue: number;
    propertyAddress: string;
    propertyUsage: string;
    propertyAge: number;
    bedrooms: number;
    bathrooms: number;
    currentMortgage: number;
    currentLender: string;
    currentInterestRate: number;
    
    // Personal Information
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    maritalStatus: string;
    dependents: number;
    
    // Employment Information
    employmentStatus: string;
    employerName: string;
    jobTitle: string;
    yearsInCurrentJob: number;
    annualIncome: number;
    additionalIncome: number;
    isSelfEmployed: boolean;
    businessType: string;
    abnAcn: string;
    businessIndustry: string;
    annualBusinessRevenue: number;
    hasPartner: boolean;
    partnerEmploymentStatus: string;
    partnerEmployerName: string;
    partnerJobTitle: string;
    partnerYearsInCurrentJob: number;
    partnerAnnualIncome: number;
    partnerIsSelfEmployed: boolean;
    partnerBusinessType: string;
    partnerAbnAcn: string;
    partnerBusinessIndustry: string;
    partnerAnnualBusinessRevenue: number;
    
    // Financial Information
    creditScore: string;
    monthlyExpenses: number;
    existingDebts: number;
    bankruptcyHistory: string;
    savingsBalance: number;
    investments: number;
    otherAssets: number;
    
    // Loan Requirements
    loanAmount: number;
    loanPurpose: string;
    loanTerm: number;
    interestRatePreference: string;
    loanType: string;
    fixedRateTerm: number;
    
    // Additional Features
    offsetAccount: boolean;
    redrawFacility: boolean;
    extraRepayments: boolean;
    interestOnly: boolean;
    fixedRate: boolean;
    splitLoan: boolean;
    packageDiscount: boolean;
    noFees: boolean;
    portability: boolean;
    parentGuarantee: boolean;
  }>) => api.put(`/loan-info/${id}`, data),
  
  // Delete a loan info application
  deleteLoanInfo: (id: string) => 
    api.delete(`/loan-info/${id}`),
  
  // Update loan info status
  updateLoanInfoStatus: (id: string, status: 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected' | 'completed') => 
    api.put(`/loan-info/${id}/status`, { status }),
  
  // Update loan info progress
  updateLoanInfoProgress: (id: string, data: { currentStep?: number; completedSteps?: number[] }) => 
    api.put(`/loan-info/${id}/progress`, data),
    
  // Submit loan info for review
  submitLoanInfo: (id: string) => 
    api.post(`/loan-info/${id}/submit`),
    
  // Save partial loan info (for step-by-step form)
  savePartialLoanInfo: (id: string, stepData: any, stepIndex: number) => 
    api.put(`/loan-info/${id}/step/${stepIndex}`, stepData),
    
  // Validate a specific step
  validateLoanInfoStep: (id: string, stepIndex: number, stepData: any) => 
    api.post(`/loan-info/${id}/validate/${stepIndex}`, stepData),
};

// Document API endpoints
export const documentAPI = {
  uploadDocument: (applicationId: string, formData: FormData) => 
    api.post(`/documents/upload/${applicationId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  getDocuments: (applicationId: string) => 
    api.get(`/documents/${applicationId}`),
  
  deleteDocument: (documentId: string) => 
    api.delete(`/documents/${documentId}`),
    
  // Additional document-related endpoints
  getRequestedDocuments: (applicationId: string) => 
    api.get(`/documents/requested/${applicationId}`),
    
  markDocumentAsUploaded: (documentId: string) => 
    api.put(`/documents/${documentId}/mark-uploaded`),
    
  downloadDocument: (documentId: string) => 
    api.get(`/documents/${documentId}/download`, { responseType: 'blob' }),
};

// Lender API endpoints
export const lenderAPI = {
  getLenders: () => api.get('/lenders'),
  getLenderById: (id: string) => api.get(`/lenders/${id}`),
  getLenderOffers: (lenderId: string) => api.get(`/lenders/${lenderId}/offers`),
  compareLenders: (lenderIds: string[]) => api.post('/lenders/compare', { lenderIds }),
};

// Messaging API endpoints
export const messageAPI = {
  getMessages: (applicationId: string) => 
    api.get(`/messages/${applicationId}`),
  
  sendMessage: (applicationId: string, message: string) => 
    api.post(`/messages/${applicationId}`, { message }),
    
  markMessageAsRead: (messageId: string) => 
    api.put(`/messages/${messageId}/read`),
};

// Export the base api instance as default
export default api;