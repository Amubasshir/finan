"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, X, Info, DollarSign, Percent } from "lucide-react"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface LoanOption {
  id: string
  bank: string
  interestRate: number
  comparisonRate: number
  monthlyRepayment: number
  totalRepayment: number
  loanType: string
  loanTerm: number
  maxLTV: number
  features: {
    offsetAccount: boolean
    redrawFacility: boolean
    extraRepayments: boolean
    fixedInterestRatePeriod: boolean
    splitLoan: boolean
  }
  fees: {
    establishmentFee: number
    ongoingFees: number
  }
  expectedSavings: number
  expectedCashback: number
}

const loanOptions: LoanOption[] = [
  {
    id: "8",
    bank: "Coastal Lenders",
    interestRate: 3.33,
    comparisonRate: 3.36,
    monthlyRepayment: 1469.58,
    totalRepayment: 529050,
    loanType: "Variable",
    loanTerm: 30,
    maxLTV: 80,
    features: {
      offsetAccount: true,
      redrawFacility: true,
      extraRepayments: true,
      fixedInterestRatePeriod: false,
      splitLoan: false,
    },
    fees: {
      establishmentFee: 290,
      ongoingFees: 9,
    },
    expectedSavings: 13000,
    expectedCashback: 5200,
  },
]

export default function LoanDetailsPage() {
  const router = useRouter()
  const { id } = useParams()
  const [loan, setLoan] = useState<LoanOption | null>(null)

  useEffect(() => {
    const selectedLoan = loanOptions.find((loan) => loan.id === id)
    setLoan(selectedLoan || null)
  }, [id])

  if (!loan) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Comparison
      </Button>
      <h1 className="text-3xl font-bold mb-6">{loan.bank} Loan Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              Loan Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Interest Rate</TableCell>
                  <TableCell>{loan.interestRate}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Comparison Rate</TableCell>
                  <TableCell>{loan.comparisonRate}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Monthly Repayment</TableCell>
                  <TableCell>${loan.monthlyRepayment.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total Repayment</TableCell>
                  <TableCell>${loan.totalRepayment.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Loan Type</TableCell>
                  <TableCell>{loan.loanType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Loan Term</TableCell>
                  <TableCell>{loan.loanTerm} years</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Maximum LTV</TableCell>
                  <TableCell>{loan.maxLTV}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Percent className="mr-2 h-5 w-5" />
              Fees and Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Establishment Fee</TableCell>
                  <TableCell>${loan.fees.establishmentFee}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Ongoing Fees</TableCell>
                  <TableCell>${loan.fees.ongoingFees}/month</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Expected Savings</TableCell>
                  <TableCell className="text-green-600 font-semibold">${loan.expectedSavings.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Expected Cashback</TableCell>
                  <TableCell className="text-green-600 font-semibold">${loan.expectedCashback.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Check className="mr-2 h-5 w-5" />
            Loan Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              {Object.entries(loan.features).map(([feature, value]) => (
                <TableRow key={feature}>
                  <TableCell className="font-medium">
                    {feature.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  </TableCell>
                  <TableCell>
                    {value ? <Check className="text-green-500 h-5 w-5" /> : <X className="text-red-500 h-5 w-5" />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Alert>
        <AlertTitle className="flex items-center">
          <Info className="mr-2 h-5 w-5" />
          Important Information
        </AlertTitle>
        <AlertDescription>
          <p>Please note the following terms and conditions:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>The interest rate is variable and subject to change.</li>
            <li>Comparison rate is based on a loan of $150,000 over 25 years.</li>
            <li>This loan is subject to the bank's lending criteria.</li>
            <li>Fees and charges may apply, including establishment fees and ongoing fees.</li>
          </ul>
        </AlertDescription>
      </Alert>
      <div className="flex justify-center">
        <Button size="lg" className="mt-4">
          Apply for This Loan
        </Button>
      </div>
    </div>
  )
}
