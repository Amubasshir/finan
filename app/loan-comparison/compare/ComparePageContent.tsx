"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, DollarSign, BanknoteIcon as Bank, Check, X } from "lucide-react"
import Link from "next/link"
import { PiggyBank } from "lucide-react" // Import PiggyBank icon

interface LoanOption {
  id: string
  bank: string
  interestRate: number
  comparisonRate: number
  monthlyRepayment: number
  totalRepayment: number
  savings: number
  loanType: string
  loanTerm: number
  maxLTV: number
  features: {
    cashbackIncentive: boolean
    offsetAccount: boolean
    redrawFacility: boolean
    fixedInterestRatePeriod: boolean
    splitLoan: boolean
    extraRepayments: boolean
  }
}

const baseLoanOptions: LoanOption[] = [
  {
    id: "1",
    bank: "Refii Bank",
    interestRate: 3.29,
    comparisonRate: 3.32,
    monthlyRepayment: 1965,
    totalRepayment: 707400,
    savings: 15000,
    loanType: "Variable",
    loanTerm: 30,
    maxLTV: 80,
    features: {
      cashbackIncentive: true,
      offsetAccount: true,
      redrawFacility: true,
      fixedInterestRatePeriod: false,
      splitLoan: false,
      extraRepayments: true,
    },
  },
  {
    id: "2",
    bank: "Aussie Lender",
    interestRate: 3.45,
    comparisonRate: 3.47,
    monthlyRepayment: 2010,
    totalRepayment: 723600,
    savings: 12500,
    loanType: "Fixed",
    loanTerm: 30,
    maxLTV: 85,
    features: {
      cashbackIncentive: false,
      offsetAccount: true,
      redrawFacility: true,
      fixedInterestRatePeriod: true,
      splitLoan: false,
      extraRepayments: true,
    },
  },
  {
    id: "3",
    bank: "Down Under Mortgages",
    interestRate: 3.39,
    comparisonRate: 3.41,
    monthlyRepayment: 1990,
    totalRepayment: 716400,
    savings: 13750,
    loanType: "Split",
    loanTerm: 25,
    maxLTV: 90,
    features: {
      cashbackIncentive: true,
      offsetAccount: false,
      redrawFacility: true,
      fixedInterestRatePeriod: true,
      splitLoan: true,
      extraRepayments: false,
    },
  },
  {
    id: "7",
    bank: "Outback Mortgages",
    interestRate: 3.42,
    comparisonRate: 3.45,
    monthlyRepayment: 1481,
    totalRepayment: 533250,
    savings: 11500,
    loanType: "Split",
    loanTerm: 30,
    maxLTV: 85,
    features: {
      cashbackIncentive: true,
      offsetAccount: true,
      redrawFacility: true,
      fixedInterestRatePeriod: true,
      splitLoan: true,
      extraRepayments: true,
    },
  },
  {
    id: "8",
    bank: "Coastal Lenders",
    interestRate: 3.33,
    comparisonRate: 3.36,
    monthlyRepayment: 1470,
    totalRepayment: 529050,
    savings: 13000,
    loanType: "Variable",
    loanTerm: 30,
    maxLTV: 80,
    features: {
      cashbackIncentive: true,
      offsetAccount: true,
      redrawFacility: true,
      fixedInterestRatePeriod: false,
      splitLoan: false,
      extraRepayments: true,
    },
  },
]

