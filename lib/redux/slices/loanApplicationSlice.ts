import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

// Define interfaces based on your Mongoose model
export interface PropertyInfo {
  propertyType: string;
  propertyValue: number;
  propertyAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  propertyUsage: string;
  propertyAge: number;
  bedrooms: number;
  bathrooms: number;
}

export interface CurrentMortgage {
  lender: string;
  balance: number;
  interestRate: number;
  monthlyPayment: number;
  remainingTerm: number;
}

export interface EmploymentInfo {
  employmentStatus: string;
  employerName: string;
  jobTitle: string;
  yearsInCurrentJob: number;
  annualIncome: number;
  additionalIncome: number;
  isSelfEmployed: boolean;
  businessType?: string;
  abnAcn?: string;
  businessIndustry?: string;
  annualBusinessRevenue?: number;
}

export interface PartnerInfo {
  hasPartner: boolean;
  fullName?: string;
  dateOfBirth?: Date;
  employmentStatus?: string;
  employerName?: string;
  jobTitle?: string;
  yearsInCurrentJob?: number;
  annualIncome?: number;
  isSelfEmployed?: boolean;
  businessType?: string;
  abnAcn?: string;
  businessIndustry?: string;
  annualBusinessRevenue?: number;
}

export interface FinancialInfo {
  monthlyExpenses: number;
  otherDebts: Array<{
    type: string;
    lender: string;
    balance: number;
    monthlyPayment: number;
  }>;
  savingsBalance: number;
  creditScore: number;
}

export interface DesiredFeatures {
  offsetAccount: boolean;
  redrawFacility: boolean;
  extraRepayments: boolean;
  fixedRate: boolean;
  variableRate: boolean;
  splitLoan: boolean;
  interestOnly: boolean;
  principalAndInterest: boolean;
  packageDiscount: boolean;
  noAnnualFee: boolean;
}

export interface LenderInfo {
  lender?: string;
  applicationId?: string;
  applicationDate?: Date;
  offer?: {
    amount: number;
    interestRate: number;
    comparisonRate: number;
    term: number;
    monthlyRepayment: number;
    totalRepayment: number;
    features: string[];
    cashback?: number;
    establishmentFee: number;
    annualFee: number;
    specialOffers?: string[];
    expiryDate?: Date;
  };
}

export interface Note {
  content: string;
  createdBy: string;
  createdAt: Date;
}

export interface LoanApplication {
  _id?: string;
  user: string;
  loanType: string;
  loanAmount: number;
  loanTerm: number;
  loanPurpose: string;
  interestRateType: string;
  fixedRateTerm?: number;
  propertyInfo: PropertyInfo;
  currentMortgage?: CurrentMortgage;
  employmentInfo: EmploymentInfo;
  partnerInfo?: PartnerInfo;
  financialInfo: FinancialInfo;
  status: string;
  progress: number;
  stage: string;
  assignedTo?: string;
  priority: string;
  documentsComplete: boolean;
  desiredFeatures: DesiredFeatures;
  lenderInfo?: LenderInfo;
  notes?: Note[];
  submittedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  settlementDate?: Date;
  expiryDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LoanApplicationState {
  applications: LoanApplication[];
  currentApplication: LoanApplication | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: LoanApplicationState = {
  applications: [],
  currentApplication: null,
  isLoading: false,
  error: null,
};

// Async thunks for loan applications
export const fetchLoanApplications = createAsyncThunk(
  'loanApplication/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      if (!auth.token) {
        return rejectWithValue('No token available');
      }
      
      const response = await axios.get('/api/loan-applications', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch loan applications');
    }
  }
);

export const fetchLoanApplicationById = createAsyncThunk(
  'loanApplication/fetchById',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      if (!auth.token) {
        return rejectWithValue('No token available');
      }
      
      const response = await axios.get(`/api/loan-applications/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch loan application');
    }
  }
);

export const createLoanApplication = createAsyncThunk(
  'loanApplication/create',
  async (applicationData: Partial<LoanApplication>, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      if (!auth.token) {
        return rejectWithValue('No token available');
      }
      
      const response = await axios.post('/api/loan-applications', applicationData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create loan application');
    }
  }
);

export const updateLoanApplication = createAsyncThunk(
  'loanApplication/update',
  async ({ id, data }: { id: string; data: Partial<LoanApplication> }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      if (!auth.token) {
        return rejectWithValue('No token available');
      }
      
      const response = await axios.put(`/api/loan-applications/${id}`, data, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update loan application');
    }
  }
);

export const deleteLoanApplication = createAsyncThunk(
  'loanApplication/delete',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      if (!auth.token) {
        return rejectWithValue('No token available');
      }
      
      await axios.delete(`/api/loan-applications/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete loan application');
    }
  }
);

// Create the loan application slice
const loanApplicationSlice = createSlice({
  name: 'loanApplication',
  initialState,
  reducers: {
    setCurrentApplication: (state, action: PayloadAction<LoanApplication | null>) => {
      state.currentApplication = action.payload;
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all loan applications
      .addCase(fetchLoanApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLoanApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload.applications;
      })
      .addCase(fetchLoanApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch loan application by ID
      .addCase(fetchLoanApplicationById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLoanApplicationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentApplication = action.payload.application;
      })
      .addCase(fetchLoanApplicationById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create loan application
      .addCase(createLoanApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createLoanApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications.push(action.payload.application);
        state.currentApplication = action.payload.application;
      })
      .addCase(createLoanApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update loan application
      .addCase(updateLoanApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateLoanApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedApplication = action.payload.application;
        
        // Update in the applications array
        const index = state.applications.findIndex(app => app._id === updatedApplication._id);
        if (index !== -1) {
          state.applications[index] = updatedApplication;
        }
        
        // Update current application if it's the same one
        if (state.currentApplication && state.currentApplication._id === updatedApplication._id) {
          state.currentApplication = updatedApplication;
        }
      })
      .addCase(updateLoanApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete loan application
      .addCase(deleteLoanApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteLoanApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = state.applications.filter(app => app._id !== action.payload);
        
        // Clear current application if it's the deleted one
        if (state.currentApplication && state.currentApplication._id === action.payload) {
          state.currentApplication = null;
        }
      })
      .addCase(deleteLoanApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentApplication, clearCurrentApplication } = loanApplicationSlice.actions;

export default loanApplicationSlice.reducer;