"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useParams } from "next/navigation"
import { loanInfoAPI } from "@/lib/api"
import { LoanApplicationInterface } from "@/lib/types/loanAplication"

// Define the shape of our form data
// We can reuse the interface from lib/types/loanInfo.ts
// import { LoanInfoData } from "@/lib/types/loanInfo"

// Update the defaultFormData to include the new fields
const defaultFormData: LoanApplicationInterface = {
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
  formData: LoanApplicationInterface
  updateFormData: (field: string, value: any) => void
  updateMultipleFields: (fields: Partial<LoanApplicationInterface>) => void
  resetForm: () => void
  saveToServer: () => Promise<void>
  isLoading: boolean
  error: string | null
  loanInfoId: string | null
}

const LoanInfoContext = createContext<LoanInfoContextType | undefined>(undefined)

// Create the provider component
export function LoanInfoProvider({ children }: { children: ReactNode }) {
  const params = useParams()
  const loanInfoId = params?.id as string || null
  
  // State for form data and API interaction
  const [formData, setFormData] = useState<LoanApplicationInterface>(defaultFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Load data from server or localStorage on mount
  useEffect(() => {
    const loadData = async () => {
      setIsMounted(true)
      
      if (loanInfoId) {
        // If we have an ID, try to load from server
        try {
          setIsLoading(true)
          setError(null)
          const response = await loanInfoAPI.getLoanInfoById(loanInfoId)
          if (response.data.success) {
            setFormData(response.data.loanInfo)
            // Also update localStorage for backup
            if (typeof window !== "undefined") {
              localStorage.setItem("loanInfoFormData", JSON.stringify(response.data.loanInfo))
            }
          }
        } catch (err: any) {
          console.error("Failed to load loan info:", err)
          setError(err.message || "Failed to load loan information")
          
          // Fall back to localStorage if available
          if (typeof window !== "undefined") {
            const savedData = localStorage.getItem("loanInfoFormData")
            if (savedData) {
              try {
                setFormData(JSON.parse(savedData))
              } catch (parseErr) {
                console.error("Failed to parse saved form data:", parseErr)
              }
            }
          }
        } finally {
          setIsLoading(false)
        }
      } else {
        // No ID, just load from localStorage
        if (typeof window !== "undefined") {
          const savedData = localStorage.getItem("loanInfoFormData")
          if (savedData) {
            try {
              setFormData(JSON.parse(savedData))
            } catch (error) {
              console.error("Failed to parse saved form data:", error)
            }
          }
        }
      }
    }

    loadData()
  }, [loanInfoId])

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
  const updateMultipleFields = (fields: Partial<LoanApplicationInterface>) => {
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
  
  // Function to save data to server
  const saveToServer = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      if (loanInfoId) {
        // Update existing loan info
        const response = await loanInfoAPI.updateLoanInfo(loanInfoId, formData)
        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to update loan information")
        }
      } else {
        // Create new loan info
        const response = await loanInfoAPI.createLoanInfo(formData)
        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to create loan information")
        }
      }
    } catch (err: any) {
      console.error("Failed to save loan info:", err)
      setError(err.message || "Failed to save loan information")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Only provide the context if we're mounted (to avoid hydration issues)
  if (!isMounted) {
    return <>{children}</>
  }

  return (
    <LoanInfoContext.Provider 
      value={{ 
        formData, 
        updateFormData, 
        updateMultipleFields, 
        resetForm, 
        saveToServer,
        isLoading,
        error,
        loanInfoId
      }}
    >
      {children}
    </LoanInfoContext.Provider>
  )
}

// Custom hook to use the loan info context
export function useLoanInfo() {
  const context = useContext(LoanInfoContext)
  if (context === undefined) {
    throw new Error("useLoanInfo must be used within a LoanInfoProvider")
  }
  return context
}
