"use client"

import api from "@/lib/axios"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

const defaultFormData: any = {
  personal: {
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    maritalStatus: "",
    dependents: 0,
  },
  employment: {
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
  },
  financial: {
    creditScore: "",
    monthlyExpenses: 2000,
    existingDebts: 0,
    bankruptcyHistory: "",
    savingsBalance: 20000,
    investments: 0,
    otherAssets: 0,
  },
  property: {
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
  },
  loanRequirements: {
    loanAmount: 400000,
    loanPurpose: "",
    loanTerm: 30,
    interestRatePreference: "",
    loanType: "",
    fixedRateTerm: 3,
  },
  additionalFeatures: {
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
}

interface LoanInfoContextType {
  formData: any
  updateFormData: (field: string, value: any) => void
  updateMultipleFields: (fields: Partial<any>) => void
  resetForm: () => void
  saveToServer: (data: any) => Promise<{ success: boolean; errorMessage?: string; successMessage?: string }>
  isLoading: boolean
}

const LoanInfoContext = createContext<LoanInfoContextType | undefined>(undefined)

export function LoanInfoProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<any>(defaultFormData)

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
                localStorage.setItem("loanInfoFormData", JSON.stringify({_id: response?.data?.loanInfo?._id}))
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
  }, [toast])

  const saveToServer = async (data: any): Promise<{ success: boolean; errorMessage?: string; successMessage?: string }> => {
    setIsLoading(true)
    try {
      const dataToSave = { ...formData, ...data }
      const loanId = dataToSave._id
      delete dataToSave._id

      const response: any = loanId
        ? await api.put(`/loan-info/${loanId}`, dataToSave)
        : await api.post(`/loan-info`, dataToSave)

      const updatedData = response?.data?.loanInfo
      
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

export function useLoanInfo() {
  const context = useContext(LoanInfoContext)
  if (context === undefined) {
    throw new Error("useLoanInfo must be used within a LoanInfoProvider")
  }
  return context
}