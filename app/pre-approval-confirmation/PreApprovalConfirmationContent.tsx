"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, Info, ArrowRight, Shield, Percent, DollarSign, Calendar, Clock, Users } from "lucide-react"

export default function PreApprovalConfirmationContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [approvalStats, setApprovalStats] = useState({
    lenderCount: 19,
    maxLoanAmount: 450000,
    bestInterestRate: 4.99,
    validityDays: 90,
  })

  useEffect(() => {
    // Simulate API delay
    const loadData = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setLoading(false)
    }

    loadData()
  }, [])

  const handleContinueApplication = () => {
    router.push("/document-upload")
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
        >
          Continue to Document Upload
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
