"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function RefinanceCompletion() {
  const [showDetails, setShowDetails] = useState(false)

  const loanDetails = {
    lender: "Refii Bank",
    interestRate: "3.25%",
    loanTerm: "30 years",
    monthlyPayment: "$1,500",
    totalSavings: "$50,000 over the life of the loan",
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="text-3xl font-bold">Congratulations! Your Refinance is Complete</h1>
        <p className="text-xl text-gray-600">Your new loan has been finalized and is now active.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Loan Summary</CardTitle>
          <CardDescription>Here's an overview of your refinanced loan</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">New Lender</dt>
              <dd className="mt-1 text-sm text-gray-900">{loanDetails.lender}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Interest Rate</dt>
              <dd className="mt-1 text-sm text-gray-900">{loanDetails.interestRate}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Loan Term</dt>
              <dd className="mt-1 text-sm text-gray-900">{loanDetails.loanTerm}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Monthly Payment</dt>
              <dd className="mt-1 text-sm text-gray-900">{loanDetails.monthlyPayment}</dd>
            </div>
          </dl>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-900">Total Savings: {loanDetails.totalSavings}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Review your new loan documents carefully</li>
            <li>Set up automatic payments with your new lender</li>
            <li>Update your budget to reflect your new monthly payment</li>
            <li>Consider what to do with your monthly savings</li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-center space-x-4">
        <Button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Hide Full Loan Details" : "View Full Loan Details"}
        </Button>
        <Link href="/dashboard">
          <Button variant="outline">Go to Dashboard</Button>
        </Link>
      </div>

      {showDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Full Loan Details</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add more detailed loan information here */}
            <p>
              Detailed loan information would be displayed here, including full amortization schedule, all fees, and
              terms and conditions.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
