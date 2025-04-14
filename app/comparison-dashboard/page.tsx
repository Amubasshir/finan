"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { AIChatAssistant } from "../components/AIChatAssistant"
import { AIRecommendedLoanStructures } from "../components/AIRecommendedLoanStructures"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

export default function ComparisonDashboard() {
  const [loanOptions, setLoanOptions] = useState<LoanOption[]>([])

  useEffect(() => {
    // In a real application, you would fetch personalized loan options from your backend
    // For this example, we'll use mock data
    const mockLoanOptions: LoanOption[] = [
      {
        id: "1",
        bank: "Refii Bank",
        interestRate: 3.29,
        comparisonRate: 3.32,
        monthlyRepayment: 1965.23,
        totalRepayment: 707482.8,
        loanType: "Variable",
        features: ["Offset account", "Redraw facility", "Extra repayments"],
      },
      {
        id: "2",
        bank: "Aussie Lender",
        interestRate: 3.45,
        comparisonRate: 3.47,
        monthlyRepayment: 2001.12,
        totalRepayment: 720403.2,
        loanType: "Fixed",
        features: ["Fixed rate period", "Extra repayments (up to $10,000/year)"],
      },
      {
        id: "3",
        bank: "Down Under Mortgages",
        interestRate: 3.39,
        comparisonRate: 3.41,
        monthlyRepayment: 1985.67,
        totalRepayment: 714841.2,
        loanType: "Split",
        features: ["Part fixed, part variable", "Offset account on variable portion"],
      },
    ]

    setLoanOptions(mockLoanOptions)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Personalized Loan Comparison Dashboard</h1>

      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comparison">Loan Comparison</TabsTrigger>
          <TabsTrigger value="ai-recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="chat-assistant">Chat Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Loan Options</CardTitle>
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
                    <TableHead>Features</TableHead>
                    <TableHead></TableHead>
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
                      <TableCell>
                        <ul className="list-disc list-inside">
                          {loan.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>
                        <Button asChild size="sm">
                          <Link href={`/apply/${loan.id}`}>
                            Apply <ArrowRight className="ml-2 h-3 w-3" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-recommendations">
          <AIRecommendedLoanStructures />
        </TabsContent>

        <TabsContent value="chat-assistant">
          <AIChatAssistant />
        </TabsContent>
      </Tabs>

      <div className="text-center">
        <p className="text-lg mb-4">
          These loan options are tailored based on the information you provided. For a more detailed comparison or to
          explore more options, please use our AI chat assistant or contact our loan specialists.
        </p>
        <div className="space-x-4">
          <Button asChild variant="outline">
            <Link href="/contact">Contact a Loan Specialist</Link>
          </Button>
          <Button asChild>
            <Link href="/refinance-process">Start Refinance Process</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
