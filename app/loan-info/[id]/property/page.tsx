"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle, Home, MapPin, DollarSign, Building, AlertCircle, Percent } from "lucide-react"
import { useLoanInfo } from "../../LoanInfoContext"
export default function PropertyInfo() {
  const router = useRouter()
  const { formData, updateMultipleFields } = useLoanInfo()

  const [formState, setFormState] = useState({
    propertyType: formData.propertyType || "",
    propertyValue: formData.propertyValue || 500000,
    propertyAddress: formData.propertyAddress || "",
    propertyUsage: formData.propertyUsage || "",
    propertyAge: formData.propertyAge || 0,
    bedrooms: formData.bedrooms || 3,
    bathrooms: formData.bathrooms || 2,
    currentMortgage: formData.currentMortgage || 400000,
    currentLender: formData.currentLender || "",
    currentInterestRate: formData.currentInterestRate || 0,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Update form state when context data changes
  useEffect(() => {
    setFormState({
      propertyType: formData.propertyType || "",
      propertyValue: formData.propertyValue || 500000,
      propertyAddress: formData.propertyAddress || "",
      propertyUsage: formData.propertyUsage || "",
      propertyAge: formData.propertyAge || 0,
      bedrooms: formData.bedrooms || 3,
      bathrooms: formData.bathrooms || 2,
      currentMortgage: formData.currentMortgage || 400000,
      currentLender: formData.currentLender || "",
      currentInterestRate: formData.currentInterestRate || 0,
    })
  }, [formData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let parsedValue: string | number = value

    // Convert numeric inputs to numbers
    if (e.target.type === "number") {
      parsedValue = value === "" ? 0 : Number(value)
    }

    setFormState((prev) => ({ ...prev, [name]: parsedValue }))

    // Clear error when field is filled
    if (errors[name] && value) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is filled
    if (errors[name] && value) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSliderChange = (name: string) => (value: number[]) => {
    setFormState((prev) => ({ ...prev, [name]: value[0] }))

    // Clear error when field is filled
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(value)
  }

  // Calculate LVR (Loan to Value Ratio)
  const calculateLVR = () => {
    if (formState.propertyValue === 0) return 0
    return (formState.currentMortgage / formState.propertyValue) * 100
  }

  const lvr = calculateLVR()
  const lvrColor = lvr > 80 ? "text-red-600" : lvr > 70 ? "text-yellow-600" : "text-green-600"

  // Validate form and save data
  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}

    // Validate required fields
    if (!formState.propertyType) {
      newErrors.propertyType = "Property type is required"
    }

    if (formState.propertyValue <= 0) {
      newErrors.propertyValue = "Property value must be greater than 0"
    }

    // Set errors or proceed
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Save all form data to context
    updateMultipleFields(formState)

    // Navigate to next step
    router.push("/loan-info/personal")
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="p-6 space-y-6">
            <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Current Property Details</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Home className="h-4 w-4 text-blue-500 mr-2" />
                      <Label htmlFor="propertyType" className="font-medium text-gray-700">
                        Property Type <span className="text-red-500">*</span>
                      </Label>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Different property types may have different refinancing options.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select onValueChange={handleSelectChange("propertyType")} value={formState.propertyType}>
                    <SelectTrigger
                      className={`border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${errors.propertyType ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="duplex">Duplex</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.propertyType && (
                    <p className="text-sm text-red-500 flex items-center mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.propertyType}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-blue-500 mr-2" />
                    <Label htmlFor="propertyAddress" className="font-medium text-gray-700">
                      Property Address
                    </Label>
                  </div>
                  <Input
                    id="propertyAddress"
                    name="propertyAddress"
                    value={formState.propertyAddress}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter full property address"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 text-blue-500 mr-2" />
                      <Label htmlFor="propertyUsage" className="font-medium text-gray-700">
                        Property Usage
                      </Label>
                    </div>
                  </div>
                  <Select onValueChange={handleSelectChange("propertyUsage")} value={formState.propertyUsage}>
                    <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue placeholder="Select property usage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primaryResidence">Primary Residence</SelectItem>
                      <SelectItem value="investmentProperty">Investment Property</SelectItem>
                      <SelectItem value="vacationHome">Vacation Home</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 text-blue-500 mr-2" />
                      <Label htmlFor="propertyAge" className="font-medium text-gray-700">
                        Property Age (years)
                      </Label>
                    </div>
                    <Input
                      id="propertyAge"
                      name="propertyAge"
                      type="number"
                      value={formState.propertyAge}
                      onChange={handleInputChange}
                      min={0}
                      className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Home className="h-4 w-4 text-blue-500 mr-2" />
                      <Label htmlFor="bedrooms" className="font-medium text-gray-700">
                        Bedrooms
                      </Label>
                    </div>
                    <Select onValueChange={handleSelectChange("bedrooms")} value={formState.bedrooms.toString()}>
                      <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                        <SelectValue placeholder="Select number of bedrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="6">6+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Home className="h-4 w-4 text-blue-500 mr-2" />
                      <Label htmlFor="bathrooms" className="font-medium text-gray-700">
                        Bathrooms
                      </Label>
                    </div>
                    <Select onValueChange={handleSelectChange("bathrooms")} value={formState.bathrooms.toString()}>
                      <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                        <SelectValue placeholder="Select number of bathrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="1.5">1.5</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="2.5">2.5</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="3.5">3.5</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                      </SelectContent>
                    </Select>
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">Property Value & Current Mortgage</h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-blue-500 mr-2" />
                      <Label htmlFor="propertyValue" className="font-medium text-gray-700">
                        Estimated Property Value <span className="text-red-500">*</span>
                      </Label>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(formState.propertyValue)}</span>
                  </div>
                  <Slider
                    id="propertyValue"
                    min={100000}
                    max={2000000}
                    step={10000}
                    value={[formState.propertyValue]}
                    onValueChange={handleSliderChange("propertyValue")}
                    className={`py-4 ${errors.propertyValue ? "border-red-500" : ""}`}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>$100k</span>
                    <span>$500k</span>
                    <span>$1M</span>
                    <span>$1.5M</span>
                    <span>$2M+</span>
                  </div>
                  {errors.propertyValue && (
                    <p className="text-sm text-red-500 flex items-center mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.propertyValue}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-blue-500 mr-2" />
                      <Label htmlFor="currentMortgage" className="font-medium text-gray-700">
                        Current Mortgage Balance
                      </Label>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(formState.currentMortgage)}
                    </span>
                  </div>
                  <Slider
                    id="currentMortgage"
                    min={0}
                    max={formState.propertyValue}
                    step={10000}
                    value={[formState.currentMortgage]}
                    onValueChange={handleSliderChange("currentMortgage")}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>$0</span>
                    <span>{formatCurrency(formState.propertyValue * 0.25)}</span>
                    <span>{formatCurrency(formState.propertyValue * 0.5)}</span>
                    <span>{formatCurrency(formState.propertyValue * 0.75)}</span>
                    <span>{formatCurrency(formState.propertyValue)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 text-blue-500 mr-2" />
                      <Label htmlFor="currentLender" className="font-medium text-gray-700">
                        Current Lender
                      </Label>
                    </div>
                    <Input
                      id="currentLender"
                      name="currentLender"
                      value={formState.currentLender}
                      onChange={handleInputChange}
                      placeholder="e.g., Commonwealth Bank"
                      className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Percent className="h-4 w-4 text-blue-500 mr-2" />
                      <Label htmlFor="currentInterestRate" className="font-medium text-gray-700">
                        Current Interest Rate (%)
                      </Label>
                    </div>
                    <Input
                      id="currentInterestRate"
                      name="currentInterestRate"
                      type="number"
                      step="0.01"
                      min="0"
                      max="20"
                      value={formState.currentInterestRate}
                      onChange={handleInputChange}
                      placeholder="e.g., 4.99"
                      className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-700">Loan to Value Ratio (LVR)</h4>
                      <p className="text-sm text-gray-500">Lower LVR may qualify for better refinance rates</p>
                    </div>
                    <div className={`text-xl font-bold ${lvrColor}`}>{lvr.toFixed(1)}%</div>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${lvr > 80 ? "bg-red-500" : lvr > 70 ? "bg-yellow-500" : "bg-green-500"}`}
                      style={{ width: `${Math.min(lvr, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-green-600">Excellent (&lt;70%)</span>
                    <span className="text-yellow-600">Good (70-80%)</span>
                    <span className="text-red-600">High (&gt;80%)</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
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
              <span className="font-medium">Refinancing Tip:</span> A lower LVR (below 80%) can help you avoid Lenders
              Mortgage Insurance and qualify for better interest rates when refinancing your home loan.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-end mt-6">
        <Button
          onClick={handleSubmit}
          className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          Save and Continue
        </Button>
      </div>

      <div className="text-sm text-gray-500 italic">
        <span className="text-red-500">*</span> Required fields must be completed before proceeding to the next step.
      </div>
    </motion.div>
  )
}
