"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle, Wallet, Repeat, Clock, Percent, CreditCard, Home } from "lucide-react"
import { useLoanInfo } from "../LoanInfoContext"

export default function AdditionalFeatures() {
  const { formData, updateFormData } = useLoanInfo()
  const [formState, setFormState] = useState({
    offsetAccount: formData.offsetAccount || false,
    redrawFacility: formData.redrawFacility || false,
    extraRepayments: formData.extraRepayments || false,
    interestOnly: formData.interestOnly || false,
    fixedRate: formData.fixedRate || false,
    splitLoan: formData.splitLoan || false,
    packageDiscount: formData.packageDiscount || false,
    noFees: formData.noFees || false,
    portability: formData.portability || false,
    parentGuarantee: formData.parentGuarantee || false,
  })

  const handleCheckboxChange = (name: string) => (checked: boolean) => {
    setFormState((prev) => ({ ...prev, [name]: checked }))
    updateFormData(name, checked)
  }

  const features = [
    {
      id: "offsetAccount",
      name: "Offset Account",
      description: "Reduce interest by offsetting your savings against your loan balance",
      icon: <Wallet className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "redrawFacility",
      name: "Redraw Facility",
      description: "Access extra repayments you've made when needed",
      icon: <CreditCard className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "extraRepayments",
      name: "Extra Repayments",
      description: "Make additional payments to pay off your loan faster",
      icon: <Repeat className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "interestOnly",
      name: "Interest Only Period",
      description: "Pay only the interest for a set period, reducing initial repayments",
      icon: <Clock className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "fixedRate",
      name: "Fixed Rate Option",
      description: "Lock in your interest rate for a set period",
      icon: <Percent className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "splitLoan",
      name: "Split Loan",
      description: "Split your loan between fixed and variable rates",
      icon: <Repeat className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "packageDiscount",
      name: "Package Discount",
      description: "Get discounts on interest rates and fees with a package deal",
      icon: <Percent className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "noFees",
      name: "No Ongoing Fees",
      description: "Avoid monthly or annual account keeping fees",
      icon: <Wallet className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "portability",
      name: "Loan Portability",
      description: "Take your loan with you when you move to a new property",
      icon: <Home className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "parentGuarantee",
      name: "Parent Guarantee Option",
      description: "Allow parents to guarantee part of your loan to reduce deposit requirements",
      icon: <Home className="h-5 w-5 text-blue-500" />,
    },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-sm">
        <CardContent className="p-6">
          <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Desired Loan Features</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center text-sm text-blue-600">
                        <HelpCircle className="h-4 w-4 mr-1" />
                        <span>What are these?</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Select the features that are important to you. These will help us find the most suitable loan
                        options.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    initial={{ x: index % 2 === 0 ? -20 : 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                      formState[feature.id as keyof typeof formState]
                        ? "bg-blue-50 border border-blue-100"
                        : "bg-gray-50 border border-gray-100 hover:bg-gray-100"
                    }`}
                  >
                    <Checkbox
                      id={feature.id}
                      checked={formState[feature.id as keyof typeof formState]}
                      onCheckedChange={handleCheckboxChange(feature.id)}
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center">
                        {feature.icon}
                        <Label
                          htmlFor={feature.id}
                          className={`ml-2 font-medium ${
                            formState[feature.id as keyof typeof formState] ? "text-blue-700" : "text-gray-700"
                          }`}
                        >
                          {feature.name}
                        </Label>
                      </div>
                      <p className="text-xs text-gray-500">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>

      <motion.div
        className="bg-blue-50 p-4 rounded-lg border border-blue-100"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <span className="font-medium">Note:</span> Some features may affect your interest rate or require
              additional fees. We'll show you the best options based on your preferences.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
