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
import { Switch } from "@/components/ui/switch"
import { useLoanInfo } from "../LoanInfoContext"
import { Plus, X, Save } from "lucide-react"

export default function EmploymentInformation() {
  const router = useRouter()
  const { formData, updateMultipleFields, saveToServer, isLoading, error, loanId } = useLoanInfo()

  const [employmentData, setEmploymentData] = useState({
    employmentStatus: formData.employmentStatus || "",
    employerName: formData.employerName || "",
    jobTitle: formData.jobTitle || "",
    yearsInCurrentJob: formData.yearsInCurrentJob || 0,
    annualIncome: formData.annualIncome || 80000,
    additionalIncome: formData.additionalIncome || 0,
    isSelfEmployed: formData.isSelfEmployed || false,
    // Self-employed specific fields
    businessType: formData.businessType || "",
    abnAcn: formData.abnAcn || "",
    businessIndustry: formData.businessIndustry || "",
    annualBusinessRevenue: formData.annualBusinessRevenue || 0,
    // Partner details
    hasPartner: formData.hasPartner || false,
    partnerEmploymentStatus: formData.partnerEmploymentStatus || "",
    partnerEmployerName: formData.partnerEmployerName || "",
    partnerJobTitle: formData.partnerJobTitle || "",
    partnerYearsInCurrentJob: formData.partnerYearsInCurrentJob || 0,
    partnerAnnualIncome: formData.partnerAnnualIncome || 0,
    partnerIsSelfEmployed: formData.partnerIsSelfEmployed || false,
    partnerBusinessType: formData.partnerBusinessType || "",
    partnerAbnAcn: formData.partnerAbnAcn || "",
    partnerBusinessIndustry: formData.partnerBusinessIndustry || "",
    partnerAnnualBusinessRevenue: formData.partnerAnnualBusinessRevenue || 0,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSelfEmployedDetails, setShowSelfEmployedDetails] = useState(
    employmentData.isSelfEmployed || employmentData.employmentStatus === "selfEmployed",
  )
  const [showPartnerDetails, setShowPartnerDetails] = useState(employmentData.hasPartner)
  const [showPartnerSelfEmployedDetails, setShowPartnerSelfEmployedDetails] = useState(
    employmentData.partnerIsSelfEmployed || employmentData.partnerEmploymentStatus === "selfEmployed",
  )
  const [isSaving, setIsSaving] = useState(false)

  // Sync isSelfEmployed with employmentStatus
  useEffect(() => {
    if (employmentData.employmentStatus === "selfEmployed" && !employmentData.isSelfEmployed) {
      setEmploymentData((prev) => ({ ...prev, isSelfEmployed: true }))
      setShowSelfEmployedDetails(true)
    }
  }, [employmentData.employmentStatus, employmentData.isSelfEmployed])

  // Sync partnerIsSelfEmployed with partnerEmploymentStatus
  useEffect(() => {
    if (employmentData.partnerEmploymentStatus === "selfEmployed" && !employmentData.partnerIsSelfEmployed) {
      setEmploymentData((prev) => ({ ...prev, partnerIsSelfEmployed: true }))
      setShowPartnerSelfEmployedDetails(true)
    }
  }, [employmentData.partnerEmploymentStatus, employmentData.partnerIsSelfEmployed])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let parsedValue: string | number = value

    // Convert numeric inputs to numbers
    if (e.target.type === "number" && value !== "") {
      parsedValue = Number.parseFloat(value)
    }

    setEmploymentData((prev) => ({ ...prev, [name]: parsedValue }))

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
    // Update the field value
    setEmploymentData((prev) => {
      const newData = { ...prev, [name]: value }

      // If changing employment status to self-employed, update the isSelfEmployed flag
      if (name === "employmentStatus" && value === "selfEmployed") {
        newData.isSelfEmployed = true
        setShowSelfEmployedDetails(true)
      } else if (name === "employmentStatus" && value !== "selfEmployed") {
        // If changing to a non-self-employed status, update the flag
        newData.isSelfEmployed = false
        setShowSelfEmployedDetails(false)
      }

      // If changing partner's employment status to self-employed, update the partnerIsSelfEmployed flag
      if (name === "partnerEmploymentStatus" && value === "selfEmployed") {
        newData.partnerIsSelfEmployed = true
        setShowPartnerSelfEmployedDetails(true)
      } else if (name === "partnerEmploymentStatus" && value !== "selfEmployed") {
        // If changing to a non-self-employed status, update the flag
        newData.partnerIsSelfEmployed = false
        setShowPartnerSelfEmployedDetails(false)
      }

      return newData
    })

    // Clear error when field is filled
    if (errors[name] && value) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Update the handleSwitchChange function to properly set both state variables
  const handleSwitchChange = (checked: boolean) => {
    setEmploymentData((prev) => {
      // If turning on self-employed, also update employment status if it's not already self-employed
      if (checked && prev.employmentStatus !== "selfEmployed") {
        return { ...prev, isSelfEmployed: checked, employmentStatus: "selfEmployed" }
      }
      return { ...prev, isSelfEmployed: checked }
    })
    setShowSelfEmployedDetails(checked)
  }

  const handlePartnerSwitchChange = (checked: boolean) => {
    setEmploymentData((prev) => {
      // If turning on partner self-employed, also update partner employment status if it's not already self-employed
      if (checked && prev.partnerEmploymentStatus !== "selfEmployed") {
        return { ...prev, partnerIsSelfEmployed: checked, partnerEmploymentStatus: "selfEmployed" }
      }
      return { ...prev, partnerIsSelfEmployed: checked }
    })
    setShowPartnerSelfEmployedDetails(checked)
  }

  const togglePartnerDetails = () => {
    const newShowPartnerDetails = !showPartnerDetails
    setShowPartnerDetails(newShowPartnerDetails)
    setEmploymentData((prev) => ({ ...prev, hasPartner: newShowPartnerDetails }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!employmentData.employmentStatus) {
      newErrors.employmentStatus = "Employment status is required"
    }

    if (!employmentData.annualIncome || employmentData.annualIncome <= 0) {
      newErrors.annualIncome = "Annual income is required"
    }

    if (employmentData.isSelfEmployed || employmentData.employmentStatus === "selfEmployed") {
      if (!employmentData.businessType) {
        newErrors.businessType = "Business type is required"
      }
      if (!employmentData.abnAcn) {
        newErrors.abnAcn = "ABN/ACN is required"
      }
    }

    if (employmentData.hasPartner) {
      if (!employmentData.partnerEmploymentStatus) {
        newErrors.partnerEmploymentStatus = "Partner's employment status is required"
      }
      if (!employmentData.partnerAnnualIncome || employmentData.partnerAnnualIncome <= 0) {
        newErrors.partnerAnnualIncome = "Partner's annual income is required"
      }

      if (employmentData.partnerIsSelfEmployed || employmentData.partnerEmploymentStatus === "selfEmployed") {
        if (!employmentData.partnerBusinessType) {
          newErrors.partnerBusinessType = "Partner's business type is required"
        }
        if (!employmentData.partnerAbnAcn) {
          newErrors.partnerAbnAcn = "Partner's ABN/ACN is required"
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    try {
      setIsSaving(true)
      
      // Save all form data to context
      updateMultipleFields(employmentData)
      
      // Save to server before navigating
      await saveToServer()
      
      // Navigate to next step
      router.push(`/loan-info/${loanId || 'new'}/financial`)
    } catch (err) {
      console.error("Failed to save employment information:", err)
      // Display error to user if needed
    } finally {
      setIsSaving(false)
    }
  }

  // Determine if we should show self-employed fields based on either the toggle or the employment status
  const isSelfEmployed = employmentData.isSelfEmployed || employmentData.employmentStatus === "selfEmployed"
  const isPartnerSelfEmployed =
    employmentData.partnerIsSelfEmployed || employmentData.partnerEmploymentStatus === "selfEmployed"

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employmentStatus">
                Employment Status <span className="text-red-500">*</span>
              </Label>
              <Select value={employmentData.employmentStatus} onValueChange={handleSelectChange("employmentStatus")}>
                <SelectTrigger
                  className={`border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${errors.employmentStatus ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Select employment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fullTime">Full-Time</SelectItem>
                  <SelectItem value="partTime">Part-Time</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="selfEmployed">Self-Employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
              {errors.employmentStatus && <p className="text-sm text-red-500">{errors.employmentStatus}</p>}
            </div>

            {employmentData.employmentStatus !== "unemployed" && employmentData.employmentStatus !== "retired" && (
              <>
                {employmentData.employmentStatus !== "selfEmployed" && (
                  <div className="flex items-center space-x-2 py-2">
                    <Switch
                      id="isSelfEmployed"
                      checked={employmentData.isSelfEmployed}
                      onCheckedChange={handleSwitchChange}
                    />
                    <Label htmlFor="isSelfEmployed">I am self-employed</Label>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="employerName">{isSelfEmployed ? "Business Name" : "Employer Name"}</Label>
                  <Input
                    id="employerName"
                    name="employerName"
                    value={employmentData.employerName}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobTitle">{isSelfEmployed ? "Business Role" : "Job Title"}</Label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    value={employmentData.jobTitle}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsInCurrentJob">
                    {isSelfEmployed ? "Years in Business" : "Years in Current Job"}
                  </Label>
                  <Input
                    id="yearsInCurrentJob"
                    name="yearsInCurrentJob"
                    type="number"
                    min="0"
                    step="0.5"
                    value={employmentData.yearsInCurrentJob}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="annualIncome">
                  {isSelfEmployed ? "Annual Personal Income (AUD)" : "Annual Income (AUD)"}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="annualIncome"
                  name="annualIncome"
                  type="number"
                  min="0"
                  value={employmentData.annualIncome}
                  onChange={handleInputChange}
                  className={`border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${errors.annualIncome ? "border-red-500" : ""}`}
                />
                {errors.annualIncome && <p className="text-sm text-red-500">{errors.annualIncome}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalIncome">
                  {isSelfEmployed ? "Additional Personal Income (AUD)" : "Additional Income (AUD)"}
                </Label>
                <Input
                  id="additionalIncome"
                  name="additionalIncome"
                  type="number"
                  min="0"
                  value={employmentData.additionalIncome}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Self-employed additional details */}
            {showSelfEmployedDetails && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="text-lg font-medium text-blue-800 mb-4">Self-Employment Details</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessType">
                      Business Type <span className="text-red-500">*</span>
                    </Label>
                    <Select value={employmentData.businessType} onValueChange={handleSelectChange("businessType")}>
                      <SelectTrigger
                        className={`border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${errors.businessType ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="soleTrader">Sole Trader</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="company">Company</SelectItem>
                        <SelectItem value="trust">Trust</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.businessType && <p className="text-sm text-red-500">{errors.businessType}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="abnAcn">
                      ABN/ACN <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="abnAcn"
                      name="abnAcn"
                      value={employmentData.abnAcn}
                      onChange={handleInputChange}
                      className={`border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${errors.abnAcn ? "border-red-500" : ""}`}
                    />
                    {errors.abnAcn && <p className="text-sm text-red-500">{errors.abnAcn}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessIndustry">Business Industry</Label>
                    <Input
                      id="businessIndustry"
                      name="businessIndustry"
                      value={employmentData.businessIndustry}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="annualBusinessRevenue">Annual Business Revenue (AUD)</Label>
                    <Input
                      id="annualBusinessRevenue"
                      name="annualBusinessRevenue"
                      type="number"
                      min="0"
                      value={employmentData.annualBusinessRevenue}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Partner Details Section */}
      <div className="mt-8">
        <Button type="button" variant="outline" onClick={togglePartnerDetails} className="flex items-center gap-2 mb-4">
          {showPartnerDetails ? (
            <>
              <X size={16} /> Hide Partner Details
            </>
          ) : (
            <>
              <Plus size={16} /> Add Partner Details
            </>
          )}
        </Button>

        {showPartnerDetails && (
          <Card className="overflow-hidden border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Partner's Employment Details</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="partnerEmploymentStatus">
                    Employment Status <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={employmentData.partnerEmploymentStatus}
                    onValueChange={handleSelectChange("partnerEmploymentStatus")}
                  >
                    <SelectTrigger
                      className={`border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${errors.partnerEmploymentStatus ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fullTime">Full-Time</SelectItem>
                      <SelectItem value="partTime">Part-Time</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="selfEmployed">Self-Employed</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.partnerEmploymentStatus && (
                    <p className="text-sm text-red-500">{errors.partnerEmploymentStatus}</p>
                  )}
                </div>

                {employmentData.partnerEmploymentStatus !== "unemployed" &&
                  employmentData.partnerEmploymentStatus !== "retired" && (
                    <>
                      {employmentData.partnerEmploymentStatus !== "selfEmployed" && (
                        <div className="flex items-center space-x-2 py-2">
                          <Switch
                            id="partnerIsSelfEmployed"
                            checked={employmentData.partnerIsSelfEmployed}
                            onCheckedChange={handlePartnerSwitchChange}
                          />
                          <Label htmlFor="partnerIsSelfEmployed">My partner is self-employed</Label>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="partnerEmployerName">
                          {isPartnerSelfEmployed ? "Business Name" : "Employer Name"}
                        </Label>
                        <Input
                          id="partnerEmployerName"
                          name="partnerEmployerName"
                          value={employmentData.partnerEmployerName}
                          onChange={handleInputChange}
                          className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="partnerJobTitle">{isPartnerSelfEmployed ? "Business Role" : "Job Title"}</Label>
                        <Input
                          id="partnerJobTitle"
                          name="partnerJobTitle"
                          value={employmentData.partnerJobTitle}
                          onChange={handleInputChange}
                          className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="partnerYearsInCurrentJob">
                          {isPartnerSelfEmployed ? "Years in Business" : "Years in Current Job"}
                        </Label>
                        <Input
                          id="partnerYearsInCurrentJob"
                          name="partnerYearsInCurrentJob"
                          type="number"
                          min="0"
                          step="0.5"
                          value={employmentData.partnerYearsInCurrentJob}
                          onChange={handleInputChange}
                          className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </>
                  )}

                <div className="space-y-2">
                  <Label htmlFor="partnerAnnualIncome">
                    {isPartnerSelfEmployed ? "Annual Personal Income (AUD)" : "Annual Income (AUD)"}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="partnerAnnualIncome"
                    name="partnerAnnualIncome"
                    type="number"
                    min="0"
                    value={employmentData.partnerAnnualIncome}
                    onChange={handleInputChange}
                    className={`border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${errors.partnerAnnualIncome ? "border-red-500" : ""}`}
                  />
                  {errors.partnerAnnualIncome && <p className="text-sm text-red-500">{errors.partnerAnnualIncome}</p>}
                </div>

                {/* Partner Self-employed additional details */}
                {showPartnerSelfEmployedDetails && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="text-lg font-medium text-blue-800 mb-4">Partner's Self-Employment Details</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="partnerBusinessType">
                          Business Type <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={employmentData.partnerBusinessType}
                          onValueChange={handleSelectChange("partnerBusinessType")}
                        >
                          <SelectTrigger
                            className={`border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${errors.partnerBusinessType ? "border-red-500" : ""}`}
                          >
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="soleTrader">Sole Trader</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="company">Company</SelectItem>
                            <SelectItem value="trust">Trust</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.partnerBusinessType && (
                          <p className="text-sm text-red-500">{errors.partnerBusinessType}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="partnerAbnAcn">
                          ABN/ACN <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="partnerAbnAcn"
                          name="partnerAbnAcn"
                          value={employmentData.partnerAbnAcn}
                          onChange={handleInputChange}
                          className={`border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${errors.partnerAbnAcn ? "border-red-500" : ""}`}
                        />
                        {errors.partnerAbnAcn && <p className="text-sm text-red-500">{errors.partnerAbnAcn}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="partnerBusinessIndustry">Business Industry</Label>
                        <Input
                          id="partnerBusinessIndustry"
                          name="partnerBusinessIndustry"
                          value={employmentData.partnerBusinessIndustry}
                          onChange={handleInputChange}
                          className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="partnerAnnualBusinessRevenue">Annual Business Revenue (AUD)</Label>
                        <Input
                          id="partnerAnnualBusinessRevenue"
                          name="partnerAnnualBusinessRevenue"
                          type="number"
                          min="0"
                          value={employmentData.partnerAnnualBusinessRevenue}
                          onChange={handleInputChange}
                          className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={() => router.push(`/loan-info/${loanId || 'new'}/personal`)}
          disabled={isSaving || isLoading}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          disabled={isSaving || isLoading}
        >
          {isSaving || isLoading ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="text-sm text-gray-500 italic">
        <span className="text-red-500">*</span> Required fields must be completed before proceeding to the next step.
      </div>
    </motion.div>
  )
}
