"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, Info, ArrowRight, Shield, Percent, DollarSign, Calendar, Clock, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/axios"

export default function PreApprovalConfirmationContent() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const id = params?.id as string
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loanInfo, setLoanInfo] = useState<any>(null)
  const [approvalStats, setApprovalStats] = useState({
    lenderCount: 0,
    maxLoanAmount: 0,
    bestInterestRate: 0,
    validityDays: 0,
  })

  useEffect(() => {
    const fetchLoanInfo = async () => {
      if (!id) {
        setError("Loan application ID is missing.")
        setLoading(false)
        return
      }
      
      try {
        const response = await api.get(`/loan-info/${id}`)
        if (response.data.success) {
          const loanInfo = response.data.loanInfo
          setLoanInfo(loanInfo)
          
          // Calculate approval stats based on loan amount and other factors
          const loanAmount = loanInfo.loanRequirements?.loanAmount || 0
          
          setApprovalStats({
            lenderCount: Math.floor(Math.random() * 5) + 3, // Simulate 3-7 lenders
            maxLoanAmount: loanAmount,
            bestInterestRate: parseFloat((Math.random() * (1.5) + 3.5).toFixed(2)), // Random rate between 3.5% and 5%
            validityDays: 90, // Standard validity period
          })
        } else {
          throw new Error(response.data.message || "Failed to fetch loan information")
        }
      } catch (err) {
        console.error("Fetch loan info error:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        toast({
          title: "Error fetching loan information",
          description: err instanceof Error ? err.message : "Could not load loan data.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLoanInfo()
  }, [id, toast])

  const handleContinueApplication = async () => {
    if (!id) return
    
    setSubmitting(true)
    try {
      // Update loan status to indicate pre-approval confirmation
      const response = await api.put(`/loan-info/${id}`, { 
        status: 'pre-approved',
        preApprovalDate: new Date().toISOString(),
        preApprovalDetails: {
          lenderCount: approvalStats.lenderCount,
          maxLoanAmount: approvalStats.maxLoanAmount,
          bestInterestRate: approvalStats.bestInterestRate,
          validityDays: approvalStats.validityDays,
          expiryDate: new Date(Date.now() + approvalStats.validityDays * 24 * 60 * 60 * 1000).toISOString()
        }
      })
      
      if (response.data.success) {
        // Navigate to document upload page
        router.push(`/document-upload/${id}`)
      } else {
        throw new Error(response.data.message || "Failed to update loan status")
      }
    } catch (error) {
      console.error("Error updating loan status:", error)
      toast({
        title: "Error updating application",
        description: error instanceof Error ? error.message : "Could not update application status.",
        variant: "destructive",
      })
      // Continue to document upload even if update fails
      router.push(`/document-upload/${id}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Processing Your Information</h1>
          <p className="text-gray-600 mb-8">Please wait while we check your conditional approval status...</p>
          <div className="w-16 h-16 border-4 border-t-blue-600 border-b-blue-600 border-l-transparent border-r-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold mb-2">Congratulations!</h1>
        <p className="text-xl text-gray-600 mb-6">
          Based on the information you've provided, you've been conditionally approved by {approvalStats.lenderCount}{" "}
          Australian lenders.
        </p>

        {/* Refii Logo */}
        <div className="flex justify-center mb-8">
          <div
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex items-center justify-center"
            style={{ height: "80px", width: "200px" }}
          >
            <img
              src="/placeholder.svg?height=60&width=160&text=Refii"
              alt="Refii logo"
              className="h-12 object-contain mx-auto"
            />
          </div>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-green-600" />
            Your Conditional Approval Summary
          </CardTitle>
          <CardDescription>Here's a summary of your conditional approval offers negotiated by Refii</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center text-blue-700 mb-1">
                <DollarSign className="h-4 w-4 mr-1" />
                <p className="text-sm font-medium">Maximum Loan Amount</p>
              </div>
              <p className="text-2xl font-bold">${approvalStats.maxLoanAmount.toLocaleString()}</p>
              <p className="text-xs text-blue-600 mt-1">Highest available amount</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center text-blue-700 mb-1">
                <Percent className="h-4 w-4 mr-1" />
                <p className="text-sm font-medium">Best Interest Rate</p>
              </div>
              <p className="text-2xl font-bold text-green-600">{approvalStats.bestInterestRate}%</p>
              <p className="text-xs text-blue-600 mt-1">Lowest available rate</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center text-blue-700 mb-1">
                <Calendar className="h-4 w-4 mr-1" />
                <p className="text-sm font-medium">Approval Validity</p>
              </div>
              <p className="text-2xl font-bold">{approvalStats.validityDays} Days</p>
              <p className="text-xs text-blue-600 mt-1">From today's date</p>
            </div>
          </div>

          <Alert className="bg-blue-50 border-blue-100 mb-6">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">What does conditional approval mean?</AlertTitle>
            <AlertDescription className="text-blue-700">
              Conditional approval is the first step in the loan process, indicating that lenders are willing to offer
              you a loan based on the information provided. To move to pre-approval and then final approval, you'll need
              to submit supporting documents for verification.
            </AlertDescription>
          </Alert>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Refii Will Negotiate On Your Behalf</h3>
                <p className="text-gray-600">
                  Instead of dealing with multiple lenders yourself, Refii will negotiate with all{" "}
                  {approvalStats.lenderCount} lenders on your behalf to secure the best possible interest rate and loan
                  terms based on your specific needs and financial situation.
                </p>
              </div>
            </div>
          </div>

          <Alert className="bg-amber-50 border-amber-100 mb-6">
            <Clock className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Time-Sensitive Offer</AlertTitle>
            <AlertDescription className="text-amber-700">
              These conditional approval offers are valid for {approvalStats.validityDays} days. To secure your
              preferred rate and terms, continue your application now.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-blue-800">The Loan Approval Process</h3>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-blue-200"></div>

          <div className="relative z-10 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4 shadow-sm">
                Step 1
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-grow">
                <h4 className="font-semibold text-lg mb-1">Conditional Approval ✓</h4>
                <p className="text-gray-600">
                  You are here! Based on the information provided, lenders have conditionally approved your loan
                  application.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4 shadow-sm">
                Step 2
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-grow">
                <h4 className="font-semibold text-lg mb-1">Document Verification</h4>
                <p className="text-gray-600">
                  Upload required documents to verify your identity, income, and property details.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4 shadow-sm">
                Step 3
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-grow">
                <h4 className="font-semibold text-lg mb-1">Lender Bidding & Negotiation</h4>
                <p className="text-gray-600">
                  Lenders bid for your loan, and Refii negotiates on your behalf to secure the best possible terms.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4 shadow-sm">
                Step 4
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-grow">
                <h4 className="font-semibold text-lg mb-1">Final Approval & Settlement</h4>
                <p className="text-gray-600">
                  Once you select a loan offer, Refii will help finalise your application and prepare for settlement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button
          size="lg"
          className="px-8 py-6 text-lg bg-green-600 hover:bg-green-700 text-white"
          onClick={handleContinueApplication}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <div className="mr-2 h-4 w-4 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              Continue to Document Upload
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}