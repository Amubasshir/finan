"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, ChevronRight, Loader2 } from "lucide-react"
import { useLoanInfo } from "../LoanInfoContext"
import confetti from "canvas-confetti"
import { useToast } from "@/hooks/use-toast"

export default function Review() {
  const { formData, saveToServer, isLoading } = useLoanInfo()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async () => {
    try {
      const result = await saveToServer(formData)
      if (result.success) {
        toast({
          title: "Success",
          description: "Application submitted!",
          variant: "default",
        })
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          })
          localStorage.removeItem("loanInfoFormData")
          router.push(`/pre-approval-confirmation/${formData?._id}`)
        }, 1500)
      } else {
        toast({
          title: "Error",
          description: result.errorMessage || "Failed to submit. Please try again.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Failed to save employment information:", err)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatCurrency = (value: string | number) => {
    if (!value) return "N/A"
    const numValue = typeof value === "string" ? Number.parseFloat(value) : value
    return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(numValue)
  }

  const formatSectionData = (section: any) => {
    if (!section) return []

    return Object.entries(section)
      .filter(([key]) => !key.startsWith('_') && key !== 'id')
      .map(([key, value]) => {
        const formattedKey = key
          .replace(/([A-Z])/g, ' $1')
          .trim()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')

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
      .filter(item => item.value !== "" && item.value !== null && item.value !== undefined)
  }

  const sections = [
    {
      title: "Personal Information",
      icon: "👤",
      data: formData.personal,
      color: "blue",
    },
    {
      title: "Employment Information",
      icon: "💼",
      data: formData.employment,
      color: "purple",
    },
    {
      title: "Financial Information",
      icon: "💰",
      data: formData.financial,
      color: "green",
    },
    {
      title: "Property Information",
      icon: "🏠",
      data: formData.property,
      color: "orange",
    },
    {
      title: "Loan Requirements",
      icon: "📝",
      data: formData.loanRequirements,
      color: "pink",
    },
    {
      title: "Additional Features",
      icon: "✨",
      data: formData.additionalFeatures,
      color: "teal",
    },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      {/* Success Banner */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-green-50 p-6 rounded-lg border border-green-100 mb-6"
      >
        <div className="flex items-start space-x-4">
          <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-semibold text-green-800">Almost there!</h3>
            <p className="text-base text-green-700 mt-2">
              Please review your information carefully before submission. You're just one step away from seeing your
              personalized loan options.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Card className="h-full">
              <CardHeader className={`bg-${section.color}-50`}>
                <CardTitle className={`text-${section.color}-700 flex items-center space-x-2`}>
                  <span className="text-2xl">{section.icon}</span>
                  <span>{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <dl className="space-y-3">
                  {formatSectionData(section.data).map((item) => (
                    <div key={item.key} className="grid grid-cols-3 gap-4">
                      <dt className="col-span-1 text-sm font-medium text-gray-500 truncate">{item.key}</dt>
                      <dd className="col-span-2 text-sm text-gray-900 font-medium break-words">
                        {item.value?.toString() || "N/A"}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Disclaimer */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-yellow-50 p-6 rounded-lg border border-yellow-100 mt-8"
      >
        <div className="flex items-start space-x-4">
          <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0" />
          <div>
            <p className="text-base text-yellow-700">
              <span className="font-semibold">Important:</span> By submitting this form, you agree to our{" "}
              <a href="#" className="underline font-medium hover:text-yellow-800">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline font-medium hover:text-yellow-800">
                Privacy Policy
              </a>
              . Your information will be used to provide you with personalized loan options.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Submit Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex justify-center mt-10"
      >
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          size="lg"
          className="px-12 py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {isLoading ? (
            <span className="flex items-center">
              <Loader2 className="animate-spin h-5 w-5 mr-3" />
              Processing...
            </span>
          ) : (
            <span className="flex items-center">
              Submit and Check Pre-Approval Status
              <ChevronRight className="ml-2 h-5 w-5" />
            </span>
          )}
        </Button>
      </motion.div>
    </motion.div>
  )
}
