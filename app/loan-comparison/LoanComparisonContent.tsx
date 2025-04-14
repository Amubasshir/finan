"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AIRefinanceChat } from "@/components/AIRefinanceChat"
import {
  Calculator,
  Percent,
  CheckCircle,
  TrendingDown,
  CreditCard,
  Star,
  Zap,
  ArrowRight,
  Users,
  BarChart4,
  Clock,
} from "lucide-react"

export default function LoanComparisonContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loanAmount, setLoanAmount] = useState(300000)
  const [loanTerm, setLoanTerm] = useState(30)
  const [interestRate, setInterestRate] = useState(5.35)
  const [estimatedMonthlyPayment, setEstimatedMonthlyPayment] = useState(0)
  const [estimatedSavings, setEstimatedSavings] = useState(24500)
  const [estimatedCashback, setEstimatedCashback] = useState(7800)
  const [yearlySavings, setYearlySavings] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const amount = searchParams.get("amount")
    const term = searchParams.get("term")
    const rate = searchParams.get("rate")
    if (amount) setLoanAmount(Number.parseInt(amount))
    if (term) setLoanTerm(Number.parseInt(term))
    if (rate) setInterestRate(Number.parseFloat(rate))
  }, [searchParams])

  useEffect(() => {
    const monthlyInterestRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12
    const estimatedPayment = (
      (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
    ).toFixed(2)
    setEstimatedMonthlyPayment(Number(estimatedPayment))

    // Calculate yearly savings (compared to average market rate of 6.25%)
    const averageRate = 6.25
    const averageMonthlyRate = averageRate / 100 / 12
    const averagePayment =
      (loanAmount * averageMonthlyRate * Math.pow(1 + averageMonthlyRate, numberOfPayments)) /
      (Math.pow(1 + averageMonthlyRate, numberOfPayments) - 1)
    const monthlySavings = averagePayment - Number(estimatedPayment)
    setYearlySavings(Math.round(monthlySavings * 12))
  }, [loanAmount, loanTerm, interestRate])

  useEffect(() => {
    // Simulate progress animation
    const timer = setTimeout(() => setProgress(100), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleContinueToPreApproval = () => {
    router.push(`/document-upload?amount=${loanAmount}&term=${loanTerm}&rate=${interestRate}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2 text-center">Your Home Loan Estimate</h1>
      <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
        Based on your information, here's what you could expect. Refii will take your application to multiple lenders
        who will compete to offer you the best possible rate.
      </p>

      {/* Main Estimate Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 shadow-md overflow-hidden">
        <CardHeader className="pb-2 border-b border-blue-100">
          <CardTitle className="text-2xl font-bold text-blue-800">Your Estimated Loan Details</CardTitle>
          <CardDescription className="text-blue-700">
            Refii will help lenders compete for your business to get you the best rate
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100 transform transition-all duration-300 hover:scale-105 hover:shadow-md">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-3 rounded-full mr-3">
                  <Percent className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Expected Rate</h3>
              </div>
              <p className="text-4xl font-bold text-blue-600 mb-1">{interestRate}%</p>
              <p className="text-sm text-gray-500">
                <span className="text-green-600 font-medium">0.90% lower</span> than average market rate of 6.25%
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100 transform transition-all duration-300 hover:scale-105 hover:shadow-md">
              <div className="flex items-center mb-3">
                <div className="bg-green-100 p-3 rounded-full mr-3">
                  <TrendingDown className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Potential Savings</h3>
              </div>
              <p className="text-4xl font-bold text-green-600 mb-1">${estimatedSavings.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Over the life of your loan</p>
              <p className="text-sm font-medium text-green-600 mt-2">
                ${yearlySavings.toLocaleString()} saved per year
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-amber-100 transform transition-all duration-300 hover:scale-105 hover:shadow-md">
              <div className="flex items-center mb-3">
                <div className="bg-amber-100 p-3 rounded-full mr-3">
                  <CreditCard className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Cashback Offer</h3>
              </div>
              <p className="text-4xl font-bold text-amber-600 mb-1">${estimatedCashback.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Available through select lender partnerships</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100 mb-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-3">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Loan Summary</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Loan Amount</p>
                <p className="text-2xl font-semibold">${loanAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Loan Term</p>
                <p className="text-2xl font-semibold">{loanTerm} years</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Monthly Payment</p>
                <p className="text-2xl font-semibold">
                  ${estimatedMonthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Loan Type</p>
                <p className="text-2xl font-semibold">Variable Rate</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How Refii Works Card */}
      <Card className="border-blue-200 shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <CardTitle className="text-2xl font-bold">How Refii Gets You The Best Rate</CardTitle>
          <CardDescription className="text-blue-100">
            Our unique bidding process creates competition among lenders
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Multiple Lenders</h3>
              <p className="text-gray-600">
                We submit your application to multiple lenders simultaneously, saving you time and effort
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <BarChart4 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Competitive Bidding</h3>
              <p className="text-gray-600">
                Lenders compete against each other to offer you the lowest rate and best terms
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-amber-100 p-4 rounded-full mb-4">
                <Star className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Best Offer Selection</h3>
              <p className="text-gray-600">
                You get to choose from the best offers, with potential for additional negotiation
              </p>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">The Refii Advantage</h3>

            <div className="space-y-3">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  <span className="font-medium">Save time and effort</span> - One application reaches multiple lenders
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  <span className="font-medium">Lower rates</span> - Lenders compete to win your business
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  <span className="font-medium">Better terms</span> - Competition often leads to improved loan features
                  and cashback offers
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  <span className="font-medium">Expert guidance</span> - Our team helps you understand and select the
                  best option
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-gray-50 border-t px-6 py-4">
          <div className="w-full flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Clock className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-gray-600">
                Average time to receive offers: <span className="font-medium">3-5 business days</span>
              </span>
            </div>
            <Button
              onClick={handleContinueToPreApproval}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue to Pre-Approval
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* What to Expect Next */}
      <Card className="border-gray-200 shadow-md">
        <CardHeader>
          <CardTitle>What Happens Next?</CardTitle>
          <CardDescription>Here's how the process works after you submit your application</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-800 font-medium text-sm mr-4 mt-1 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Document Collection</h3>
                <p className="text-gray-600">
                  You'll provide the necessary documents to verify your information and strengthen your application
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-800 font-medium text-sm mr-4 mt-1 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Lender Bidding</h3>
                <p className="text-gray-600">
                  Multiple lenders review your application and compete to offer you the best rate and terms
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-800 font-medium text-sm mr-4 mt-1 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Offer Selection</h3>
                <p className="text-gray-600">
                  You'll receive multiple conditional approvals and select the offer that best meets your needs
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-800 font-medium text-sm mr-4 mt-1 flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Final Approval & Settlement</h3>
                <p className="text-gray-600">
                  Complete the final steps with your chosen lender to finalize your new home loan
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t pt-6 flex justify-center">
          <Button
            onClick={handleContinueToPreApproval}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8"
          >
            Start My Application
            <Zap className="ml-2 h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>

      {/* Chat with AI Assistant */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Questions? Chat with Our AI Home Loan Assistant</CardTitle>
          <CardDescription>Get instant answers about the loan process, rates, or any other questions</CardDescription>
        </CardHeader>
        <CardContent>
          <AIRefinanceChat />
        </CardContent>
      </Card>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={handleContinueToPreApproval}
          size="lg"
          className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg rounded-full px-6 py-6 flex items-center"
        >
          <span className="mr-2">Continue to Pre-Approval</span>
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
