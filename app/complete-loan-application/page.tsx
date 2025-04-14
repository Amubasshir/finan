"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Zap, AlertTriangle } from "lucide-react"

export default function CompleteLoanApplication() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    maritalStatus: "",
    dependents: 0,
    address: "",
    city: "",
    state: "",
    zipCode: "",
    timeAtAddress: 0,

    // Employment Information
    employmentStatus: "",
    employerName: "",
    jobTitle: "",
    yearsInCurrentJob: 0,
    annualIncome: 50000,
    additionalIncome: 0,
    incomeSource: "",

    // Financial Information
    creditScore: "",
    monthlyExpenses: 0,
    existingDebts: 0,
    bankruptcyHistory: "",
    savingsBalance: 0,
    investments: 0,
    otherAssets: 0,

    // Property Information
    propertyType: "",
    propertyValue: 500000,
    propertyAddress: "",
    propertyUsage: "",
    downPayment: 100000,

    // Loan Requirements
    loanAmount: 400000,
    loanPurpose: "",
    loanTerm: 30,
    interestRatePreference: "",

    // Additional Features
    desiredFeatures: {
      offsetAccount: false,
      redrawFacility: false,
      extraRepayments: false,
      interestOnly: false,
      fixedRate: false,
      splitLoan: false,
    },

    // Additional Information
    additionalInfo: "",

    // Document Upload (in a real application, this would handle file uploads)
    documentsUploaded: false,
  })

  const [demoMode, setDemoMode] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    setFormData((prev) => ({
      ...prev,
      desiredFeatures: { ...prev.desiredFeatures, [name]: checked },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Add a check for demo mode
    if (demoMode) {
      console.log("Demo mode: Skipping validation")
      router.push("/loan-comparison")
    } else {
      // In a real application, you might want to add some basic validation here
      // For now, we'll just proceed to the loan comparison page
      router.push("/loan-comparison")
    }
  }

  const handleSaveAndExit = () => {
    console.log("Saving application progress:", formData)
    router.push("/dashboard")
  }

  const handleSkipForm = () => {
    console.log("Skipping form in demo mode")
    router.push("/loan-comparison")
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 bg-gradient-to-br from-gray-800 to-blue-900 text-gray-100 min-h-screen relative">
      <h1 className="text-3xl font-bold mb-6 text-center">Compare Loan Options</h1>
      <p className="text-center text-gray-300 mb-8">
        Please fill out all the required information to process your loan application.
      </p>
      <div className="flex items-center justify-end space-x-2 mb-4">
        <Label htmlFor="demo-mode" className="text-sm font-medium text-gray-200">
          Demo Mode
        </Label>
        <Switch id="demo-mode" checked={demoMode} onCheckedChange={setDemoMode} className="bg-gray-400" />
      </div>

      {demoMode && (
        <Button
          onClick={handleSkipForm}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        >
          Skip Form (Demo Mode)
        </Button>
      )}

      {demoMode && (
        <Alert className="bg-green-800 border-green-600 mb-4">
          <Zap className="h-4 w-4" />
          <AlertTitle>Demo Mode Active</AlertTitle>
          <AlertDescription>
            Form fields will be pre-filled with sample data for demonstration purposes.
          </AlertDescription>
        </Alert>
      )}

      <Card className="max-w-4xl mx-auto bg-gray-700 border-gray-600">
        <CardHeader>
          <CardTitle className="text-gray-100">Loan Application Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-100">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-200">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-200">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-gray-200">
                    Date of Birth
                  </Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maritalStatus" className="text-gray-200">
                    Marital Status
                  </Label>
                  <Select onValueChange={handleSelectChange("maritalStatus")} value={formData.maritalStatus}>
                    <SelectTrigger className="bg-gray-600 text-gray-100 border-gray-500">
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dependents" className="text-gray-200">
                    Number of Dependents
                  </Label>
                  <Input
                    id="dependents"
                    name="dependents"
                    type="number"
                    value={formData.dependents}
                    onChange={handleInputChange}
                    min={0}
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-200">
                    Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-gray-200">
                    City
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-gray-200">
                    State
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode" className="text-gray-200">
                    ZIP Code
                  </Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeAtAddress" className="text-gray-200">
                    Time at Current Address (years)
                  </Label>
                  <Input
                    id="timeAtAddress"
                    name="timeAtAddress"
                    type="number"
                    value={formData.timeAtAddress}
                    onChange={handleInputChange}
                    min={0}
                    step={0.5}
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-100">Employment Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employmentStatus" className="text-gray-200">
                    Employment Status
                  </Label>
                  <Select onValueChange={handleSelectChange("employmentStatus")} value={formData.employmentStatus}>
                    <SelectTrigger className="bg-gray-600 text-gray-100 border-gray-500">
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fullTime">Full-time</SelectItem>
                      <SelectItem value="partTime">Part-time</SelectItem>
                      <SelectItem value="selfEmployed">Self-employed</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employerName" className="text-gray-200">
                    Employer Name
                  </Label>
                  <Input
                    id="employerName"
                    name="employerName"
                    value={formData.employerName}
                    onChange={handleInputChange}
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle" className="text-gray-200">
                    Job Title
                  </Label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsInCurrentJob" className="text-gray-200">
                    Years in Current Job
                  </Label>
                  <Input
                    id="yearsInCurrentJob"
                    name="yearsInCurrentJob"
                    type="number"
                    value={formData.yearsInCurrentJob}
                    onChange={handleInputChange}
                    min={0}
                    step={0.5}
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annualIncome" className="text-gray-200">
                    Annual Income (AUD)
                  </Label>
                  <Slider
                    id="annualIncome"
                    min={0}
                    max={1000000}
                    step={1000}
                    value={[formData.annualIncome]}
                    onValueChange={handleSliderChange("annualIncome")}
                  />
                  <div className="text-right text-sm">${formData.annualIncome.toLocaleString()}</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalIncome" className="text-gray-200">
                    Additional Annual Income (AUD)
                  </Label>
                  <Input
                    id="additionalIncome"
                    name="additionalIncome"
                    type="number"
                    value={formData.additionalIncome}
                    onChange={handleInputChange}
                    min={0}
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incomeSource" className="text-gray-200">
                    Source of Additional Income
                  </Label>
                  <Input
                    id="incomeSource"
                    name="incomeSource"
                    value={formData.incomeSource}
                    onChange={handleInputChange}
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-100">Financial Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="creditScore" className="text-gray-200">
                    Credit Score
                  </Label>
                  <Select onValueChange={handleSelectChange("creditScore")} value={formData.creditScore}>
                    <SelectTrigger className="bg-gray-600 text-gray-100 border-gray-500">
                      <SelectValue placeholder="Select credit score range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent (800+)</SelectItem>
                      <SelectItem value="veryGood">Very Good (740-799)</SelectItem>
                      <SelectItem value="good">Good (670-739)</SelectItem>
                      <SelectItem value="fair">Fair (580-669)</SelectItem>
                      <SelectItem value="poor">Poor (300-579)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyExpenses" className="text-gray-200">
                    Monthly Expenses (AUD)
                  </Label>
                  <Input
                    id="monthlyExpenses"
                    name="monthlyExpenses"
                    type="number"
                    value={formData.monthlyExpenses}
                    onChange={handleInputChange}
                    min={0}
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="existingDebts" className="text-gray-200">
                    Existing Debts (AUD)
                  </Label>
                  <Input
                    id="existingDebts"
                    name="existingDebts"
                    type="number"
                    value={formData.existingDebts}
                    onChange={handleInputChange}
                    min={0}
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankruptcyHistory" className="text-gray-200">
                    Bankruptcy History
                  </Label>
                  <Select onValueChange={handleSelectChange("bankruptcyHistory")} value={formData.bankruptcyHistory}>
                    <SelectTrigger className="bg-gray-600 text-gray-100 border-gray-500">
                      <SelectValue placeholder="Select bankruptcy history" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never filed for bankruptcy</SelectItem>
                      <SelectItem value="past7Years">Filed within the past 7 years</SelectItem>
                      <SelectItem value="moreThan7Years">Filed more than 7 years ago</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="savingsBalance" className="text-gray-200">
                    Savings Balance (AUD)
                  </Label>
                  <Input
                    id="savingsBalance"
                    name="savingsBalance"
                    type="number"
                    value={formData.savingsBalance}
                    onChange={handleInputChange}
                    min={0}
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="investments" className="text-gray-200">
                    Investments (AUD)
                  </Label>
                  <Input
                    id="investments"
                    name="investments"
                    type="number"
                    value={formData.investments}
                    onChange={handleInputChange}
                    min={0}
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otherAssets" className="text-gray-200">
                    Other Assets (AUD)
                  </Label>
                  <Input
                    id="otherAssets"
                    name="otherAssets"
                    type="number"
                    value={formData.otherAssets}
                    onChange={handleInputChange}
                    min={0}
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Property Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-100">Property Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyType" className="text-gray-200">
                    Property Type
                  </Label>
                  <Select onValueChange={handleSelectChange("propertyType")} value={formData.propertyType}>
                    <SelectTrigger className="bg-gray-600 text-gray-100 border-gray-500">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyValue" className="text-gray-200">
                    Estimated Property Value (AUD)
                  </Label>
                  <Slider
                    id="propertyValue"
                    min={100000}
                    max={2000000}
                    step={10000}
                    value={[formData.propertyValue]}
                    onValueChange={handleSliderChange("propertyValue")}
                  />
                  <div className="text-right text-sm">${formData.propertyValue.toLocaleString()}</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyAddress" className="text-gray-200">
                    Property Address
                  </Label>
                  <Input
                    id="propertyAddress"
                    name="propertyAddress"
                    value={formData.propertyAddress}
                    onChange={handleInputChange}
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyUsage" className="text-gray-200">
                    Property Usage
                  </Label>
                  <Select onValueChange={handleSelectChange("propertyUsage")} value={formData.propertyUsage}>
                    <SelectTrigger className="bg-gray-600 text-gray-100 border-gray-500">
                      <SelectValue placeholder="Select property usage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primaryResidence">Primary Residence</SelectItem>
                      <SelectItem value="investmentProperty">Investment Property</SelectItem>
                      <SelectItem value="vacationHome">Vacation Home</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="downPayment" className="text-gray-200">
                    Down Payment (AUD)
                  </Label>
                  <Input
                    id="downPayment"
                    name="downPayment"
                    type="number"
                    value={formData.downPayment}
                    onChange={handleInputChange}
                    min={0}
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Loan Requirements */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-100">Loan Requirements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loanAmount" className="text-gray-200">
                    Desired Loan Amount (AUD)
                  </Label>
                  <Slider
                    id="loanAmount"
                    min={100000}
                    max={1500000}
                    step={10000}
                    value={[formData.loanAmount]}
                    onValueChange={handleSliderChange("loanAmount")}
                  />
                  <div className="text-right text-sm">${formData.loanAmount.toLocaleString()}</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanPurpose" className="text-gray-200">
                    Loan Purpose
                  </Label>
                  <Select onValueChange={handleSelectChange("loanPurpose")} value={formData.loanPurpose}>
                    <SelectTrigger className="bg-gray-600 text-gray-100 border-gray-500">
                      <SelectValue placeholder="Select loan purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purchase">Purchase a property</SelectItem>
                      <SelectItem value="refinance">Refinance existing mortgage</SelectItem>
                      <SelectItem value="investment">Investment property</SelectItem>
                      <SelectItem value="construction">Construction loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanTerm" className="text-gray-200">
                    Loan Term (Years)
                  </Label>
                  <Slider
                    id="loanTerm"
                    min={1}
                    max={30}
                    step={1}
                    value={[formData.loanTerm]}
                    onValueChange={handleSliderChange("loanTerm")}
                  />
                  <div className="text-right text-sm">{formData.loanTerm} years</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interestRatePreference" className="text-gray-200">
                    Interest Rate Preference
                  </Label>
                  <Select
                    onValueChange={handleSelectChange("interestRatePreference")}
                    value={formData.interestRatePreference}
                  >
                    <SelectTrigger className="bg-gray-600 text-gray-100 border-gray-500">
                      <SelectValue placeholder="Select interest rate preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Rate</SelectItem>
                      <SelectItem value="variable">Variable Rate</SelectItem>
                      <SelectItem value="split">Split Rate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Additional Features */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-100">Desired Loan Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(formData.desiredFeatures).map(([feature, checked]) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox id={feature} checked={checked} onCheckedChange={handleCheckboxChange(feature)} />
                    <Label htmlFor={feature} className="text-gray-200">
                      {feature.charAt(0).toUpperCase() + feature.slice(1).replace(/([A-Z])/g, " $1")}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-100">Additional Information</h2>
              <div className="space-y-2">
                <Label htmlFor="additionalInfo" className="text-gray-200">
                  Any additional information or special circumstances
                </Label>
                <Textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Submit Application
              </Button>
              <Button type="button" onClick={handleSaveAndExit} className="bg-gray-500 hover:bg-gray-600">
                Save and Exit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Alert className="bg-blue-900 border-blue-700 mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Important Notice</AlertTitle>
        <AlertDescription>
          Please ensure all information provided is accurate and up-to-date. Submitting false information may result in
          your application being rejected or legal consequences.
        </AlertDescription>
      </Alert>
    </div>
  )
}
