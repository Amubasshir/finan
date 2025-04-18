"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, ChevronRight } from "lucide-react"
import { useLoanInfo } from "../LoanInfoContext"
import confetti from "canvas-confetti"

export default function Review() {
  const router = useRouter()
  const { formData } = useLoanInfo()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    setIsSubmitting(true)

    // Simulate submission delay
    setTimeout(() => {
      // Trigger confetti effect on successful submission
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })

      setTimeout(() => {
        router.push("/pre-approval-confirmation")
      }, 2000)
    }, 1500)
  }

  // Format currency values
  const formatCurrency = (value: string | number) => {
    if (!value) return "N/A"
    const numValue = typeof value === "string" ? Number.parseFloat(value) : value
    return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(numValue)
  }

  // Helper function to format section data for display
  const formatSectionData = (section: any) => {
    if (!section) return []

    return Object.entries(section).map(([key, value]) => {
      // Format the key for display
      const formattedKey = key.replace(/([A-Z])/g, " $1").trim()

      // Format the value based on its type
      let formattedValue = value
      if (typeof value === "boolean") {
        formattedValue = value ? "Yes" : "No"
      } else if (typeof value === "number" || (typeof value === "string" && !isNaN(Number(value)))) {
        if (
          key.toLowerCase().includes("amount") ||
          key.toLowerCase().includes("value") ||
          key.toLowerCase().includes("income") ||
          key.toLowerCase().includes("payment") ||
          key.toLowerCase().includes("mortgage") ||
          key.toLowerCase().includes("balance") ||
          key.toLowerCase().includes("savings")
        ) {
          formattedValue = formatCurrency(value)
        }
      }

      return {
        key: formattedKey,
        value: formattedValue,
      }
    })
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-green-50 p-4 rounded-lg border border-green-100 mb-6"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-green-800">Almost there!</h3>
            <p className="text-sm text-green-700 mt-1">
              Please review your information carefully before submission. You're just one step away from seeing your
              personalized loan options.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-700 flex items-center">
                <span className="text-xl mr-2">👤</span> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <dl className="space-y-2">
                {formatSectionData(formData)
                  .slice(0, 6)
                  .map((item, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2">
                      <dt className="text-sm font-medium text-gray-500">{item.key}</dt>
                      <dd className="text-sm text-gray-900">{item.value?.toString() || "N/A"}</dd>
                    </div>
                  ))}
              </dl>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-700 flex items-center">
                <span className="text-xl mr-2">💼</span> Employment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <dl className="space-y-2">
                {formatSectionData(formData.employment).map((item, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <dt className="text-sm font-medium text-gray-500">{item.key}</dt>
                    <dd className="text-sm text-gray-900">{item.value?.toString() || "N/A"}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-700 flex items-center">
                <span className="text-xl mr-2">💰</span> Financial Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <dl className="space-y-2">
                {formatSectionData(formData.financial).map((item, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <dt className="text-sm font-medium text-gray-500">{item.key}</dt>
                    <dd className="text-sm text-gray-900">{item.value?.toString() || "N/A"}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-700 flex items-center">
                <span className="text-xl mr-2">🏠</span> Property Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <dl className="space-y-2">
                {formatSectionData(formData.property).map((item, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <dt className="text-sm font-medium text-gray-500">{item.key}</dt>
                    <dd className="text-sm text-gray-900">{item.value?.toString() || "N/A"}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-700 flex items-center">
                <span className="text-xl mr-2">📝</span> Loan Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <dl className="space-y-2">
                {formatSectionData(formData.loanRequirements).map((item, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <dt className="text-sm font-medium text-gray-500">{item.key}</dt>
                    <dd className="text-sm text-gray-900">{item.value?.toString() || "N/A"}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-700 flex items-center">
                <span className="text-xl mr-2">✨</span> Additional Features
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <dl className="space-y-2">
                {formatSectionData(formData.additionalFeatures).map((item, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <dt className="text-sm font-medium text-gray-500">{item.key}</dt>
                    <dd className="text-sm text-gray-900">{item.value?.toString() || "N/A"}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mt-6"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <span className="font-medium">Important:</span> By submitting this form, you agree to our{" "}
              <a href="#" className="underline font-medium">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline font-medium">
                Privacy Policy
              </a>
              . Your information will be used to provide you with personalized loan options.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-center mt-8">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          size="lg"
          className="px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center">
              Submit and Check Pre-Approval Status
              <ChevronRight className="ml-2 h-5 w-5" />
            </span>
          )}
        </Button>
      </div>
    </motion.div>
  )
}