export function ComparePageContent() {
  const searchParams = useSearchParams()
  const selectedLoanIds = useMemo(() => searchParams.getAll("id"), [searchParams])
  const router = useRouter()

  const [loanAmount, setLoanAmount] = useState(300000)
  const [loanTerm, setLoanTerm] = useState(30)

  const selectedLoans = useMemo(
    () => baseLoanOptions.filter((loan) => selectedLoanIds.includes(loan.id.toString())),
    [selectedLoanIds],
  )

  const handleRowClick = (loanId: string) => {
    router.push(`/loan-details/${loanId}`)
  }

  const calculateLoanDetails = (loan: LoanOption) => {
    const monthlyInterestRate = loan.interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12
    const monthlyRepayment =
      (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
    const totalRepayment = monthlyRepayment * numberOfPayments
    const savings = totalRepayment - loanAmount - totalRepayment * 0.05 // Assuming 5% savings

    return {
      ...loan,
      monthlyRepayment,
      totalRepayment,
      savings,
    }
  }

  const updatedLoans = useMemo(
    () => selectedLoans.map((loan) => calculateLoanDetails(loan)),
    [selectedLoans, loanAmount, loanTerm], // Added loanAmount and loanTerm as dependencies
  )

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Compare Selected Loans</h1>
        <Link href="/loan-comparison">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Loans
          </Button>
        </Link>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-6 w-6 text-blue-500" />
            Loan Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="loanAmount">Loan Amount: ${loanAmount.toLocaleString()}</Label>
            <div className="flex items-center space-x-4">
              <Slider
                id="loanAmount"
                min={100000}
                max={1000000}
                step={10000}
                value={[loanAmount]}
                onValueChange={(value) => setLoanAmount(value[0])}
                className="flex-grow"
              />
              <Input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-24"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="loanTerm">Loan Term: {loanTerm} years</Label>
            <div className="flex items-center space-x-4">
              <Slider
                id="loanTerm"
                min={5}
                max={30}
                step={1}
                value={[loanTerm]}
                onValueChange={(value) => setLoanTerm(value[0])}
                className="flex-grow"
              />
              <Input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-24"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bank className="mr-2 h-6 w-6 text-green-500" />
            Loan Comparison
          </CardTitle>
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
                <TableHead>Savings</TableHead>
                <TableHead>Loan Type</TableHead>
                <TableHead>Loan Term</TableHead>
                <TableHead>Max LTV</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {updatedLoans.map((loan) => (
                <TableRow
                  key={loan.id}
                  className="cursor-pointer hover:bg-blue-50 transition-colors duration-200"
                  onClick={() => handleRowClick(loan.id)}
                >
                  <TableCell className="font-medium">{loan.bank}</TableCell>
                  <TableCell className="text-green-600">{loan.interestRate}%</TableCell>
                  <TableCell className="text-purple-600">{loan.comparisonRate}%</TableCell>
                  <TableCell>${loan.monthlyRepayment.toFixed(2)}</TableCell>
                  <TableCell>${loan.totalRepayment.toFixed(2)}</TableCell>
                  <TableCell className="text-green-600 font-semibold">${loan.savings.toFixed(2)}</TableCell>
                  <TableCell>{loan.loanType}</TableCell>
                  <TableCell>{loan.loanTerm} years</TableCell>
                  <TableCell>{loan.maxLTV}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PiggyBank className="mr-2 h-6 w-6 text-purple-500" />
            Features Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bank</TableHead>
                <TableHead>Cashback Incentive</TableHead>
                <TableHead>Offset Account</TableHead>
                <TableHead>Redraw Facility</TableHead>
                <TableHead>Fixed Interest Rate Period</TableHead>
                <TableHead>Split Loan</TableHead>
                <TableHead>Extra Repayments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {updatedLoans.map((loan) => (
                <TableRow
                  key={loan.id}
                  className="cursor-pointer hover:bg-purple-50 transition-colors duration-200"
                  onClick={() => handleRowClick(loan.id)}
                >
                  <TableCell className="font-medium">{loan.bank}</TableCell>
                  {Object.entries(loan.features).map(([feature, value]) => (
                    <TableCell key={feature}>
                      {value ? <Check className="text-green-500 mx-auto" /> : <X className="text-red-500 mx-auto" />}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <p className="text-center text-gray-600 mt-8">
        Click on any loan option to view more detailed information, including terms and conditions.
      </p>
    </div>
  )
}
