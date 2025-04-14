"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ChevronDown } from "lucide-react"

interface LoanOption {
  id: string
  bank: string
  interestRate: number
  comparisonRate: number
  monthlyRepayment: number
  totalRepayment: number
  loanType: string
  features: string[]
  expectedSavings: number
  expectedCashback: number
}

interface LoanComparisonTableProps {
  loanAmount: number
  loanTerm: number
  selectedLoans: string[]
  onLoanSelect: (loanId: string) => void
}

export function LoanComparisonTable({ loanAmount, loanTerm, selectedLoans, onLoanSelect }: LoanComparisonTableProps) {
  const router = useRouter()
  const [loanOptions, setLoanOptions] = useState<LoanOption[]>([])
  const [visibleOptions, setVisibleOptions] = useState(6)

  useEffect(() => {
    // In a real application, you would fetch this data from your API
    const mockLoanOptions: LoanOption[] = [
      {
        id: "1",
        bank: "Refii Bank",
        interestRate: 5.29,
        comparisonRate: 5.32,
        monthlyRepayment: 0,
        totalRepayment: 0,
        loanType: "Variable",
        features: ["No early repayment fees", "Line of credit option", "Interest-only periods available"],
        expectedSavings: 25000,
        expectedCashback: 8000,
      },
      {
        id: "2",
        bank: "Aussie Business Lender",
        interestRate: 5.45,
        comparisonRate: 5.47,
        monthlyRepayment: 0,
        totalRepayment: 0,
        loanType: "Fixed",
        features: ["Fixed rate period", "Equipment financing options", "No annual fees"],
        expectedSavings: 22000,
        expectedCashback: 7500,
      },
      {
        id: "3",
        bank: "Down Under Business Finance",
        interestRate: 5.39,
        comparisonRate: 5.41,
        monthlyRepayment: 0,
        totalRepayment: 0,
        loanType: "Split",
        features: ["Part fixed, part variable", "Business credit card included", "Flexible repayment schedule"],
        expectedSavings: 23500,
        expectedCashback: 7800,
      },
      {
        id: "4",
        bank: "Koala Business Credit",
        interestRate: 5.35,
        comparisonRate: 5.38,
        monthlyRepayment: 0,
        totalRepayment: 0,
        loanType: "Variable",
        features: ["No application fees", "Business overdraft facility", "Online business banking tools"],
        expectedSavings: 24000,
        expectedCashback: 8200,
      },
      {
        id: "5",
        bank: "Kangaroo Business Loans",
        interestRate: 5.42,
        comparisonRate: 5.45,
        monthlyRepayment: 0,
        totalRepayment: 0,
        loanType: "Fixed",
        features: ["Rate lock guarantee", "Business mentoring included", "Tax planning assistance"],
        expectedSavings: 21500,
        expectedCashback: 7300,
      },
      {
        id: "6",
        bank: "Boomerang Business Financial",
        interestRate: 5.37,
        comparisonRate: 5.4,
        monthlyRepayment: 0,
        totalRepayment: 0,
        loanType: "Variable",
        features: ["Cash flow management tools", "Business insurance discounts", "No ongoing fees"],
        expectedSavings: 23800,
        expectedCashback: 7900,
      },
      {
        id: "7",
        bank: "Outback Savings",
        interestRate: 3.33,
        comparisonRate: 3.36,
        monthlyRepayment: 0,
        totalRepayment: 0,
        loanType: "Split",
        features: ["Customizable split ratio", "Offset account on both portions"],
        expectedSavings: 14500,
        expectedCashback: 5100,
      },
      {
        id: "8",
        bank: "Dingo Direct",
        interestRate: 3.41,
        comparisonRate: 3.44,
        monthlyRepayment: 0,
        totalRepayment: 0,
        loanType: "Variable",
        features: ["Low deposit options", "First home buyer incentives"],
        expectedSavings: 12200,
        expectedCashback: 4600,
      },
      {
        id: "9",
        bank: "Wallaby Wealth",
        interestRate: 3.36,
        comparisonRate: 3.39,
        monthlyRepayment: 0,
        totalRepayment: 0,
        loanType: "Fixed",
        features: ["Rate match promise", "Flexible fixed terms"],
        expectedSavings: 13200,
        expectedCashback: 4700,
      },
      {
        id: "10",
        bank: "Platypus Loans",
        interestRate: 3.38,
        comparisonRate: 3.41,
        monthlyRepayment: 0,
        totalRepayment: 0,
        loanType: "Variable",
        features: ["Green home discount", "Loyalty rate reductions"],
        expectedSavings: 13600,
        expectedCashback: 4850,
      },
      {
        id: "11",
        bank: "Emu Equity",
        interestRate: 3.4,
        comparisonRate: 3.43,
        monthlyRepayment: 0,
        totalRepayment: 0,
        loanType: "Split",
        features: ["Interest offset on entire loan amount", "Free redraws"],
        expectedSavings: 13000,
        expectedCashback: 4750,
      },
      {
        id: "12",
        bank: "Wombat Wealth",
        interestRate: 3.34,
        comparisonRate: 3.37,
        monthlyRepayment: 0,
        totalRepayment: 0,
        loanType: "Variable",
        features: ["No application fees", "Flexible repayment schedule"],
        expectedSavings: 14200,
        expectedCashback: 5050,
      },
    ]

    // Calculate monthly and total repayments based on current loan amount and term
    const updatedLoanOptions = mockLoanOptions.map((loan) => {
      const monthlyInterestRate = loan.interestRate / 100 / 12
      const numberOfPayments = loanTerm * 12
      const monthlyRepayment =
        (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
      const totalRepayment = monthlyRepayment * numberOfPayments

      return {
        ...loan,
        monthlyRepayment,
        totalRepayment,
      }
    })

    setLoanOptions(updatedLoanOptions)
  }, [loanAmount, loanTerm])

  const handleApplyLoan = (loanId: string) => {
    router.push(`/document-upload?loanId=${loanId}&amount=${loanAmount}&term=${loanTerm}`)
  }

  const handleLoadMore = () => {
    setVisibleOptions((prevVisible) => Math.min(prevVisible + 6, loanOptions.length))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loanOptions.slice(0, visibleOptions).map((loan) => (
          <Card key={loan.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg font-bold">{loan.bank}</span>
                <Badge variant={loan.loanType === "Variable" ? "default" : "secondary"}>{loan.loanType}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Interest Rate</span>
                  <span className="text-lg font-semibold text-green-600">{loan.interestRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Comparison Rate</span>
                  <span className="text-lg font-semibold text-blue-600">{loan.comparisonRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Monthly Repayment</span>
                  <span className="text-lg font-semibold">${loan.monthlyRepayment.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total Repayment</span>
                  <span className="text-lg font-semibold">${loan.totalRepayment.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Expected Savings</span>
                  <span className="text-lg font-semibold text-green-600">${loan.expectedSavings.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Expected Cashback</span>
                  <span className="text-lg font-semibold text-blue-600">${loan.expectedCashback.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Features:</h4>
                <ul className="list-disc list-inside text-sm">
                  {loan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`select-${loan.id}`}
                    checked={selectedLoans.includes(loan.id)}
                    onCheckedChange={() => onLoanSelect(loan.id)}
                  />
                  <label
                    htmlFor={`select-${loan.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Select for comparison
                  </label>
                </div>
                <div className="space-y-3">
                  <Button onClick={() => handleApplyLoan(loan.id)} className="w-full bg-blue-600 hover:bg-blue-700">
                    Continue to Pre-Approval
                  </Button>
                  <Button onClick={() => handleApplyLoan(loan.id)} variant="outline" className="w-full">
                    View Loan Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {visibleOptions < loanOptions.length && (
        <div className="flex justify-center mt-8">
          <Button onClick={handleLoadMore} variant="outline" className="flex items-center">
            <ChevronDown className="mr-2 h-4 w-4" />
            See More Loan Options
          </Button>
        </div>
      )}
    </div>
  )
}
