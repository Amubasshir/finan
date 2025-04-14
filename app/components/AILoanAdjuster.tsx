"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface AILoanAdjusterProps {
  initialAmount: number
  initialTerm: number
  onAdjust: (amount: number, term: number) => void
}

export function AILoanAdjuster({ initialAmount, initialTerm, onAdjust }: AILoanAdjusterProps) {
  const [amount, setAmount] = useState(initialAmount)
  const [term, setTerm] = useState(initialTerm)
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)

  const handleAmountChange = (value: number[]) => {
    setAmount(value[0])
    generateAISuggestion(value[0], term)
  }

  const handleTermChange = (value: number[]) => {
    setTerm(value[0])
    generateAISuggestion(amount, value[0])
  }

  const handleApply = () => {
    onAdjust(amount, term)
  }

  const generateAISuggestion = (newAmount: number, newTerm: number) => {
    // In a real application, this would be an API call to an AI service
    const suggestion = `Based on your profile and current market conditions, our AI suggests a loan amount of $${(newAmount * 0.95).toFixed(2)} over ${newTerm - 2} years for optimal financial health.`
    setAiSuggestion(suggestion)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Loan Parameter Adjustment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="loanAmount">Loan Amount: ${amount.toLocaleString()}</Label>
          <Slider
            id="loanAmount"
            min={100000}
            max={2000000}
            step={10000}
            value={[amount]}
            onValueChange={handleAmountChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="loanTerm">Loan Term: {term} years</Label>
          <Slider id="loanTerm" min={1} max={30} step={1} value={[term]} onValueChange={handleTermChange} />
        </div>
        {aiSuggestion && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
            <p className="font-bold">AI Suggestion</p>
            <p>{aiSuggestion}</p>
          </div>
        )}
        <Button onClick={handleApply}>Apply AI-Optimized Changes</Button>
      </CardContent>
    </Card>
  )
}
