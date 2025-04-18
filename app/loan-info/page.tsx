"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { loanInfoAPI } from "@/lib/api"

export default function LoanInfoDefaultPage() {
  const router = useRouter()

  useEffect(() => {
    const createNewLoan = async () => {
      try {
        // Create a new loan application
        const response = await loanInfoAPI.createLoanInfo({
          status: 'draft'
        })
        
        if (response.data.success && response.data.loanInfo._id) {
          // Redirect to the property page with the new ID
          localStorage.setItem("loanInfoFormData", JSON.stringify({_id: response?.data?.loanInfo?._id}))
          router.push(`/loan-info/property`)
        } else {
          // If API fails, just redirect to a new loan
          router.push("/loan-info/property")
        }
      } catch (error) {
        console.error("Failed to create new loan:", error)
        // If API fails, just redirect to a new loan
        router.push("/loan-info/property")
      }
    }
    
    createNewLoan()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-3 text-blue-600">Creating new loan application...</p>
    </div>
  )
}
