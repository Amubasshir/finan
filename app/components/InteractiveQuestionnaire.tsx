"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ArrowRight, ArrowLeft, Home, DollarSign, Percent, Clock, ThumbsUp } from "lucide-react"
import { cn } from "@/lib/utils"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function InteractiveQuestionnaire() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const [formData, setFormData] = useState({
    propertyValue: 750000,
    currentLoanBalance: 500000,
    currentInterestRate: 5.5,
    loanTerm: 30,
    refinanceReason: "",
    postcode: "",
  })

  // Calculate potential savings
  const calculateSavings = () => {
    const currentMonthlyPayment = calculateMonthlyPayment(
      formData.currentLoanBalance,
      formData.currentInterestRate,
      formData.loanTerm,
    )

    // Assume we can offer 1% lower rate
    const newRate = Math.max(formData.currentInterestRate - 1, 2.5)
    const newMonthlyPayment = calculateMonthlyPayment(formData.currentLoanBalance, newRate, formData.loanTerm)

    const monthlySavings = currentMonthlyPayment - newMonthlyPayment
    const annualSavings = monthlySavings * 12

    return {
      monthly: monthlySavings,
      annual: annualSavings,
      newRate,
    }
  }

  const calculateMonthlyPayment = (principal: number, rate: number, years: number) => {
    const monthlyRate = rate / 100 / 12
    const numberOfPayments = years * 12
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSliderChange = (name: string) => (value: number[]) => {
    setFormData((prev) => ({ ...prev, [name]: value[0] }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1)
      setProgress(((currentStep + 2) / questions.length) * 100)
      window.scrollTo(0, 0)
    } else {
      router.push("/signup")
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
      setProgress((currentStep / questions.length) * 100)
      window.scrollTo(0, 0)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Property value
        return true // Slider has default value
      case 1: // Current loan balance
        return formData.currentLoanBalance <= formData.propertyValue
      case 2: // Current interest rate
        return true // Slider has default value
      case 3: // Loan term
        return true // Slider has default value
      case 4: // Refinance reason
        return formData.refinanceReason !== ""
      case 5: // Postcode
        return formData.postcode.length >= 4
      default:
        return true
    }
  }

  const questions = [
    {
      title: "What's the estimated value of your property?",
      icon: <Home className="h-8 w-8 text-blue-500" />,
      content: (
        <motion.div variants={fadeIn} initial="hidden" animate="visible" className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Slider
                id="propertyValue"
                min={100000}
                max={2000000}
                step={10000}
                value={[formData.propertyValue]}
                onValueChange={handleSliderChange("propertyValue")}
                className="py-4"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">$100,000</span>
                <span className="text-lg font-bold text-blue-600">${formData.propertyValue.toLocaleString()}</span>
                <span className="text-sm text-gray-500">$2M+</span>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                The value of your property helps us determine how much equity you have available.
              </p>
            </div>
          </div>
        </motion.div>
      ),
    },
    {
      title: "What's your current loan balance?",
      icon: <DollarSign className="h-8 w-8 text-blue-500" />,
      content: (
        <motion.div variants={fadeIn} initial="hidden" animate="visible" className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Slider
                id="currentLoanBalance"
                min={0}
                max={1500000}
                step={10000}
                value={[formData.currentLoanBalance]}
                onValueChange={handleSliderChange("currentLoanBalance")}
                className="py-4"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">$0</span>
                <span className="text-lg font-bold text-blue-600">${formData.currentLoanBalance.toLocaleString()}</span>
                <span className="text-sm text-gray-500">$1.5M+</span>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-bold">Loan-to-Value Ratio (LVR): </span>
                {Math.round((formData.currentLoanBalance / formData.propertyValue) * 100)}%
              </p>
              <p className="text-sm text-blue-800 mt-2">
                <span className="font-bold">Available Equity: </span>$
                {Math.max(0, formData.propertyValue - formData.currentLoanBalance).toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>
      ),
    },
    {
      title: "What's your current interest rate?",
      icon: <Percent className="h-8 w-8 text-blue-500" />,
      content: (
        <motion.div variants={fadeIn} initial="hidden" animate="visible" className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Slider
                id="currentInterestRate"
                min={2}
                max={8}
                step={0.05}
                value={[formData.currentInterestRate]}
                onValueChange={handleSliderChange("currentInterestRate")}
                className="py-4"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">2%</span>
                <span className="text-lg font-bold text-blue-600">{formData.currentInterestRate.toFixed(2)}%</span>
                <span className="text-sm text-gray-500">8%</span>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Your current interest rate helps us identify potential savings through refinancing.
              </p>
            </div>
          </div>
        </motion.div>
      ),
    },
    {
      title: "How many years are left on your loan?",
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      content: (
        <motion.div variants={fadeIn} initial="hidden" animate="visible" className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Slider
                id="loanTerm"
                min={1}
                max={30}
                step={1}
                value={[formData.loanTerm]}
                onValueChange={handleSliderChange("loanTerm")}
                className="py-4"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">1 year</span>
                <span className="text-lg font-bold text-blue-600">{formData.loanTerm} years</span>
                <span className="text-sm text-gray-500">30 years</span>
              </div>
            </div>
          </div>
        </motion.div>
      ),
    },
    {
      title: "What's your main reason for refinancing?",
      icon: <ThumbsUp className="h-8 w-8 text-blue-500" />,
      content: (
        <motion.div variants={fadeIn} initial="hidden" animate="visible" className="space-y-6">
          <RadioGroup
            value={formData.refinanceReason}
            onValueChange={(value) => handleRadioChange("refinanceReason", value)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
              <RadioGroupItem value="lowerRate" id="lowerRate" />
              <Label htmlFor="lowerRate" className="flex-1 cursor-pointer">
                Get a lower interest rate
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
              <RadioGroupItem value="lowerRepayments" id="lowerRepayments" />
              <Label htmlFor="lowerRepayments" className="flex-1 cursor-pointer">
                Reduce my monthly repayments
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
              <RadioGroupItem value="accessEquity" id="accessEquity" />
              <Label htmlFor="accessEquity" className="flex-1 cursor-pointer">
                Access equity in my home
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
              <RadioGroupItem value="consolidateDebt" id="consolidateDebt" />
              <Label htmlFor="consolidateDebt" className="flex-1 cursor-pointer">
                Consolidate other debts
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
              <RadioGroupItem value="betterFeatures" id="betterFeatures" />
              <Label htmlFor="betterFeatures" className="flex-1 cursor-pointer">
                Get better loan features
              </Label>
            </div>
          </RadioGroup>
        </motion.div>
      ),
    },
    {
      title: "What's your postcode?",
      icon: <Home className="h-8 w-8 text-blue-500" />,
      content: (
        <motion.div variants={fadeIn} initial="hidden" animate="visible" className="space-y-6">
          <div className="space-y-2">
            <Input
              type="text"
              id="postcode"
              name="postcode"
              value={formData.postcode}
              onChange={handleInputChange}
              className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 text-center text-xl py-6"
              placeholder="e.g. 2000"
              maxLength={4}
            />
            <p className="text-sm text-gray-500 text-center">
              We use your postcode to find lenders available in your area.
            </p>
          </div>

          {formData.postcode.length >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-green-50 rounded-lg border border-green-200"
            >
              <h3 className="text-lg font-bold text-green-800 mb-2">Great news!</h3>
              <p className="text-green-700 mb-4">Based on your information, we estimate you could save:</p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-700">Monthly savings:</span>
                <span className="text-xl font-bold text-green-800">
                  ${Math.round(calculateSavings().monthly).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-green-700">Annual savings:</span>
                <span className="text-xl font-bold text-green-800">
                  ${Math.round(calculateSavings().annual).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-green-700">
                By refinancing to an estimated rate of {calculateSavings().newRate.toFixed(2)}%
              </p>
            </motion.div>
          )}
        </motion.div>
      ),
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Your Perfect Home Loan</h1>
        <p className="text-gray-600">Answer a few quick questions to see how much you could save</p>
      </div>

      <Progress value={progress} className="h-2 mb-6" />

      <Card className="border-none shadow-lg overflow-hidden">
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-4 mb-6">
                {questions[currentStep].icon}
                <h2 className="text-xl font-bold">{questions[currentStep].title}</h2>
              </div>

              {questions[currentStep].content}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
              className={cn("transition-all duration-300", currentStep === 0 ? "opacity-0" : "opacity-100")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              type="button"
              onClick={nextStep}
              disabled={!isStepValid()}
              className={cn(
                "bg-blue-600 hover:bg-blue-700 transition-all duration-300",
                !isStepValid() && "opacity-50 cursor-not-allowed",
              )}
            >
              {currentStep === questions.length - 1 ? "See My Options" : "Continue"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
