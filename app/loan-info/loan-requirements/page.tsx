"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle, DollarSign, Clock, Percent } from "lucide-react"
import { useLoanInfo } from "../LoanInfoContext"

export default function LoanRequirements() {
  const { formData, updateFormData } = useLoanInfo()
  const [formState, setFormState] = useState({
    loanAmount: formData.loanAmount || 400000,
    loanPurpose: formData.loanPurpose || "",
    loanTerm: formData.loanTerm || 30,
    interestRatePreference: formData.interestRatePreference || "",
    loanType: formData.loanType || "",
    fixedRateTerm: formData.fixedRateTerm || 3,
  })

  const handleSelectChange = (name: string) => (value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }))
    updateFormData(name, value)
  }

  const handleSliderChange = (name: string) => (value: number[]) => {
    setFormState((prev) => ({ ...prev, [name]: value[0] }))
    updateFormData(name, value[0])
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(value)
  }

  // Calculate estimated monthly repayment (simplified)
  const calculateMonthlyRepayment = () => {
    const principal = formState.loanAmount
    const interestRate = 0.0499 // Assuming 4.99% interest rate
    const monthlyRate = interestRate / 12
    const numberOfPayments = formState.loanTerm * 12

    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

    return monthlyPayment
  }

  const monthlyRepayment = calculateMonthlyRepayment()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-sm">
        <CardContent className="p-6 space-y-6">
          <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-blue-500 mr-2" />
                    <Label htmlFor="loanAmount" className="font-medium text-gray-700">
                      Desired Loan Amount
                    </Label>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(formState.loanAmount)}</span>
                </div>
                <Slider
                  id="loanAmount"
                  min={100000}
                  max={1500000}
                  step={10000}
                  value={[formState.loanAmount]}
                  onValueChange={handleSliderChange("loanAmount")}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$100k</span>
                  <span>$500k</span>
                  <span>$1M</span>
                  <span>$1.5M</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-blue-500 mr-2" />
                    <Label htmlFor="loanTerm" className="font-medium text-gray-700">
                      Loan Term (Years)
                    </Label>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{formState.loanTerm} years</span>
                </div>
                <Slider
                  id="loanTerm"
                  min={1}
                  max={30}
                  step={1}
                  value={[formState.loanTerm]}
                  onValueChange={handleSliderChange("loanTerm")}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1 year</span>
                  <span>10 years</span>
                  <span>20 years</span>
                  <span>30 years</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-700">Estimated Monthly Repayment</h4>
                    <p className="text-xs text-gray-500">Based on 4.99% interest rate</p>
                  </div>
                  <div className="text-xl font-bold text-blue-600">
                    {formatCurrency(monthlyRepayment)}
                    <span className="text-sm font-normal text-gray-500">/month</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="pt-6 border-t border-gray-200"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Label htmlFor="loanPurpose" className="font-medium text-gray-700">
                      Loan Purpose
                    </Label>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Different loan purposes may have different interest rates and eligibility criteria.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select onValueChange={handleSelectChange("loanPurpose")} value={formState.loanPurpose}>
                  <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                    <SelectValue placeholder="Select loan purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchase">Property Purchase</SelectItem>
                    <SelectItem value="refinance">Refinance Existing Mortgage</SelectItem>
                    <SelectItem value="investment">Investment Property</SelectItem>
                    <SelectItem value="construction">Home Construction</SelectItem>
                    <SelectItem value="renovation">Home Renovation</SelectItem>
                    <SelectItem value="equity">Access Home Equity</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Label htmlFor="loanType" className="font-medium text-gray-700">
                      Loan Type
                    </Label>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Different loan types offer different features and flexibility.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select onValueChange={handleSelectChange("loanType")} value={formState.loanType}>
                  <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                    <SelectValue placeholder="Select loan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Variable</SelectItem>
                    <SelectItem value="fixed">Fixed Rate</SelectItem>
                    <SelectItem value="split">Split Loan</SelectItem>
                    <SelectItem value="interest">Interest Only</SelectItem>
                    <SelectItem value="offset">Offset Account</SelectItem>
                    <SelectItem value="package">Home Loan Package</SelectItem>
                    <SelectItem value="basic">Basic Home Loan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Percent className="h-4 w-4 text-blue-500 mr-2" />
                    <Label htmlFor="interestRatePreference" className="font-medium text-gray-700">
                      Interest Rate Preference
                    </Label>
                  </div>
                </div>
                <Select
                  onValueChange={handleSelectChange("interestRatePreference")}
                  value={formState.interestRatePreference}
                >
                  <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                    <SelectValue placeholder="Select interest rate preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Rate</SelectItem>
                    <SelectItem value="variable">Variable Rate</SelectItem>
                    <SelectItem value="split">Split Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formState.interestRatePreference === "fixed" || formState.interestRatePreference === "split" ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-blue-500 mr-2" />
                      <Label htmlFor="fixedRateTerm" className="font-medium text-gray-700">
                        Fixed Rate Term
                      </Label>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formState.fixedRateTerm} {formState.fixedRateTerm === 1 ? "year" : "years"}
                    </span>
                  </div>
                  <Slider
                    id="fixedRateTerm"
                    min={1}
                    max={5}
                    step={1}
                    value={[formState.fixedRateTerm]}
                    onValueChange={handleSliderChange("fixedRateTerm")}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1 year</span>
                    <span>2 years</span>
                    <span>3 years</span>
                    <span>4 years</span>
                    <span>5 years</span>
                  </div>
                </motion.div>
              ) : null}
            </div>
          </motion.div>
        </CardContent>
      </Card>

      <motion.div
        className="bg-green-50 p-4 rounded-lg border border-green-100"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              <span className="font-medium">Tip:</span> A shorter loan term means higher monthly payments but less
              interest paid over the life of the loan.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
