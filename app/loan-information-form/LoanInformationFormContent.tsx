"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function LoanInformationFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedLoanIds = searchParams.getAll("id")

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    maritalStatus: "",
    dependents: "",
    currentAddress: "",
    timeAtAddress: "",
    residentialStatus: "",

    // Employment Information
    employmentStatus: "",
    employerName: "",
    jobTitle: "",
    yearsWithEmployer: "",
    annualIncome: "",
    additionalIncome: "",
    additionalIncomeSource: "",

    // Property Information
    propertyAddress: "",
    propertyType: "",
    propertyValue: "",
    propertyUsage: "",
    yearBuilt: "",
    bedrooms: "",
    bathrooms: "",
    landSize: "",

    // Current Loan Information
    currentLender: "",
    currentLoanBalance: "",
    currentInterestRate: "",
    currentRepayment: "",
    loanStartDate: "",
    fixedRateExpiry: "",
    breakCosts: "",

    // New Loan Details
    loanAmount: "",
    loanPurpose: "",
    loanTerm: "",
    interestRateType: "",
    fixedRateTerm: "",
    repaymentType: "",
    desiredFeatures: "",

    // Financial Information
    monthlyExpenses: "",
    otherDebts: "",
    savingsBalance: "",
    creditScore: "",

    // Additional Information
    additionalInfo: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    const queryString = selectedLoanIds.map((id) => `id=${id}`).join("&")
    router.push(`/document-collection?${queryString}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Home Loan Application</h1>
      <Card>
        <CardHeader>
          <CardTitle>Please provide your information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <Select onValueChange={handleSelectChange("maritalStatus")} value={formData.maritalStatus}>
                    <SelectTrigger>
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
                    value={formData.dependents}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentAddress">Current Address</Label>
                  <Input
                    id="currentAddress"
                    name="currentAddress"
                    value={formData.currentAddress}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeAtAddress">Time at Current Address</Label>
                  <Input
                    id="timeAtAddress"
                    name="timeAtAddress"
                    placeholder="e.g., 3 years 6 months"
                    value={formData.timeAtAddress}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="residentialStatus">Residential Status</Label>
                  <Select onValueChange={handleSelectChange("residentialStatus")} value={formData.residentialStatus}>
                    <SelectTrigger>
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
              </div>
            </div>

            {/* Employment Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Employment Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employmentStatus">Employment Status</Label>
                  <Select onValueChange={handleSelectChange("employmentStatus")} value={formData.employmentStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment status" />
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
                  <Label htmlFor="employerName">Employer Name</Label>
                  <Input
                    id="employerName"
                    name="employerName"
                    value={formData.employerName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsWithEmployer">Years with Current Employer</Label>
                  <Input
                    id="yearsWithEmployer"
                    name="yearsWithEmployer"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.yearsWithEmployer}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annualIncome">Annual Income (AUD)</Label>
                  <Input
                    id="annualIncome"
                    name="annualIncome"
                    type="number"
                    min="0"
                    value={formData.annualIncome}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalIncome">Additional Income (AUD)</Label>
                  <Input
                    id="additionalIncome"
                    name="additionalIncome"
                    type="number"
                    min="0"
                    value={formData.additionalIncome}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalIncomeSource">Source of Additional Income</Label>
                  <Input
                    id="additionalIncomeSource"
                    name="additionalIncomeSource"
                    value={formData.additionalIncomeSource}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Property Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Property Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyAddress">Property Address</Label>
                  <Input
                    id="propertyAddress"
                    name="propertyAddress"
                    value={formData.propertyAddress}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select onValueChange={handleSelectChange("propertyType")} value={formData.propertyType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment/Unit</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="land">Vacant Land</SelectItem>
                      <SelectItem value="rural">Rural Property</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyValue">Estimated Property Value (AUD)</Label>
                  <Input
                    id="propertyValue"
                    name="propertyValue"
                    type="number"
                    min="0"
                    value={formData.propertyValue}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyUsage">Property Usage</Label>
                  <Select onValueChange={handleSelectChange("propertyUsage")} value={formData.propertyUsage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property usage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primaryResidence">Primary Residence</SelectItem>
                      <SelectItem value="investment">Investment Property</SelectItem>
                      <SelectItem value="holidayHome">Holiday Home</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearBuilt">Year Built</Label>
                  <Input
                    id="yearBuilt"
                    name="yearBuilt"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.yearBuilt}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Number of Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Number of Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="landSize">Land Size (m²)</Label>
                  <Input
                    id="landSize"
                    name="landSize"
                    type="number"
                    min="0"
                    value={formData.landSize}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Current Loan Information (for Refinancing) */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Current Loan Information (if refinancing)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentLender">Current Lender</Label>
                  <Input
                    id="currentLender"
                    name="currentLender"
                    value={formData.currentLender}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentLoanBalance">Current Loan Balance (AUD)</Label>
                  <Input
                    id="currentLoanBalance"
                    name="currentLoanBalance"
                    type="number"
                    min="0"
                    value={formData.currentLoanBalance}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentInterestRate">Current Interest Rate (%)</Label>
                  <Input
                    id="currentInterestRate"
                    name="currentInterestRate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.currentInterestRate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentRepayment">Current Monthly Repayment (AUD)</Label>
                  <Input
                    id="currentRepayment"
                    name="currentRepayment"
                    type="number"
                    min="0"
                    value={formData.currentRepayment}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanStartDate">Loan Start Date</Label>
                  <Input
                    id="loanStartDate"
                    name="loanStartDate"
                    type="date"
                    value={formData.loanStartDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fixedRateExpiry">Fixed Rate Expiry Date (if applicable)</Label>
                  <Input
                    id="fixedRateExpiry"
                    name="fixedRateExpiry"
                    type="date"
                    value={formData.fixedRateExpiry}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breakCosts">Estimated Break Costs (if known, AUD)</Label>
                  <Input
                    id="breakCosts"
                    name="breakCosts"
                    type="number"
                    min="0"
                    value={formData.breakCosts}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* New Loan Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">New Loan Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Desired Loan Amount (AUD)</Label>
                  <Input
                    id="loanAmount"
                    name="loanAmount"
                    type="number"
                    min="0"
                    value={formData.loanAmount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanPurpose">Loan Purpose</Label>
                  <Select onValueChange={handleSelectChange("loanPurpose")} value={formData.loanPurpose}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select loan purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purchase">Property Purchase</SelectItem>
                      <SelectItem value="refinance">Refinance Existing Mortgage</SelectItem>
                      <SelectItem value="investment">Investment Property</SelectItem>
                      <SelectItem value="construction">Home Construction</SelectItem>
                      <SelectItem value="renovation">Home Renovation</SelectItem>
                      <SelectItem value="equity">Access Home Equity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                  <Select onValueChange={handleSelectChange("loanTerm")} value={formData.loanTerm}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select loan term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 years</SelectItem>
                      <SelectItem value="15">15 years</SelectItem>
                      <SelectItem value="20">20 years</SelectItem>
                      <SelectItem value="25">25 years</SelectItem>
                      <SelectItem value="30">30 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interestRateType">Interest Rate Type</Label>
                  <Select onValueChange={handleSelectChange("interestRateType")} value={formData.interestRateType}>
                    <SelectTrigger>
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
                  <Label htmlFor="fixedRateTerm">Fixed Rate Term (if applicable)</Label>
                  <Select onValueChange={handleSelectChange("fixedRateTerm")} value={formData.fixedRateTerm}>
                    <SelectTrigger>
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
                <div className="space-y-2">
                  <Label htmlFor="repaymentType">Repayment Type</Label>
                  <Select onValueChange={handleSelectChange("repaymentType")} value={formData.repaymentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select repayment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="principalAndInterest">Principal and Interest</SelectItem>
                      <SelectItem value="interestOnly">Interest Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desiredFeatures">Desired Loan Features</Label>
                  <Select onValueChange={handleSelectChange("desiredFeatures")} value={formData.desiredFeatures}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select desired features" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="offset">Offset Account</SelectItem>
                      <SelectItem value="redraw">Redraw Facility</SelectItem>
                      <SelectItem value="extraRepayments">Extra Repayments</SelectItem>
                      <SelectItem value="packageDiscount">Package Discount</SelectItem>
                      <SelectItem value="multiple">Multiple Features</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Financial Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyExpenses">Monthly Household Expenses (AUD)</Label>
                  <Input
                    id="monthlyExpenses"
                    name="monthlyExpenses"
                    type="number"
                    min="0"
                    value={formData.monthlyExpenses}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otherDebts">Other Debts (AUD)</Label>
                  <Input
                    id="otherDebts"
                    name="otherDebts"
                    type="number"
                    min="0"
                    value={formData.otherDebts}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="savingsBalance">Savings Balance (AUD)</Label>
                  <Input
                    id="savingsBalance"
                    name="savingsBalance"
                    type="number"
                    min="0"
                    value={formData.savingsBalance}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="creditScore">Credit Score (if known)</Label>
                  <Input
                    id="creditScore"
                    name="creditScore"
                    value={formData.creditScore}
                    onChange={handleInputChange}
                    placeholder="Leave blank if unknown"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                placeholder="Please provide any additional information that may be relevant to your home loan application"
                className="min-h-[100px]"
              />
            </div>

            <Button type="submit" className="w-full">
              Continue to Document Collection
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
