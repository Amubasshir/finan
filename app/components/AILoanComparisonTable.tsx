"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"

interface LoanOption {
  id: string
  bank: string
  interestRate: number
  comparisonRate: number
  monthlyRepayment: number
  totalRepayment: number
  loanType: string
  features: string[]
  aiScore: number
}

interface AILoanComparisonTableProps {
  selectedLoans: string[]
  onLoanSelect: (loanId: string) => void
  loanAmount: number
  loanTerm: number
}

export function AILoanComparisonTable({
  selectedLoans,
  onLoanSelect,
  loanAmount,
  loanTerm,
}: AILoanComparisonTableProps) {
  const [loanOptions, setLoanOptions] = useState<LoanOption[]>([])

  useEffect(() => {
    // In a real application, you would fetch this data from your API
    const mockLoanOptions: LoanOption[] = [
      {
        id: "1",
        bank: "Refii AI Bank",
        interestRate: 3.25,
        comparisonRate: 3.28,
        monthlyRepayment: 0,
        totalRepayment: 0,
        loanType: "AI-Optimized Variable",
        features: ["AI-powered rate adjustments", "Predictive offset account", "Smart redraw facility"],
        aiScore: 95,
      },
      {
        id: "2",
        bank: "Future Lender",
        interestRate: 3.35,
        comparisonRate: 3.37,
        monthlyRepayment: 0,
        totalRepayment: 0,
        loanType: "AI-Fixed",
        features: ["AI-predicted fixed rate periods", "Machine learning repayment optimization"],
        aiScore: 92,
      },
      {
        id: "3",
        bank: "Quantum Mortgages",
        interestRate: 3.3,
        comparisonRate: 3.32,
        monthlyRepayment: 0,
        totalRepayment: 0,
        loanType: "AI-Split",
        features: ["Quantum computing optimized split", "AI-driven financial advice"],
        aiScore: 88,
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">Select</TableHead>
          <TableHead>Bank</TableHead>
          <TableHead>Interest Rate</TableHead>
          <TableHead>Comparison Rate</TableHead>
          <TableHead>Monthly Repayment</TableHead>
          <TableHead>Total Repayment</TableHead>
          <TableHead>Loan Type</TableHead>
          <TableHead>AI Features</TableHead>
          <TableHead>AI Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loanOptions.map((loan) => (
          <TableRow key={loan.id}>
            <TableCell>
              <Checkbox checked={selectedLoans.includes(loan.id)} onCheckedChange={() => onLoanSelect(loan.id)} />
            </TableCell>
            <TableCell className="font-medium">{loan.bank}</TableCell>
            <TableCell>{loan.interestRate}%</TableCell>
            <TableCell>{loan.comparisonRate}%</TableCell>
            <TableCell>${loan.monthlyRepayment.toFixed(2)}</TableCell>
            <TableCell>${loan.totalRepayment.toFixed(2)}</TableCell>
            <TableCell>{loan.loanType}</TableCell>
            <TableCell>
              <ul className="list-disc list-inside">
                {loan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </TableCell>
            <TableCell>{loan.aiScore}/100</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
