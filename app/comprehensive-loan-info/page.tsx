"use client"

import type React from "react"

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

export default function ComprehensiveLoanInfo() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    address: "",
    residentialStatus: "",
    timeAtAddress: "",
    previousAddress: "",

    // Employment Information
    employmentStatus: "",
    employerName: "",
    jobTitle: "",
    timeWithEmployer: "",
    annualIncome: 120000,
    additionalIncome: 0,
    previousEmployer: "",

    // Property Information
    propertyAddress: "",
    propertyType: "",
    propertyValue: 750000,
    propertyUse: "",
    yearBuilt: "",
    landSize: "",

    // Current Loan Information
    currentLender: "",
    currentLoanBalance: 500000,
    currentInterestRate: 5.5,
    currentRepayment: 3000,
    loanStartDate: "",
    fixedRateExpiry: "",

    // New Loan Details
    loanAmount: 500000,
    loanPurpose: "",
    loanTerm: 30,
    loanType: "",
    interestRateType: "",
    fixedRateTerm: "",

    // Financial Information
    otherDebts: 15000,
    monthlyExpenses: 4000,
    savingsBalance: 50000,
    creditScore: "",

    // Additional Features
    desiredFeatures: {
      offsetAccount: false,
      redrawFacility: false,
      extraRepayments: false,
      fixedRate: false,
      variableRate: false,
      splitLoan: false,
      interestOnly: false,
      principalAndInterest: false,
      packageDiscount: false,
      noAnnualFee: false,
    },

    // Additional Information
    additionalInfo: "",
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
      router.push(`/loan-comparison?amount=${formData.loanAmount}&term=${formData.loanTerm}`)
    } else {
      // In a real application, you might want to add some basic validation here
      router.push(`/loan-comparison?amount=${formData.loanAmount}&term=${formData.loanTerm}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 bg-gradient-to-br from-gray-800 to-blue-900 text-gray-100 min-h-screen relative">
      <h1 className="text-3xl font-bold mb-6 text-center">Comprehensive Home Loan Information</h1>
      <p className="text-center text-gray-300 mb-8">
        Please provide detailed information about your current mortgage and refinancing needs to help us find the best
        options for you.
      </p>
      <div className="flex items-center justify-end space-x-2 mb-4">
        <Label htmlFor="demo-mode" className="text-sm font-medium text-gray-200">
          Demo Mode
        </Label>
        <Switch id="demo-mode" checked={demoMode} onCheckedChange={setDemoMode} className="bg-gray-400" />
      </div>

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
          <CardTitle className="text-gray-100">Home Loan Refinance Application Form</CardTitle>
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
                    required
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
                    required
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
                    required
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
                    required
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="text-gray-200">
                    Current Residential Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="residentialStatus" className="text-gray-200">
                    Residential Status
                  </Label>
                  <Select onValueChange={handleSelectChange("residentialStatus")} value={formData.residentialStatus}>
                    <SelectTrigger className="bg-gray-600 text-gray-100 border-gray-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Own Outright</SelectItem>
                      <SelectItem value="mortgaged">Own with Mortgage</SelectItem>
                      <SelectItem value="renting">Renting</SelectItem>
                      <SelectItem value="boarder">Boarding</SelectItem>
                      <SelectItem value="living_with_parents">Living with Parents</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeAtAddress" className="text-gray-200">
                    Time at Current Address
                  </Label>
                  <Input
                    id="timeAtAddress"
                    name="timeAtAddress"
                    placeholder="e.g., 3 years 6 months"
                    value={formData.timeAtAddress}
                    onChange={handleInputChange}
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
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fullTime">Full-Time</SelectItem>
                      <SelectItem value="partTime">Part-Time</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="selfEmployed">Self-Employed</SelectItem>
                      <SelectItem value="contractor">Contractor</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
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
                  <Label htmlFor="timeWithEmployer" className="text-gray-200">
                    Time with Current Employer
                  </Label>
                  <Input
                    id="timeWithEmployer"
                    name="timeWithEmployer"
                    placeholder="e.g., 2 years 3 months"
                    value={formData.timeWithEmployer}
                    onChange={handleInputChange}
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
                    max={500000}
                    step={5000}
                    value={[formData.annualIncome]}
                    onValueChange={handleSliderChange("annualIncome")}
                  />
                  <div className="text-right text-sm">${formData.annualIncome.toLocaleString()}</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalIncome" className="text-gray-200">
                    Additional Income (AUD)
                  </Label>
                  <Slider
                    id="additionalIncome"
                    min={0}
                    max={200000}
                    step={1000}
                    value={[formData.additionalIncome]}
                    onValueChange={handleSliderChange("additionalIncome")}
                  />
                  <div className="text-right text-sm">${formData.additionalIncome.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Property Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-100">Property Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
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
                  <Label htmlFor="propertyType" className="text-gray-200">
                    Property Type
                  </Label>
                  <Select onValueChange={handleSelectChange("propertyType")} value={formData.propertyType}>
                    <SelectTrigger className="bg-gray-600 text-gray-100 border-gray-500">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment/Unit</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="land">Vacant Land</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
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
                  <Label htmlFor="propertyUse" className="text-gray-200">
                    Property Use
                  </Label>
                  <Select onValueChange={handleSelectChange("propertyUse")} value={formData.propertyUse}>
                    <SelectTrigger className="bg-gray-600 text-gray-100 border-gray-500">
                      <SelectValue placeholder="Select property use" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary Residence</SelectItem>
                      <SelectItem value="investment">Investment Property</SelectItem>
                      <SelectItem value="holiday">Holiday Home</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearBuilt" className="text-gray-200">
                    Year Built (if known)
                  </Label>
                  <Input
                    id="yearBuilt"
                    name="yearBuilt"
                    value={formData.yearBuilt}
                    onChange={handleInputChange}
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Current Loan Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-100">Current Loan Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentLender" className="text-gray-200">
                    Current Lender
                  </Label>
                  <Input
                    id="currentLender"
                    name="currentLender"
                    value={formData.currentLender}
                    onChange={handleInputChange}
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentLoanBalance" className="text-gray-200">
                    Current Loan Balance (AUD)
                  </Label>
                  <Slider
                    id="currentLoanBalance"
                    min={0}
                    max={1500000}
                    step={10000}
                    value={[formData.currentLoanBalance]}
                    onValueChange={handleSliderChange("currentLoanBalance")}
                  />
                  <div className="text-right text-sm">${formData.currentLoanBalance.toLocaleString()}</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentInterestRate" className="text-gray-200">
                    Current Interest Rate (%)
                  </Label>
                  <Slider
                    id="currentInterestRate"
                    min={2}
                    max={10}
                    step={0.05}
                    value={[formData.currentInterestRate]}
                    onValueChange={handleSliderChange("currentInterestRate")}
                  />
                  <div className="text-right text-sm">{formData.currentInterestRate}%</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentRepayment" className="text-gray-200">
                    Current Monthly Repayment (AUD)
                  </Label>
                  <Slider
                    id="currentRepayment"
                    min={500}
                    max={10000}
                    step={100}
                    value={[formData.currentRepayment]}
                    onValueChange={handleSliderChange("currentRepayment")}
                  />
                  <div className="text-right text-sm">${formData.currentRepayment.toLocaleString()}</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanStartDate" className="text-gray-200">
                    Loan Start Date
                  </Label>
                  <Input
                    id="loanStartDate"
                    name="loanStartDate"
                    type="date"
                    value={formData.loanStartDate}
                    onChange={handleInputChange}
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fixedRateExpiry" className="text-gray-200">
                    Fixed Rate Expiry Date (if applicable)
                  </Label>
                  <Input
                    id="fixedRateExpiry"
                    name="fixedRateExpiry"
                    type="date"
                    value={formData.fixedRateExpiry}
                    onChange={handleInputChange}
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* New Loan Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-100">New Loan Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loanAmount" className="text-gray-200">
                    Desired Loan Amount (AUD)
                  </Label>
                  <Slider
                    id="loanAmount"
                    min={10000}
                    max={2000000}
                    step={10000}
                    value={[formData.loanAmount]}
                    onValueChange={handleSliderChange("loanAmount")}
                  />
                  <div className="text-right text-sm">${formData.loanAmount.toLocaleString()}</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanPurpose" className="text-gray-200">
                    Primary Loan Purpose
                  </Label>
                  <Select onValueChange={handleSelectChange("loanPurpose")} value={formData.loanPurpose}>
                    <SelectTrigger className="bg-gray-600 text-gray-100 border-gray-500">
                      <SelectValue placeholder="Select loan purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="refinance">Refinance Existing Mortgage</SelectItem>
                      <SelectItem value="lowerRate">Lower Interest Rate</SelectItem>
                      <SelectItem value="cashOut">Cash Out / Access Equity</SelectItem>
                      <SelectItem value="consolidate">Debt Consolidation</SelectItem>
                      <SelectItem value="renovation">Home Renovation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
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
                  <Label htmlFor="loanType" className="text-gray-200">
                    Loan Type
                  </Label>
                  <Select onValueChange={handleSelectChange("loanType")} value={formData.loanType}>
                    <SelectTrigger className="bg-gray-600 text-gray-100 border-gray-500">
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Home Loan</SelectItem>
                      <SelectItem value="basic">Basic Home Loan</SelectItem>
                      <SelectItem value="package">Home Loan Package</SelectItem>
                      <SelectItem value="offset">Offset Home Loan</SelectItem>
                      <SelectItem value="line">Line of Credit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interestRateType" className="text-gray-200">
                    Interest Rate Type
                  </Label>
                  <Select onValueChange={handleSelectChange("interestRateType")} value={formData.interestRateType}>
                    <SelectTrigger className="bg-gray-600 text-gray-100 border-gray-500">
                      <SelectValue placeholder="Select interest rate type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="variable">Variable Rate</SelectItem>
                      <SelectItem value="fixed">Fixed Rate</SelectItem>
                      <SelectItem value="split">Split Loan (Part Fixed, Part Variable)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fixedRateTerm" className="text-gray-200">
                    Fixed Rate Term (if applicable)
                  </Label>
                  <Select onValueChange={handleSelectChange("fixedRateTerm")} value={formData.fixedRateTerm}>
                    <SelectTrigger className="bg-gray-600 text-gray-100 border-gray-500">
                      <SelectValue placeholder="Select fixed rate term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Year</SelectItem>
                      <SelectItem value="2">2 Years</SelectItem>
                      <SelectItem value="3">3 Years</SelectItem>
                      <SelectItem value="4">4 Years</SelectItem>
                      <SelectItem value="5">5 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-100">Financial Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="otherDebts" className="text-gray-200">
                    Other Debts (AUD)
                  </Label>
                  <Slider
                    id="otherDebts"
                    min={0}
                    max={200000}
                    step={1000}
                    value={[formData.otherDebts]}
                    onValueChange={handleSliderChange("otherDebts")}
                  />
                  <div className="text-right text-sm">${formData.otherDebts.toLocaleString()}</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyExpenses" className="text-gray-200">
                    Monthly Expenses (AUD)
                  </Label>
                  <Slider
                    id="monthlyExpenses"
                    min={1000}
                    max={20000}
                    step={100}
                    value={[formData.monthlyExpenses]}
                    onValueChange={handleSliderChange("monthlyExpenses")}
                  />
                  <div className="text-right text-sm">${formData.monthlyExpenses.toLocaleString()}</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="savingsBalance" className="text-gray-200">
                    Savings Balance (AUD)
                  </Label>
                  <Slider
                    id="savingsBalance"
                    min={0}
                    max={500000}
                    step={1000}
                    value={[formData.savingsBalance]}
                    onValueChange={handleSliderChange("savingsBalance")}
                  />
                  <div className="text-right text-sm">${formData.savingsBalance.toLocaleString()}</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="creditScore" className="text-gray-200">
                    Credit Score (if known)
                  </Label>
                  <Input
                    id="creditScore"
                    name="creditScore"
                    type="number"
                    value={formData.creditScore}
                    onChange={handleInputChange}
                    min="0"
                    max="1000"
                    className="bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Additional Features */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-100">Desired Home Loan Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="offsetAccount"
                    checked={formData.desiredFeatures.offsetAccount}
                    onCheckedChange={handleCheckboxChange("offsetAccount")}
                  />
                  <Label htmlFor="offsetAccount" className="text-gray-200">
                    Offset Account
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="redrawFacility"
                    checked={formData.desiredFeatures.redrawFacility}
                    onCheckedChange={handleCheckboxChange("redrawFacility")}
                  />
                  <Label htmlFor="redrawFacility" className="text-gray-200">
                    Redraw Facility
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="extraRepayments"
                    checked={formData.desiredFeatures.extraRepayments}
                    onCheckedChange={handleCheckboxChange("extraRepayments")}
                  />
                  <Label htmlFor="extraRepayments" className="text-gray-200">
                    Extra Repayments
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fixedRate"
                    checked={formData.desiredFeatures.fixedRate}
                    onCheckedChange={handleCheckboxChange("fixedRate")}
                  />
                  <Label htmlFor="fixedRate" className="text-gray-200">
                    Fixed Interest Rate
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="variableRate"
                    checked={formData.desiredFeatures.variableRate}
                    onCheckedChange={handleCheckboxChange("variableRate")}
                  />
                  <Label htmlFor="variableRate" className="text-gray-200">
                    Variable Interest Rate
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="splitLoan"
                    checked={formData.desiredFeatures.splitLoan}
                    onCheckedChange={handleCheckboxChange("splitLoan")}
                  />
                  <Label htmlFor="splitLoan" className="text-gray-200">
                    Split Loan (Part Fixed, Part Variable)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="interestOnly"
                    checked={formData.desiredFeatures.interestOnly}
                    onCheckedChange={handleCheckboxChange("interestOnly")}
                  />
                  <Label htmlFor="interestOnly" className="text-gray-200">
                    Interest-Only Period
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="principalAndInterest"
                    checked={formData.desiredFeatures.principalAndInterest}
                    onCheckedChange={handleCheckboxChange("principalAndInterest")}
                  />
                  <Label htmlFor="principalAndInterest" className="text-gray-200">
                    Principal and Interest
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="packageDiscount"
                    checked={formData.desiredFeatures.packageDiscount}
                    onCheckedChange={handleCheckboxChange("packageDiscount")}
                  />
                  <Label htmlFor="packageDiscount" className="text-gray-200">
                    Package Discount
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="noAnnualFee"
                    checked={formData.desiredFeatures.noAnnualFee}
                    onCheckedChange={handleCheckboxChange("noAnnualFee")}
                  />
                  <Label htmlFor="noAnnualFee" className="text-gray-200">
                    No Annual Fee
                  </Label>
                </div>
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
                Submit and View Home Loan Comparisons
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
