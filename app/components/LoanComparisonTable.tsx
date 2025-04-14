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
}

interface LoanComparisonTableProps {
  selectedLoans: string[]
  onLoanSelect: (loanId: string) => void
  loanAmount: number
  loanTerm: number
}

export function LoanComparisonTable({ selectedLoans, onLoanSelect, loanAmount, loanTerm }: LoanComparisonTableProps) {
  const [loanOptions, setLoanOptions] = useState<LoanOption[]>([])

  useEffect(() => {
    // In a real application, you would fetch this data from your API
    const mockLoanOptions: LoanOption[] = [
      {
        id: "1",
        bank: "Refii Bank",
        interestRate: 3.29,
        comparisonRate: 3.32,
        monthlyRepayment: 0,
        totalRepayment: 0,
        loanType: "Variable",
        features: ["Offset account", "Redraw facility", "Extra repayments"],
      },
      {
        id: "2",
        bank: "Aussie Lender",
        interestRate: 3.45,
        comparisonRate: 3.47,
        monthlyRepayment: 0,
        totalRepayment: 0,
        loanType: "Fixed",
        features: ["Fixed rate period", "Extra repayments (up to $10,000/year)"],
      },
      {
        id: "3",
        bank: "Down Under Mortgages",
        interestRate: 3.39,
        comparisonRate: 3.41,
        monthlyRepayment: 0,
        totalRepayment: 0,
        loanType: "Split",
        features: ["Part fixed, part variable", "Offset account on variable portion"],
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
          <TableHead>Features</TableHead>
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
