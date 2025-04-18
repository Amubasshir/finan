"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

const defaultFormData: any = {
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
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  maritalStatus: "",
  dependents: 0,
  employmentStatus: "",
  employerName: "",
  jobTitle: "",
  yearsInCurrentJob: 0,
  annualIncome: 80000,
  additionalIncome: 0,
  isSelfEmployed: false,
  businessType: "",
  abnAcn: "",
  businessIndustry: "",
  annualBusinessRevenue: 0,
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
  creditScore: "",
  monthlyExpenses: 2000,
  existingDebts: 0,
  bankruptcyHistory: "",
  savingsBalance: 20000,
  investments: 0,
  otherAssets: 0,
  loanAmount: 400000,
  loanPurpose: "",
  loanTerm: 30,
  interestRatePreference: "",
  loanType: "",
  fixedRateTerm: 3,
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
  formData: any
  updateFormData: (field: string, value: any) => void
  updateMultipleFields: (fields: Partial<any>) => void
  resetForm: () => void
  saveToServer: () => Promise<{ success: boolean; error?: string }>
  isSaving: boolean
}

const LoanInfoContext = createContext<LoanInfoContextType | undefined>(undefined)

// Create the provider component
export function LoanInfoProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<any>(() => {
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
  const [isSaving, setIsSaving] = useState(false)

  const updateFormData = (field: string, value: any) => {
    setFormData((prev:any) => {
      const newData = { ...prev, [field]: value }
      if (typeof window !== "undefined") {
        localStorage.setItem("loanInfoFormData", JSON.stringify(newData))
      }
      return newData
    })
  }

  const updateMultipleFields = (fields: Partial<any>) => {
    setFormData((prev:any) => {
      const newData = { ...prev, ...fields }
      if (typeof window !== "undefined") {
        localStorage.setItem("loanInfoFormData", JSON.stringify(newData))
      }
      return newData
    })
  }

  const resetForm = () => {
    setFormData(defaultFormData)
    if (typeof window !== "undefined") {
      localStorage.removeItem("loanInfoFormData")
    }
  }

  // New function to save form data to API
  const saveToServer = async (): Promise<{ success: boolean; error?: string }> => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/loan-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      // Optionally update localStorage with the response data if needed
      if (typeof window !== "undefined") {
        localStorage.setItem("loanInfoFormData", JSON.stringify(formData))
      }

      return { success: true }
    } catch (error) {
      console.error("Failed to save form data:", error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to save data"
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <LoanInfoContext.Provider 
      value={{ 
        formData, 
        updateFormData, 
        updateMultipleFields, 
        resetForm,
         saveToServer,
        isSaving 
      }}
    >
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