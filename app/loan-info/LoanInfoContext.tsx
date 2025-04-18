"use client"

import api from "@/lib/axios"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
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
  saveToServer: () => Promise<{ success: boolean; errorMessage?: string; successMessage?: string }>
  isLoading: boolean
}

const LoanInfoContext = createContext<LoanInfoContextType | undefined>(undefined)

// Create the provider component
// Update the initial state loading logic
export function LoanInfoProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<any>(() => {
    // Return default initially, will be updated after useEffect
    return defaultFormData
  })


  const updateFormData = (field: string, value: any) => {
    setFormData((prev: any) => {
      const newData = { ...prev, [field]: value }
      if (typeof window !== "undefined") {
        localStorage.setItem("loanInfoFormData", JSON.stringify(newData))
      }
      return newData
    })
  }

  const updateMultipleFields = (fields: Partial<any>) => {
    setFormData((prev: any) => {
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
  // Add new useEffect for initialization
  // Remove the second useEffect that watches formData._id and combine it with the initialization useEffect

  // Update the useEffect dependency array
  useEffect(() => {
    const initializeFormData = async () => {
      setIsLoading(true)
      try {
        const savedData = localStorage.getItem("loanInfoFormData")
        let initialData = defaultFormData
  
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData)
            initialData = parsedData
  
            if (parsedData?._id) {
              const response = await api.get(`/loan-info/${parsedData._id}`)
              if (response?.data?.loanInfo) {
                initialData = response.data.loanInfo
                localStorage.setItem("loanInfoFormData", JSON.stringify(initialData))
              }
            }
            
            setFormData(initialData)
          } catch (error) {
            console.error("Failed to process saved data:", error)
            toast({
              title: "Warning",
              description: "Failed to load saved data. Starting with default values.",
              variant: "destructive",
            })
            setFormData(defaultFormData)
          }
        } else {
          setFormData(defaultFormData)
        }
      } catch (error) {
        console.error("Failed to initialize form data:", error)
        setFormData(defaultFormData)
      } finally {
        setIsLoading(false)
      }
    }
  
    initializeFormData()
  }, [toast]) // Add toast to the dependency array
  
  // Remove the duplicate useEffect that watches formData._id

  // Update saveToServer function to handle _id properly
  const saveToServer = async (): Promise<{ success: boolean; errorMessage?: string; successMessage?: string }> => {
    setIsLoading(true)
    try {
      const dataToSave = { ...formData }
      const loanId = dataToSave._id
      delete dataToSave._id
  
      const response: any = loanId
        ? await api.put(`/loan-info/${loanId}`, dataToSave)
        : await api.post(`/loan-info`, dataToSave)
  
      const updatedData = response?.data?.loanInfo
      
      // Update both state and localStorage with the response data
      setFormData(updatedData)
      localStorage.setItem("loanInfoFormData", JSON.stringify(updatedData))
  
      return {
        success: true,
        successMessage: response?.data?.message || "Data saved successfully"
      }
    } catch (error: any) {
      console.error("Failed to save form data:", error)
      return {
        success: false,
        errorMessage: error?.response?.data?.message || error instanceof Error ? error.message : "Failed to save data"
      }
    } finally {
      setIsLoading(false)
    }
  }

// Fetch loan data when component mounts if formData._id exists
useEffect(() => {
  const fetchLoanData = async () => {
    if (formData?._id) {
      setIsLoading(true)
      try {
        const response = await api.get(`/loan-info/${formData?._id}`)
        const loanInfo = response?.data?.loanInfo
        setFormData(loanInfo)
        
        // Save to localStorage if window is available
        if (typeof window !== "undefined") {
          localStorage.setItem("loanInfoFormData", JSON.stringify(loanInfo))
        }
      } catch (error) {
        console.error("Failed to fetch loan data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch loan information",
          variant: "destructive",
        })
        
        // Clear localStorage on error if window is available
        if (typeof window !== "undefined") {
          localStorage.removeItem("loanInfoFormData")
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  fetchLoanData()
}, [formData?._id, toast])
  return (
    <LoanInfoContext.Provider
      value={{
        formData,
        updateFormData,
        updateMultipleFields,
        resetForm,
        saveToServer,
        isLoading
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