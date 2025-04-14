import { createContext, useContext, useState, type ReactNode } from "react"

interface LoanInfoContextType {
  formData: {
    employment: {
      employmentStatus: string
      employmentType: string
      employerName: string
      jobTitle: string
      yearsInCurrentJob: string
      annualIncome: string
      additionalIncome: string
    }
    financial: {
      creditScore: string
      monthlyDebts: string
      bankruptcyHistory: string
    }
    loanRequirements: {
      loanPurpose: string
      loanAmount: string
      loanTerm: string
      interestRatePreference: string
    }
    property: {
      propertyType: string
      propertyUse: string
      propertyValue: string
      propertyAddress: string
      propertyCity: string
      propertyState: string
      propertyZip: string
    }
    additionalFeatures: {
      offsetAccount: boolean
      redrawFacility: boolean
      extraRepayments: boolean
      interestOnlyPeriod: boolean
      fixedRatePeriod: boolean
    }
  }
  updateFormData: (section: string, data: any) => void
}

const LoanInfoContext = createContext<LoanInfoContextType | undefined>(undefined)

export function LoanInfoProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState({
    employment: {
      employmentStatus: "",
      employmentType: "",
      employerName: "",
      jobTitle: "",
      yearsInCurrentJob: "",
      annualIncome: "",
      additionalIncome: "",
    },
    financial: {
      creditScore: "",
      monthlyDebts: "",
      bankruptcyHistory: "",
    },
    loanRequirements: {
      loanPurpose: "",
      loanAmount: "",
      loanTerm: "",
      interestRatePreference: "",
    },
    property: {
      propertyType: "",
      propertyUse: "",
      propertyValue: "",
      propertyAddress: "",
      propertyCity: "",
      propertyState: "",
      propertyZip: "",
    },
    additionalFeatures: {
      offsetAccount: false,
      redrawFacility: false,
      extraRepayments: false,
      interestOnlyPeriod: false,
      fixedRatePeriod: false,
    },
  })

  const updateFormData = (section: string, data: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section as keyof typeof prevData],
        ...data,
      },
    }))
  }

  return <LoanInfoContext.Provider value={{ formData, updateFormData }}>{children}</LoanInfoContext.Provider>
}

export function useLoanInfo() {
  const context = useContext(LoanInfoContext)
  if (context === undefined) {
    throw new Error("useLoanInfo must be used within a LoanInfoProvider")
  }
  return context
}
