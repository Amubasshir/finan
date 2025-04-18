"use client"

import { useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, ChevronRight, HelpCircle, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoanInfoProvider } from "./LoanInfoContext"

// Define all steps in the loan application process with exact paths
const steps = [
  {
    id: 0,
    name: "Property",
    path: "/loan-info/property",
    icon: "🏠",
    requiredFields: ["propertyType", "propertyValue"],
  },
  { id: 1, name: "Personal", path: "/loan-info/personal", icon: "👤", requiredFields: ["fullName", "email", "phone"] },
  {
    id: 2,
    name: "Employment",
    path: "/loan-info/employment",
    icon: "💼",
    requiredFields: ["employmentStatus", "annualIncome"],
  },
  { id: 3, name: "Financial", path: "/loan-info/financial", icon: "💰", requiredFields: ["creditScore"] },
  {
    id: 4,
    name: "Loan Requirements",
    path: "/loan-info/loan-requirements",
    icon: "📝",
    requiredFields: ["loanAmount", "loanTerm"],
  },
  { id: 5, name: "Additional Features", path: "/loan-info/additional-features", icon: "✨", requiredFields: [] },
  { id: 6, name: "Review", path: "/loan-info/review", icon: "✅", requiredFields: [] },
]

export default function LoanInfoLayout({ children }: { children: ReactNode }) {
  return (
    <LoanInfoProvider>
      <LoanInfoLayoutContent>{children}</LoanInfoLayoutContent>
    </LoanInfoProvider>
  )
}

function LoanInfoLayoutContent({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  // State for tracking current step and completed steps
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isNavigating, setIsNavigating] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  // Determine the current step based on the URL path
  useEffect(() => {
    const index = steps.findIndex((step) => step.path === pathname)

    if (index !== -1) {
      setCurrentStepIndex(index)
    } else if (pathname === "/loan-info") {
      // If on the base path, redirect to the first step
      router.push(steps[0].path)
    }
  }, [pathname, router])

  // Function to navigate to the next step
  const goToNextStep = () => {
    if (isNavigating || currentStepIndex >= steps.length - 1) return

    setValidationError(null)
    setIsNavigating(true)

    // Mark current step as completed
    if (!completedSteps.includes(currentStepIndex)) {
      setCompletedSteps((prev) => [...prev, currentStepIndex])
    }

    // Calculate next step index
    const nextIndex = currentStepIndex + 1

    // Navigate to next step
    router.push(steps[nextIndex].path)

    // Reset navigation lock after animation completes
    setTimeout(() => {
      setIsNavigating(false)
    }, 600)
  }

  // Function to navigate to the previous step
  const goToPreviousStep = () => {
    if (isNavigating || currentStepIndex <= 0) return

    setValidationError(null)
    setIsNavigating(true)

    // Calculate previous step index
    const prevIndex = currentStepIndex - 1

    // Navigate to previous step
    router.push(steps[prevIndex].path)

    // Reset navigation lock after animation completes
    setTimeout(() => {
      setIsNavigating(false)
    }, 600)
  }

  // Function to directly navigate to a specific step
  const goToStep = (index: number) => {
    // Only allow navigation to completed steps or the current step
    if (isNavigating || (index > currentStepIndex && !completedSteps.includes(index))) {
      return
    }

    setValidationError(null)
    setIsNavigating(true)
    router.push(steps[index].path)

    setTimeout(() => {
      setIsNavigating(false)
    }, 600)
  }

  // Get the current step data
  const currentStep = steps[currentStepIndex] || steps[0]

  // Helper function to get tooltip content based on current step
  const getTooltipContent = () => {
    switch (currentStepIndex) {
      case 0:
        return "Property details help us determine the loan-to-value ratio and available options."
      case 1:
        return "Tell us about yourself so we can personalize your experience."
      case 2:
        return "Your employment details help us determine your borrowing capacity."
      case 3:
        return "Financial information helps us assess your eligibility for different loan options."
      case 4:
        return "Tell us what you're looking for in your ideal home loan."
      case 5:
        return "Select additional features that matter to you for your home loan."
      case 6:
        return "Review all your information before submission."
      default:
        return "Complete all steps to find your perfect loan."
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Your Home Refinance Information
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Help us understand your needs to find the perfect refinance option for you
          </p>

          {/* Progress bar */}
          <div className="mb-8">
            <Progress value={((currentStepIndex + 1) / steps.length) * 100} className="h-2 bg-gray-100" />
            <div className="text-right text-sm text-gray-500 mt-1">
              Step {currentStepIndex + 1} of {steps.length}
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex justify-between mb-10 overflow-x-auto pb-2 hide-scrollbar">
            {steps.map((step, index) => {
              // Determine if this step is accessible
              const isCompleted = completedSteps.includes(index)
              const isAccessible = index <= currentStepIndex || isCompleted

              return (
                <div
                  key={step.name}
                  onClick={() => (isAccessible ? goToStep(index) : null)}
                  className={`flex flex-col items-center mx-1 ${
                    isAccessible ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                  }`}
                  style={{ minWidth: "80px" }}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 text-xl transition-all duration-300 ${
                      index === currentStepIndex
                        ? "bg-blue-600 text-white ring-4 ring-blue-100"
                        : isCompleted
                          ? "bg-green-100 text-green-600 border border-green-200"
                          : "bg-gray-100 text-gray-400 border border-gray-200"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="h-6 w-6" /> : step.icon}
                  </div>
                  <span
                    className={`text-xs font-medium text-center ${
                      index === currentStepIndex ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Validation error message */}
          {validationError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          {/* Form content with animation */}
          <motion.div
            key={pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-6 mb-6"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-xl">
                {currentStep.icon}
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {currentStep.name} Information
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{getTooltipContent()}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h2>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">{children}</div>
          </motion.div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            <Button
              onClick={goToPreviousStep}
              disabled={currentStepIndex === 0 || isNavigating}
              variant="outline"
              className="px-6"
            >
              Previous
            </Button>

            <Button
              onClick={goToNextStep}
              disabled={currentStepIndex === steps.length - 1 || isNavigating}
              className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {currentStepIndex === steps.length - 1 ? (
                "Submit"
              ) : (
                <span className="flex items-center">
                  Continue <ChevronRight className="ml-1 h-4 w-4" />
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Help section */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 flex items-start">
          <div className="bg-blue-100 rounded-full p-2 mr-3">
            <HelpCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-blue-800 mb-1">Need help with your refinance?</h3>
            <p className="text-sm text-blue-700">
              If you have any questions about refinancing your home loan, our support team is available 24/7.
              <a href="#" className="underline ml-1 font-medium">
                Contact us
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
