"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Define the shape of our form data
interface LoanInfoData {
  // Property Information
  propertyType: string
  propertyValue: number
  propertyAddress: string
  propertyUsage: string
  propertyAge: number
  bedrooms: number
  bathrooms: number
  currentMortgage: number
  currentLender: string
  currentInterestRate: number

  // Personal Information
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  maritalStatus: string
  dependents: number

  // Employment Information
  employmentStatus: string
  employerName: string
  jobTitle: string
  yearsInCurrentJob: number
  annualIncome: number
  additionalIncome: number
  isSelfEmployed: boolean
  // Self-employed specific fields
  businessType: string
  abnAcn: string
  businessIndustry: string
  annualBusinessRevenue: number
  // Partner details
  hasPartner: boolean
  partnerEmploymentStatus: string
  partnerEmployerName: string
  partnerJobTitle: string
  partnerYearsInCurrentJob: number
  partnerAnnualIncome: number
  partnerIsSelfEmployed: boolean
  partnerBusinessType: string
  partnerAbnAcn: string
  partnerBusinessIndustry: string
  partnerAnnualBusinessRevenue: number

  // Financial Information
  creditScore: string
  monthlyExpenses: number
  existingDebts: number
  bankruptcyHistory: string
  savingsBalance: number
  investments: number
  otherAssets: number

  // Loan Requirements
  loanAmount: number
  loanPurpose: string
  loanTerm: number
  interestRatePreference: string
  loanType: string
  fixedRateTerm: number

  // Additional Features
  offsetAccount: boolean
  redrawFacility: boolean
  extraRepayments: boolean
  interestOnly: boolean
  fixedRate: boolean
  splitLoan: boolean
  packageDiscount: boolean
  noFees: boolean
  portability: boolean
  parentGuarantee: boolean

  // Any other fields
  [key: string]: any
}

// Update the defaultFormData to include the new fields
const defaultFormData: LoanInfoData = {
  // Property Information
  propertyType: "",
  propertyValue: 500000,
  propertyAddress: "",
  propertyUsage: "",
  propertyAge: 0,
  bedrooms: 3,
  bathrooms: 2,
  currentMortgage: 400000,
  currentLender: "",
  currentInterestRate: 0,

  // Personal Information
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  maritalStatus: "",
  dependents: 0,

  // Employment Information
  employmentStatus: "",
  employerName: "",
  jobTitle: "",
  yearsInCurrentJob: 0,
  annualIncome: 80000,
  additionalIncome: 0,
  isSelfEmployed: false,
  // Self-employed specific fields
  businessType: "",
  abnAcn: "",
  businessIndustry: "",
  annualBusinessRevenue: 0,
  // Partner details
  hasPartner: false,
  partnerEmploymentStatus: "",
  partnerEmployerName: "",
  partnerJobTitle: "",
  partnerYearsInCurrentJob: 0,
  partnerAnnualIncome: 0,
  partnerIsSelfEmployed: false,
  partnerBusinessType: "",
  partnerAbnAcn: "",
  partnerBusinessIndustry: "",
  partnerAnnualBusinessRevenue: 0,

  // Financial Information
  creditScore: "",
  monthlyExpenses: 2000,
  existingDebts: 0,
  bankruptcyHistory: "",
  savingsBalance: 20000,
  investments: 0,
  otherAssets: 0,

  // Loan Requirements
  loanAmount: 400000,
  loanPurpose: "",
  loanTerm: 30,
  interestRatePreference: "",
  loanType: "",
  fixedRateTerm: 3,

  // Additional Features
  offsetAccount: false,
  redrawFacility: false,
  extraRepayments: false,
  interestOnly: false,
  fixedRate: false,
  splitLoan: false,
  packageDiscount: false,
  noFees: false,
  portability: false,
  parentGuarantee: false,
}

// Create the context
interface LoanInfoContextType {
  formData: LoanInfoData
  updateFormData: (field: string, value: any) => void
  updateMultipleFields: (fields: Partial<LoanInfoData>) => void
  resetForm: () => void
}

const LoanInfoContext = createContext<LoanInfoContextType | undefined>(undefined)

// Create the provider component
export function LoanInfoProvider({ children }: { children: ReactNode }) {
  // Initialize state with default values
  const [formData, setFormData] = useState<LoanInfoData>(() => {
    // Try to load from localStorage if available (client-side only)
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("loanInfoFormData")
      if (savedData) {
        try {
          return JSON.parse(savedData)
        } catch (error) {
          console.error("Failed to parse saved form data:", error)
        }
      }
    }
    return defaultFormData
  })

  // Function to update a single field
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value }

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("loanInfoFormData", JSON.stringify(newData))
      }

      return newData
    })
  }

  // Function to update multiple fields at once
  const updateMultipleFields = (fields: Partial<LoanInfoData>) => {
    setFormData((prev) => {
      const newData = { ...prev, ...fields }

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("loanInfoFormData", JSON.stringify(newData))
      }

      return newData
    })
  }

  // Function to reset the form
  const resetForm = () => {
    setFormData(defaultFormData)
    if (typeof window !== "undefined") {
      localStorage.removeItem("loanInfoFormData")
    }
  }

  return (
    <LoanInfoContext.Provider value={{ formData, updateFormData, updateMultipleFields, resetForm }}>
      {children}
    </LoanInfoContext.Provider>
  )
}

// Custom hook to use the context
export function useLoanInfo() {
  const context = useContext(LoanInfoContext)
  if (context === undefined) {
    throw new Error("useLoanInfo must be used within a LoanInfoProvider")
  }
  return context
}
