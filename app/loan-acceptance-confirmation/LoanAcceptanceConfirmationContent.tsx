"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download, Calendar, ChevronRight, Phone, Clock, FileText, Home, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AcceptedLoan {
  id: string
  lender: string
  amount: number
  interestRate: number
  term: number
  monthlyRepayment: number
  settlementDate: string
  referenceNumber: string
  logoUrl: string
}

export default function LoanAcceptanceConfirmationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const loanId = searchParams.get("loanId")
  const [loan, setLoan] = useState<AcceptedLoan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching the accepted loan details
    const fetchLoanDetails = async () => {
      setLoading(true)
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data for the accepted loan
      const mockLoan: AcceptedLoan = {
        id: loanId || "loan1",
        lender: "Commonwealth Bank",
        amount: 250000,
        interestRate: 5.49,
        term: 15,
        monthlyRepayment: 2012.45,
        settlementDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        referenceNumber: "HL-" + Math.floor(100000 + Math.random() * 900000),
        logoUrl: "/placeholder.svg?height=60&width=120",
      }

      setLoan(mockLoan)
      setLoading(false)
    }

    fetchLoanDetails()
  }, [loanId])

  if (loading || !loan) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
        <h1 className="text-3xl font-bold mb-4">Processing Your Acceptance</h1>
        <p className="text-gray-600 mb-8">Please wait while we process your loan acceptance...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold mb-2">Loan Offer Accepted!</h1>
        <p className="text-gray-600 text-lg">
          Congratulations! You've successfully accepted your pre-approved loan offer and are moving to final approval.
        </p>
      </div>

      <Card className="mb-8 border-green-300 shadow-lg">
        <CardHeader className="pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-green-50 to-green-100">
          <div>
            <CardTitle className="text-2xl">Final Approval Process Started</CardTitle>
            <CardDescription className="text-base">Reference: {loan.referenceNumber}</CardDescription>
          </div>
          <div className="flex-shrink-0">
            <img src={loan.logoUrl || "/placeholder.svg"} alt={`${loan.lender} logo`} className="h-12" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Lender</h3>
              <p className="text-lg font-semibold">{loan.lender}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Loan Amount</h3>
              <p className="text-lg font-semibold">${loan.amount.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Interest Rate</h3>
              <p className="text-lg font-semibold">{loan.interestRate}%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Loan Term</h3>
              <p className="text-lg font-semibold">{loan.term} years</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Monthly Repayment</h3>
              <p className="text-lg font-semibold">${loan.monthlyRepayment.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Expected Settlement Date</h3>
              <p className="text-lg font-semibold flex items-center">
                <Calendar className="h-4 w-4 mr-2" /> {loan.settlementDate}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 pt-2 pb-6 px-6 bg-gray-50">
          <Button className="w-full sm:w-auto" onClick={() => {}}>
            <Download className="mr-2 h-5 w-5" /> Download Acceptance
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push("/settlement-tracking")}>
            <Clock className="mr-2 h-5 w-5" /> Track Settlement Progress
          </Button>
        </CardFooter>
      </Card>
      <Alert className="mt-6 bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">From Pre-Approval to Final Approval</AlertTitle>
        <AlertDescription className="text-blue-700">
          Your pre-approved loan is now moving to the final approval stage. The lender will conduct a property valuation
          and final assessment before issuing unconditional approval.
        </AlertDescription>
      </Alert>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Clock className="mr-2 h-5 w-5 text-blue-600" />
          Next Steps in Your Refinancing Journey
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3">
                1
              </div>
              <div>
                <p className="font-medium">Formal Loan Application</p>
                <p className="text-gray-600">Your pre-approval will now be converted to a formal loan application.</p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3">
                2
              </div>
              <div>
                <p className="font-medium">Property Valuation</p>
                <p className="text-gray-600">The lender will arrange for a professional valuation of your property.</p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3">
                3
              </div>
              <div>
                <p className="font-medium">Loan Documentation</p>
                <p className="text-gray-600">We'll prepare your formal loan documents within 2-3 business days.</p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3">
                4
              </div>
              <div>
                <p className="font-medium">Document Review & Signing</p>
                <p className="text-gray-600">Review and sign all required documents.</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3">
                5
              </div>
              <div>
                <p className="font-medium">Final Approval</p>
                <p className="text-gray-600">
                  The lender will conduct a final review before giving unconditional approval.
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3">
                6
              </div>
              <div>
                <p className="font-medium">Settlement Preparation</p>
                <p className="text-gray-600">
                  Your new lender will coordinate with your current lender to arrange settlement.
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3">
                7
              </div>
              <div>
                <p className="font-medium">Settlement</p>
                <p className="text-gray-600">On settlement day, your new lender pays out your existing loan.</p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3">
                8
              </div>
              <div>
                <p className="font-medium">New Loan Activation</p>
                <p className="text-gray-600">Your new home loan is activated with all features available.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-blue-600" />
            Your Refinancing Timeline
          </CardTitle>
          <CardDescription>Estimated timeframe for your refinancing process</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-blue-100"></div>

            <div className="relative z-10 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4 shadow-md">
                  Day 1
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-grow">
                  <h3 className="font-semibold">Loan Offer Acceptance</h3>
                  <p className="text-gray-600">You've accepted your loan offer. Formal application process begins.</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4 shadow-md">
                  Day 3-5
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-grow">
                  <h3 className="font-semibold">Property Valuation</h3>
                  <p className="text-gray-600">Valuer inspects your property and submits report to the lender.</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4 shadow-md">
                  Day 7-10
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-grow">
                  <h3 className="font-semibold">Loan Documentation</h3>
                  <p className="text-gray-600">You receive and review your loan documents.</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4 shadow-md">
                  Day 14-21
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-grow">
                  <h3 className="font-semibold">Final Approval</h3>
                  <p className="text-gray-600">
                    Lender issues unconditional approval after reviewing signed documents.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4 shadow-md">
                  Day 30-45
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-grow">
                  <h3 className="font-semibold">Settlement Day</h3>
                  <p className="text-gray-600">
                    Your refinancing is complete! Your old loan is paid out and your new loan begins.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-green-600" />
            Settlement Preparation
          </CardTitle>
          <CardDescription>Your documents are ready for the next steps</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <h3 className="font-semibold mb-2 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Documents Submitted
              </h3>
              <p className="text-gray-600">All your required documents have been successfully uploaded and verified.</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <h3 className="font-semibold mb-2 flex items-center">
                <Home className="h-5 w-5 text-blue-500 mr-2" /> Property Information
              </h3>
              <p className="text-gray-600">
                Your property details have been confirmed and are ready for the valuation process.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <h3 className="font-semibold mb-2 flex items-center">
                <Calendar className="h-5 w-5 text-purple-500 mr-2" /> Settlement Scheduling
              </h3>
              <p className="text-gray-600">We'll coordinate with all parties to set a convenient settlement date.</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <h3 className="font-semibold mb-2 flex items-center">
                <Phone className="h-5 w-5 text-green-500 mr-2" /> Support Available
              </h3>
              <p className="text-gray-600">
                Our settlement specialists are available to answer any questions during the process.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center space-y-4">
        <p className="text-gray-600 text-lg">
          A loan specialist will contact you shortly to guide you through the next steps.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => router.push("/dashboard")}>
            Go to Dashboard <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" onClick={() => router.push("/settlement-tracking")}>
            <Clock className="mr-2 h-5 w-5" /> Track Settlement Progress
          </Button>
          <Button variant="outline" onClick={() => router.push("/contact-specialist")}>
            <Phone className="mr-2 h-5 w-5" /> Contact Loan Specialist
          </Button>
        </div>
      </div>
    </div>
  )
}
