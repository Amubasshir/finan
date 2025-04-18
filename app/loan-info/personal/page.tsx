"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLoanInfo } from "../LoanInfoContext"
import { useToast } from "@/components/ui/use-toast"
import { HelpCircle, User, Mail, Phone, Calendar, Users, Save, ArrowLeft, Loader2 } from "lucide-react"
import moment from "moment"
export default function PersonalInformation() {
  const router = useRouter()
  const { toast } = useToast()
  const { formData, updateMultipleFields, saveToServer, isLoading } = useLoanInfo()

  // Initialize state with data from context or localStorage
  const [personalData, setPersonalData] = useState(() => ({
    fullName: formData?.personal?.fullName || "",
    email: formData?.personal?.email || "",
    phone: formData?.personal?.phone || "",
    dateOfBirth: formData?.personal?.dateOfBirth || "",
    maritalStatus: formData?.personal?.maritalStatus || "",
    dependents: formData?.personal?.dependents || 0,
  }))

  // Update form state when context data changes
  useEffect(() => {
    if (formData?.personal) {
      setPersonalData({
        fullName: formData.personal.fullName || "",
        email: formData.personal.email || "",
        phone: formData.personal.phone || "",
        dateOfBirth: formData.personal.dateOfBirth || "",
        maritalStatus: formData.personal.maritalStatus || "",
        dependents: formData.personal.dependents || 0,
      })
    }
  }, [formData])

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Try to load user data from signup/login if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("userData")
      if (userData) {
        try {
          const parsedData = JSON.parse(userData)
          setPersonalData((prev) => ({
            ...prev,
            fullName: parsedData.fullName || prev.fullName,
            email: parsedData.email || prev.email,
            phone: parsedData.phone || prev.phone,
          }))
        } catch (error) {
          console.error("Failed to parse user data:", error)
        }
      }
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let parsedValue: string | number = value

    // Convert numeric inputs to numbers
    if (name === "dependents" && value !== "") {
      parsedValue = Number.parseInt(value, 10)
    }

    setPersonalData((prev) => ({ ...prev, [name]: parsedValue }))

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
    setPersonalData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is filled
    if (errors[name] && value) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const isFormValid = Boolean(
    personalData.fullName.trim() &&
    personalData.email.trim() &&
    /\S+@\S+\.\S+/.test(personalData.email) &&
    personalData.phone.trim()
  )

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {}

    if (!personalData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!personalData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(personalData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!personalData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)

      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      })

      return
    }

    try {
      // Save to server before navigating
      const result:any = await saveToServer({personal:personalData})

      if (result.success) {
        toast({
          title: "Success",
          description: "Personal information saved successfully.",
          variant: "default",
        })
        router.push(`/loan-info/employment`)
      }else{
        toast({
          title: "Error",
          description: result.errorMessage || "Failed to save personal information. Please try again.",
          variant: "destructive",
        })
      }
      // Navigate to next step

    } catch (err) {
      console.error("Failed to save personal information:", err)
      toast({
        title: "Error",
        description: "Failed to save personal information. Please try again.",
        variant: "destructive",
      })
    }
  }

  console.log("personalData", personalData)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={personalData.fullName}
                onChange={handleInputChange}
                className={`border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${errors.fullName ? "border-red-500" : ""}`}
                placeholder="John Smith"
              />
              {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={personalData.email}
                  onChange={handleInputChange}
                  className={`border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? "border-red-500" : ""}`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={personalData.phone}
                  onChange={handleInputChange}
                  className={`border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${errors.phone ? "border-red-500" : ""}`}
                  placeholder="0400 123 456"
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={moment(personalData.dateOfBirth).format("YYYY-MM-DD")}
                onChange={handleInputChange}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maritalStatus">Marital Status</Label>
                <Select value={personalData.maritalStatus} onValueChange={handleSelectChange("maritalStatus")}>
                  <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                    <SelectValue placeholder="Select marital status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="defacto">De Facto</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dependents">Number of Dependents</Label>
                <Input
                  id="dependents"
                  name="dependents"
                  type="number"
                  min="0"
                  value={personalData.dependents}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => router.push(`/loan-info/property`)}
          disabled={isLoading}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center"
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save and Continue
            </>
          )}
        </Button>
      </div>

      <div className="text-sm text-gray-500 italic">
        <span className="text-red-500">*</span> Required fields must be completed before proceeding to the next step.
      </div>
    </motion.div>
  )
}
