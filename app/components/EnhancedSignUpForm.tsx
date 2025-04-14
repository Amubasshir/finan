"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ArrowRight, ArrowLeft, CheckCircle, Home, Briefcase, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

// Helper function to trigger confetti
const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  })
}

export default function EnhancedSignUpForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  const [formComplete, setFormComplete] = useState(false)

  const [formData, setFormData] = useState({
    // Personal details
    fullName: "",
    phone: "",

    // Financial situation
    employmentStatus: "",
    annualIncome: 80000,

    // Property details
    propertyValue: 500000,
    currentLoanBalance: 400000,

    // Loan preferences
    loanPurpose: "",
    desiredFeatures: {
      offsetAccount: false,
      redrawFacility: false,
      fixedRate: false,
      variableRate: false,
      fixedRate: false,
      variableRate: false,
    },
  })

  // Update progress based on current step
  useEffect(() => {
    const totalSteps = steps.length
    setProgress(((currentStep + 1) / totalSteps) * 100)
  }, [currentStep])

  // Handle form completion
  useEffect(() => {
    if (formComplete) {
      triggerConfetti()
      const timer = setTimeout(() => {
        router.push("/pre-approval-confirmation")
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [formComplete, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSliderChange = (name: string) => (value: number[]) => {
    setFormData((prev) => ({ ...prev, [name]: value[0] }))
  }

  const handleCheckboxChange = (name: string) => (checked: boolean) => {
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: checked,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: checked }))
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo(0, 0)
    } else {
      setFormComplete(true)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo(0, 0)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Personal details
        return formData.fullName.trim() !== "" && formData.phone.trim() !== ""
      case 1: // Financial situation
        return formData.employmentStatus !== ""
      case 2: // Property details
        return true // Sliders have default values
      case 3: // Loan preferences
        return formData.loanPurpose !== ""
      default:
        return true
    }
  }

  const steps = [
    {
      title: "Tell us about yourself",
      icon: <CheckCircle className="h-8 w-8 text-blue-500" />,
      description: "Let's get to know you better so we can personalize your experience.",
      content: (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
          <motion.div variants={item} className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
              placeholder="John Smith"
              required
            />
          </motion.div>

          <motion.div variants={item} className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
              placeholder="0400 123 456"
              required
            />
          </motion.div>
        </motion.div>
      ),
    },
    {
      title: "Your financial situation",
      icon: <DollarSign className="h-8 w-8 text-blue-500" />,
      description: "This helps us find the right loan options for your circumstances.",
      content: (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={item} className="space-y-2">
            <Label htmlFor="employmentStatus">What's your employment status?</Label>
            <Select onValueChange={handleSelectChange("employmentStatus")} value={formData.employmentStatus}>
              <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Select your employment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fullTime">Full-Time</SelectItem>
                <SelectItem value="partTime">Part-Time</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="selfEmployed">Self-Employed</SelectItem>
                <SelectItem value="contractor">Contractor</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div variants={item} className="space-y-4">
            <Label htmlFor="annualIncome">What's your annual income before tax?</Label>
            <div className="space-y-2">
              <Slider
                id="annualIncome"
                min={30000}
                max={500000}
                step={5000}
                value={[formData.annualIncome]}
                onValueChange={handleSliderChange("annualIncome")}
                className="py-4"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">$30,000</span>
                <span className="text-lg font-bold text-blue-600">${formData.annualIncome.toLocaleString()}</span>
                <span className="text-sm text-gray-500">$500,000+</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ),
    },
    {
      title: "Your property details",
      icon: <Home className="h-8 w-8 text-blue-500" />,
      description: "Tell us about your property so we can find the best refinancing options.",
      content: (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={item} className="space-y-4">
            <Label htmlFor="propertyValue">What's the estimated value of your property?</Label>
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
          </motion.div>

          <motion.div variants={item} className="space-y-4">
            <Label htmlFor="currentLoanBalance">What's your current loan balance?</Label>
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

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-bold">Loan-to-Value Ratio (LVR): </span>
                {Math.round((formData.currentLoanBalance / formData.propertyValue) * 100)}%
              </p>
            </div>
          </motion.div>
        </motion.div>
      ),
    },
    {
      title: "Your loan preferences",
      icon: <Briefcase className="h-8 w-8 text-blue-500" />,
      description: "Let's understand what you're looking for in your new home loan.",
      content: (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={item} className="space-y-2">
            <Label htmlFor="loanPurpose">What's your main reason for refinancing?</Label>
            <Select onValueChange={handleSelectChange("loanPurpose")} value={formData.loanPurpose}>
              <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Select your main reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lowerRate">Get a lower interest rate</SelectItem>
                <SelectItem value="lowerRepayments">Reduce my repayments</SelectItem>
                <SelectItem value="accessEquity">Access equity in my home</SelectItem>
                <SelectItem value="consolidateDebt">Consolidate other debts</SelectItem>
                <SelectItem value="betterFeatures">Get better loan features</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div variants={item} className="space-y-4">
            <Label>Which features are important to you?</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="offsetAccount"
                  checked={formData.desiredFeatures.offsetAccount}
                  onCheckedChange={handleCheckboxChange("desiredFeatures.offsetAccount")}
                />
                <div>
                  <Label htmlFor="offsetAccount" className="font-medium cursor-pointer">
                    Offset Account
                  </Label>
                  <p className="text-sm text-gray-500">Reduce interest by linking your savings</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="redrawFacility"
                  checked={formData.desiredFeatures.redrawFacility}
                  onCheckedChange={handleCheckboxChange("desiredFeatures.redrawFacility")}
                />
                <div>
                  <Label htmlFor="redrawFacility" className="font-medium cursor-pointer">
                    Redraw Facility
                  </Label>
                  <p className="text-sm text-gray-500">Access extra repayments when needed</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="fixedRate"
                  checked={formData.desiredFeatures.fixedRate}
                  onCheckedChange={handleCheckboxChange("desiredFeatures.fixedRate")}
                />
                <div>
                  <Label htmlFor="fixedRate" className="font-medium cursor-pointer">
                    Fixed Interest Rate
                  </Label>
                  <p className="text-sm text-gray-500">Lock in your rate for certainty</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="variableRate"
                  checked={formData.desiredFeatures.variableRate}
                  onCheckedChange={handleCheckboxChange("desiredFeatures.variableRate")}
                />
                <div>
                  <Label htmlFor="variableRate" className="font-medium cursor-pointer">
                    Variable Interest Rate
                  </Label>
                  <p className="text-sm text-gray-500">Flexibility and potential for lower rates</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ),
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <AnimatePresence mode="wait">
        {formComplete ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-10"
          >
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4">You're all set!</h2>
            <p className="text-lg text-gray-600 mb-8">We're preparing your personalized loan options...</p>
            <div className="w-full max-w-md mx-auto">
              <Progress value={100} className="h-2 mb-2" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-3xl font-bold">Complete Your Profile</h1>
              <span className="text-sm font-medium text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>

            <Progress value={progress} className="h-2 mb-2" />

            <Card className="border-none shadow-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  {steps[currentStep].icon}
                  <div>
                    <h2 className="text-xl font-bold">{steps[currentStep].title}</h2>
                    <p className="text-gray-500">{steps[currentStep].description}</p>
                  </div>
                </div>

                {steps[currentStep].content}

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
                    {currentStep === steps.length - 1 ? "Complete" : "Continue"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
