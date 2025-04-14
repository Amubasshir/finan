"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface LoanAdjusterProps {
  initialAmount: number
  initialTerm: number
  onAdjust: (amount: number, term: number) => void
}

export function LoanAdjuster({ initialAmount, initialTerm, onAdjust }: LoanAdjusterProps) {
  const [amount, setAmount] = useState(initialAmount)
  const [term, setTerm] = useState(initialTerm)

  const handleAmountChange = (value: number[]) => {
    setAmount(value[0])
  }

  const handleTermChange = (value: number[]) => {
    setTerm(value[0])
  }

  const handleApply = () => {
    onAdjust(amount, term)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adjust Loan Parameters</CardTitle>
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
        <Button onClick={handleApply}>Apply Changes</Button>
      </CardContent>
    </Card>
  )
}
