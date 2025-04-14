"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function CashbackCalculator() {
  const [loanAmount, setLoanAmount] = useState("")
  const [cashback, setCashback] = useState<number | null>(null)

  const calculateCashback = () => {
    const amount = Number.parseFloat(loanAmount)
    if (isNaN(amount)) {
      setCashback(null)
      return
    }

    const minCashback = amount * 0.005
    const maxCashback = amount * 0.02
    setCashback(maxCashback)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Cashback Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="loanAmount">Loan Amount (AUD)</Label>
            <Input
              id="loanAmount"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="Enter your loan amount"
            />
          </div>
          <Button onClick={calculateCashback} className="w-full">
            Calculate Potential Cashback
          </Button>
          {cashback !== null && (
            <div className="text-center">
              <p className="text-lg font-semibold">Potential Cashback: Up to ${cashback.toFixed(2)}</p>
              <p className="text-sm text-grey-600">
                By self-refinancing, you could earn between ${(Number.parseFloat(loanAmount) * 0.005).toFixed(2)} and $
                {cashback.toFixed(2)} in cashback.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
