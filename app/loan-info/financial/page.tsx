"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle, DollarSign, CreditCard, Landmark, AlertTriangle, Loader2, Save } from "lucide-react"
import { useLoanInfo } from "../LoanInfoContext"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
export default function FinancialInfo() {
  const { formData, updateFormData,  saveToServer, isLoading } = useLoanInfo()
  const { toast } = useToast()
  const router = useRouter()

  // Initialize state with data from context
  const [formState, setFormState] = useState(() => ({
    creditScore: formData?.financial?.creditScore || "",
    monthlyExpenses: formData?.financial?.monthlyExpenses || 0,
    existingDebts: formData?.financial?.existingDebts || 0,
    bankruptcyHistory: formData?.financial?.bankruptcyHistory || "",
    savingsBalance: formData?.financial?.savingsBalance || 0,
    investments: formData?.financial?.investments || 0,
    otherAssets: formData?.financial?.otherAssets || 0,
    currentMortgage: formData?.financial?.currentMortgage || 0,
    currentLender: formData?.financial?.currentLender || "",
    currentInterestRate: formData?.financial?.currentInterestRate || 0,
    currentLoanTerm: formData?.financial?.currentLoanTerm || 0,
    remainingLoanTerm: formData?.financial?.remainingLoanTerm || 0,
    fixedRateExpiry: formData?.financial?.fixedRateExpiry || "",
    exitFees: formData?.financial?.exitFees || 0,
  }))

  // Update form state when context data changes
  useEffect(() => {
    if (formData?.financial) {
      setFormState({
        creditScore: formData.financial.creditScore || "",
        monthlyExpenses: formData.financial.monthlyExpenses || 0,
        existingDebts: formData.financial.existingDebts || 0,
        bankruptcyHistory: formData.financial.bankruptcyHistory || "",
        savingsBalance: formData.financial.savingsBalance || 0,
        investments: formData.financial.investments || 0,
        otherAssets: formData.financial.otherAssets || 0,
        currentMortgage: formData.financial.currentMortgage || 0,
        currentLender: formData.financial.currentLender || "",
        currentInterestRate: formData.financial.currentInterestRate || 0,
        currentLoanTerm: formData.financial.currentLoanTerm || 0,
        remainingLoanTerm: formData.financial.remainingLoanTerm || 0,
        fixedRateExpiry: formData.financial.fixedRateExpiry || "",
        exitFees: formData.financial.exitFees || 0,
      })
    }
  }, [formData])

  // Update the handleInputChange function to properly handle numeric inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    // Convert numeric inputs to numbers
    if (e.target.type === "number" || name === "currentMortgage" || 
        name === "currentInterestRate" || name === "currentLoanTerm" || 
        name === "remainingLoanTerm" || name === "exitFees") {
      parsedValue = value === "" ? 0 : Number(value);
    }
    
    setFormState((prev) => ({ ...prev, [name]: parsedValue }));
  };
  
  // Also update the handleSliderChange function to ensure it updates the state correctly
  const handleSliderChange = (name: string) => (value: number[]) => {
    setFormState((prev) => ({ ...prev, [name]: value[0] }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    const updatedState = { ...formState, [name]: value };
    setFormState(updatedState);
  }


  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(value)
  }


  const handleSubmit = async () => {


    try {

      // Save to server before navigating
      const result:any = await saveToServer({financial:formState})
      if (result.success) {
        toast({
          title: "Success",
          description: "Loan requirements information saved successfully.",
          variant: "default",
        })
        router.push(`/loan-info/loan-requirements`)
      } else {
        toast({
          title: "Error", 
          description: result.errorMessage || "Failed to save Loan requirements information. Please try again.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Failed to save employment information:", err)
      // Display error to user if needed
    } finally {
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="p-6 space-y-6">
            <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Profile</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 text-blue-500 mr-2" />
                      <Label htmlFor="creditScore" className="font-medium text-gray-700">
                        Credit Score
                      </Label>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Your credit score affects your interest rate and loan eligibility.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select onValueChange={handleSelectChange("creditScore")} value={formState.creditScore}>
                    <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue placeholder="Select credit score range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent (800+)</SelectItem>
                      <SelectItem value="veryGood">Very Good (740-799)</SelectItem>
                      <SelectItem value="good">Good (670-739)</SelectItem>
                      <SelectItem value="fair">Fair (580-669)</SelectItem>
                      <SelectItem value="poor">Poor (300-579)</SelectItem>
                      <SelectItem value="unknown">I don't know</SelectItem>
                    </SelectContent>
                  </Select>
                  {formState.creditScore === "unknown" && (
                    <p className="text-xs text-blue-600 mt-1">
                      That's okay! We can help you check your credit score for free.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-blue-500 mr-2" />
                      <Label htmlFor="monthlyExpenses" className="font-medium text-gray-700">
                        Monthly Household Expenses
                      </Label>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(formState.monthlyExpenses)}
                    </span>
                  </div>
                  <Slider
                    id="monthlyExpenses"
                    min={500}
                    max={10000}
                    step={100}
                    value={[formState.monthlyExpenses]}
                    onValueChange={handleSliderChange("monthlyExpenses")}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>$500</span>
                    <span>$2,500</span>
                    <span>$5,000</span>
                    <span>$7,500</span>
                    <span>$10,000+</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Include rent/mortgage, utilities, groceries, transportation, etc.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 text-blue-500 mr-2" />
                      <Label htmlFor="existingDebts" className="font-medium text-gray-700">
                        Total Existing Debts
                      </Label>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(formState.existingDebts)}</span>
                  </div>
                  <Slider
                    id="existingDebts"
                    min={0}
                    max={100000}
                    step={1000}
                    value={[formState.existingDebts]}
                    onValueChange={handleSliderChange("existingDebts")}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>$0</span>
                    <span>$25k</span>
                    <span>$50k</span>
                    <span>$75k</span>
                    <span>$100k+</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Include credit cards, personal loans, car loans, etc. (excluding current mortgage)
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-blue-500 mr-2" />
                      <Label htmlFor="bankruptcyHistory" className="font-medium text-gray-700">
                        Bankruptcy History
                      </Label>
                    </div>
                  </div>
                  <Select onValueChange={handleSelectChange("bankruptcyHistory")} value={formState.bankruptcyHistory}>
                    <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue placeholder="Select bankruptcy history" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never filed for bankruptcy</SelectItem>
                      <SelectItem value="moreThan7Years">Filed more than 7 years ago</SelectItem>
                      <SelectItem value="lessThan7Years">Filed less than 7 years ago</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="pt-6 border-t border-gray-200"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Assets</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Landmark className="h-4 w-4 text-blue-500 mr-2" />
                      <Label htmlFor="savingsBalance" className="font-medium text-gray-700">
                        Savings Balance
                      </Label>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(formState.savingsBalance)}
                    </span>
                  </div>
                  <Slider
                    id="savingsBalance"
                    min={0}
                    max={200000}
                    step={1000}
                    value={[formState.savingsBalance]}
                    onValueChange={handleSliderChange("savingsBalance")}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>$0</span>
                    <span>$50k</span>
                    <span>$100k</span>
                    <span>$150k</span>
                    <span>$200k+</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-blue-500 mr-2" />
                      <Label htmlFor="investments" className="font-medium text-gray-700">
                        Investments (AUD)
                      </Label>
                    </div>
                    <Input
                      id="investments"
                      name="investments"
                      type="number"
                      value={formState.investments}
                      onChange={handleInputChange}
                      min={0}
                      className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500">Stocks, bonds, mutual funds, etc.</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-blue-500 mr-2" />
                      <Label htmlFor="otherAssets" className="font-medium text-gray-700">
                        Other Assets (AUD)
                      </Label>
                    </div>
                    <Input
                      id="otherAssets"
                      name="otherAssets"
                      type="number"
                      value={formState.otherAssets}
                      onChange={handleInputChange}
                      min={0}
                      className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500">Vehicles, collectibles, etc.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="pt-6 border-t border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Current Mortgage Details</h3>
                <span className="text-sm text-gray-500">(if refinancing)</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Landmark className="h-4 w-4 text-blue-500 mr-2" />
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
                    max={1000000}
                    step={10000}
                    value={[formState.currentMortgage]}
                    onValueChange={handleSliderChange("currentMortgage")}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>$0</span>
                    <span>$250k</span>
                    <span>$500k</span>
                    <span>$750k</span>
                    <span>$1M+</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Landmark className="h-4 w-4 text-blue-500 mr-2" />
                      <Label htmlFor="currentLender" className="font-medium text-gray-700">
                        Current Lender
                      </Label>
                    </div>
                    <Input
                      id="currentLender"
                      name="currentLender"
                      value={formState.currentLender}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-blue-500 mr-2" />
                      <Label htmlFor="currentInterestRate" className="font-medium text-gray-700">
                        Current Interest Rate (%)
                      </Label>
                    </div>
                    <Input
                      id="currentInterestRate"
                      name="currentInterestRate"
                      type="number"
                      value={formState.currentInterestRate}
                      onChange={handleInputChange}
                      min={0}
                      step={0.01}
                      className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="fixedRateExpiry" className="font-medium text-gray-700">
                        Fixed Rate Expiry Date (if applicable)
                      </Label>
                    </div>
                    <Input
                      id="fixedRateExpiry"
                      name="fixedRateExpiry"
                      type="date"
                      value={formState.fixedRateExpiry}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-blue-500 mr-2" />
                      <Label htmlFor="exitFees" className="font-medium text-gray-700">
                        Estimated Exit Fees (AUD)
                      </Label>
                    </div>
                    <Input
                      id="exitFees"
                      name="exitFees"
                      type="number"
                      value={formState.exitFees}
                      onChange={handleInputChange}
                      min={0}
                      className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      <motion.div
        className="bg-yellow-50 p-4 rounded-lg border border-yellow-100"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <span className="font-medium">Note:</span> All financial information is kept secure and is used only to
              determine your loan eligibility and options.
            </p>
          </div>
        </div>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => router.push(`/loan-info/employment`)}
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center"
          disabled={isLoading}
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
    </motion.div>
  )
}
