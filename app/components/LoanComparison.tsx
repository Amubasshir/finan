"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowRight, Check, X } from "lucide-react"

interface LoanFeature {
  name: string
  description: string
}

interface LoanOption {
  id: string
  bank: string
  interestRate: number
  comparisonRate: number
  monthlyRepayment: number
  totalRepayment: number
  loanType: string
  features: {
    [key: string]: boolean
  }
  estimatedSavings: number
}

const loanFeatures: LoanFeature[] = [
  { name: "offsetAccount", description: "Offset Account" },
  { name: "redrawFacility", description: "Redraw Facility" },
  { name: "extraRepayments", description: "Extra Repayments" },
  { name: "fixedRatePeriod", description: "Fixed Rate Period" },
  { name: "interestOnlyOption", description: "Interest Only Option" },
  { name: "splitLoanOption", description: "Split Loan Option" },
]

const baseLoanOptions: Omit<LoanOption, "monthlyRepayment" | "totalRepayment" | "estimatedSavings">[] = [
  {
    id: "1",
    bank: "Refii Bank",
    interestRate: 3.29,
    comparisonRate: 3.32,
    loanType: "Variable",
    features: {
      offsetAccount: true,
      redrawFacility: true,
      extraRepayments: true,
      fixedRatePeriod: false,
      interestOnlyOption: true,
      splitLoanOption: false,
    },
  },
  {
    id: "2",
    bank: "Aussie Lender",
    interestRate: 3.45,
    comparisonRate: 3.47,
    loanType: "Fixed",
    features: {
      offsetAccount: false,
      redrawFacility: true,
      extraRepayments: true,
      fixedRatePeriod: true,
      interestOnlyOption: false,
      splitLoanOption: false,
    },
  },
  {
    id: "3",
    bank: "Down Under Mortgages",
    interestRate: 3.39,
    comparisonRate: 3.41,
    loanType: "Split",
    features: {
      offsetAccount: true,
      redrawFacility: true,
      extraRepayments: true,
      fixedRatePeriod: true,
      interestOnlyOption: true,
      splitLoanOption: true,
    },
  },
  {
    id: "4",
    bank: "Kangaroo Finance",
    interestRate: 3.35,
    comparisonRate: 3.38,
    loanType: "Variable",
    features: {
      offsetAccount: true,
      redrawFacility: true,
      extraRepayments: true,
      fixedRatePeriod: false,
      interestOnlyOption: false,
      splitLoanOption: false,
    },
  },
  {
    id: "5",
    bank: "Koala Credit Union",
    interestRate: 3.42,
    comparisonRate: 3.45,
    loanType: "Fixed",
    features: {
      offsetAccount: false,
      redrawFacility: false,
      extraRepayments: true,
      fixedRatePeriod: true,
      interestOnlyOption: true,
      splitLoanOption: false,
    },
  },
]

interface LoanComparisonProps {
  loanAmount: number
  loanTerm: number
}

export function LoanComparison({ loanAmount, loanTerm }: LoanComparisonProps) {
  const [loanOptions, setLoanOptions] = useState<LoanOption[]>([])

  useEffect(() => {
    const calculateLoanDetails = (
      option: Omit<LoanOption, "monthlyRepayment" | "totalRepayment" | "estimatedSavings">,
    ): LoanOption => {
      const monthlyInterestRate = option.interestRate / 100 / 12
      const numberOfPayments = loanTerm * 12
      const monthlyRepayment =
        (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
      const totalRepayment = monthlyRepayment * numberOfPayments
      const estimatedSavings = totalRepayment - loanAmount - totalRepayment * 0.05 // Assuming 5% savings

      return {
        ...option,
        monthlyRepayment,
        totalRepayment,
        estimatedSavings,
      }
    }

    const updatedLoanOptions = baseLoanOptions.map(calculateLoanDetails)
    setLoanOptions(updatedLoanOptions)
  }, [loanAmount, loanTerm])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Quick Comparison Results</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bank</TableHead>
              <TableHead>Interest Rate</TableHead>
              <TableHead>Comparison Rate</TableHead>
              <TableHead>Monthly Repayment</TableHead>
              <TableHead>Total Repayment</TableHead>
              <TableHead>Loan Type</TableHead>
              <TableHead>Estimated Savings</TableHead>
              <TableHead>Features</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loanOptions.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell className="font-medium">{loan.bank}</TableCell>
                <TableCell>{loan.interestRate}%</TableCell>
                <TableCell>{loan.comparisonRate}%</TableCell>
                <TableCell>${loan.monthlyRepayment.toFixed(2)}</TableCell>
                <TableCell>${loan.totalRepayment.toFixed(2)}</TableCell>
                <TableCell>{loan.loanType}</TableCell>
                <TableCell className="text-green-600 font-semibold">${loan.estimatedSavings.toFixed(2)}</TableCell>
                <TableCell>
                  <ul className="list-none p-0">
                    {loanFeatures.map((feature) => (
                      <li key={feature.name} className="flex items-center">
                        {loan.features[feature.name] ? (
                          <Check className="text-green-500 mr-1 h-4 w-4" />
                        ) : (
                          <X className="text-red-500 mr-1 h-4 w-4" />
                        )}
                        {feature.description}
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>
                  <Button asChild size="sm">
                    <Link href="/loan-info/employment">
                      Apply <ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="text-sm text-gray-500 mt-4">
          * Comparison rate may be higher than the interest rate. Please refer to the lender&apos;s website for more
          details. Estimated savings are based on a 5% reduction in total repayments and may vary.
        </p>
      </CardContent>
    </Card>
  )
}
