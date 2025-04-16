export interface LoanApplicationInterface {
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
}

export type LoanInfoStatus = 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected' | 'completed';

export interface LoanInfoResponse {
  success: boolean;
  loanInfo: LoanApplicationInterface & {
    _id: string;
    userId: string;
    status: LoanInfoStatus;
    currentStep: number;
    completedSteps: number[];
    createdAt: string;
    updatedAt: string;
  };
}

export interface LoanInfoListResponse {
  success: boolean;
  loanInfos: Array<LoanApplicationInterface & {
    _id: string;
    userId: string;
    status: LoanInfoStatus;
    currentStep: number;
    completedSteps: number[];
    createdAt: string;
    updatedAt: string;
  }>;
}