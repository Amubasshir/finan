"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BanknoteIcon as Bank,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  Home,
  Phone,
  Mail,
  Users,
  Clock,
  CheckCircle,
  Percent,
  ArrowRight,
} from "lucide-react"

export default function CurrentLoanDetails() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for the current loan
  const loanData = {
    loanNumber: "HL-2023-78945",
    lender: "Commonwealth Bank",
    accountNumber: "062-000 12345678",
    bsb: "062-000",
    accountName: "John Smith Home Loan",
    loanAmount: 450000,
    currentBalance: 448500,
    interestRate: 4.25,
    comparisonRate: 4.32,
    loanTerm: 30,
    remainingTerm: 29.9,
    loanType: "Principal and Interest",
    loanPurpose: "Refinance",
    startDate: "2023-12-01",
    nextPaymentDate: "2024-01-15",
    nextPaymentAmount: 2212.5,
    paymentFrequency: "Monthly",
    totalInterestPaid: 1500,
    totalPrincipalPaid: 1500,
    offsetAccount: true,
    offsetAccountNumber: "062-000 87654321",
    offsetBalance: 15000,
    redrawAvailable: 0,
    fixedRateExpiry: null,
    earlyRepaymentFee: "No",
    annualFee: 395,
    propertyAddress: "123 Main Street, Sydney NSW 2000",
    propertyValue: 750000,
    lvr: 60,
    contactPerson: "Sarah Johnson",
    contactRole: "Loan Manager",
    contactPhone: "0412 345 678",
    contactEmail: "sarah.j@lender.com.au",
    recentTransactions: [
      { date: "2023-12-15", description: "Monthly Repayment", amount: 2212.5, type: "payment" },
      { date: "2023-12-01", description: "Loan Disbursement", amount: 450000, type: "disbursement" },
      { date: "2023-12-01", description: "Establishment Fee", amount: 600, type: "fee" },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Loan Details</h1>
          <p className="text-gray-500">Comprehensive information about your home loan</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Loan Summary</CardTitle>
                <CardDescription>Key details about your home loan</CardDescription>
              </div>
              <Badge className="bg-green-500">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Current Balance</p>
                <p className="text-xl font-bold">${loanData.currentBalance.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Interest Rate</p>
                <p className="text-xl font-bold">{loanData.interestRate}% p.a.</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Monthly Repayment</p>
                <p className="text-xl font-bold">${loanData.nextPaymentAmount.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Next Payment</p>
                <p className="text-xl font-bold">{loanData.nextPaymentDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Bank className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Lender</p>
                    <p className="font-semibold">{loanData.lender}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Loan Number</p>
                    <p className="font-semibold">{loanData.loanNumber}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CreditCard className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Account Number</p>
                    <p className="font-semibold">{loanData.accountNumber}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Home className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Property Address</p>
                    <p className="font-semibold">{loanData.propertyAddress}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Loan Start Date</p>
                    <p className="font-semibold">{loanData.startDate}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Loan Term</p>
                    <p className="font-semibold">
                      {loanData.loanTerm} years (Remaining: {loanData.remainingTerm} years)
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Percent className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Comparison Rate</p>
                    <p className="font-semibold">{loanData.comparisonRate}% p.a.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <DollarSign className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Loan Type</p>
                    <p className="font-semibold">{loanData.loanType}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline">
              Make Extra Repayment
            </Button>
            <Button className="w-full" variant="outline">
              Change Repayment Frequency
            </Button>
            <Button className="w-full" variant="outline">
              Request Statement
            </Button>
            <Button className="w-full">Contact Loan Manager</Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="repayments">Repayments</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loan Overview</CardTitle>
              <CardDescription>Summary of your loan performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Loan Progress</h3>
                  <div className="bg-gray-100 h-4 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: `${(loanData.totalPrincipalPaid / loanData.loanAmount) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Principal paid: ${loanData.totalPrincipalPaid.toLocaleString()}</span>
                    <span>Remaining: ${(loanData.loanAmount - loanData.totalPrincipalPaid).toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Interest Paid</h3>
                  <div className="bg-gray-100 h-4 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: "0.5%" }}></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Interest paid: ${loanData.totalInterestPaid.toLocaleString()}</span>
                    <span>Estimated total: ${(loanData.loanAmount * 0.8).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-4">Property Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Property Value</p>
                    <p className="font-semibold">${loanData.propertyValue.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Loan-to-Value Ratio</p>
                    <p className="font-semibold">{loanData.lvr}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Equity</p>
                    <p className="font-semibold">
                      ${(loanData.propertyValue - loanData.currentBalance).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-4">Loan Costs</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Annual Fee</p>
                    <p className="font-semibold">${loanData.annualFee.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Early Repayment Fee</p>
                    <p className="font-semibold">{loanData.earlyRepaymentFee}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Monthly Service Fee</p>
                    <p className="font-semibold">$0</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="repayments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Repayment Information</CardTitle>
              <CardDescription>Details about your loan repayments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center space-x-3 mb-3">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Next Payment Details</p>
                    <p className="text-sm text-gray-500">Your next scheduled payment</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="text-xl font-bold">${loanData.nextPaymentAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="text-xl font-bold">{loanData.nextPaymentDate}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Repayment Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Payment Frequency</p>
                    <p className="font-semibold">{loanData.paymentFrequency}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Regular Payment Amount</p>
                    <p className="font-semibold">${loanData.nextPaymentAmount.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-semibold">Direct Debit</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold">Repayment Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Principal Component</p>
                    <p className="font-semibold">${Math.round(loanData.nextPaymentAmount * 0.6).toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Interest Component</p>
                    <p className="font-semibold">${Math.round(loanData.nextPaymentAmount * 0.4).toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Fees</p>
                    <p className="font-semibold">$0</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold">Repayment Options</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">Make Extra Repayment</p>
                      <p className="text-sm text-gray-500">Pay more to reduce your loan faster</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Make Payment
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">Change Repayment Frequency</p>
                      <p className="text-sm text-gray-500">Adjust how often you make repayments</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">Set Up Automatic Extra Payments</p>
                      <p className="text-sm text-gray-500">Regularly pay extra to save interest</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Set Up
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loan Features</CardTitle>
              <CardDescription>Features and benefits of your home loan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loanData.offsetAccount && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Offset Account</h3>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="flex items-center space-x-3 mb-3">
                      <CreditCard className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Offset Account Details</p>
                        <p className="text-sm text-gray-500">Your linked offset account</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Offset Account Number</p>
                        <p className="font-semibold">{loanData.offsetAccountNumber}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Current Offset Balance</p>
                        <p className="font-semibold">${loanData.offsetBalance.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Interest Saved</p>
                        <p className="font-semibold">
                          Approximately $
                          {Math.round(loanData.offsetBalance * (loanData.interestRate / 100)).toLocaleString()} per year
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Effective Interest Rate</p>
                        <p className="font-semibold">
                          {(
                            loanData.interestRate -
                            (loanData.offsetBalance / loanData.currentBalance) * loanData.interestRate
                          ).toFixed(2)}
                          % p.a.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-semibold">Redraw Facility</h3>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <ArrowRight className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Redraw Details</p>
                      <p className="text-sm text-gray-500">Access to additional repayments</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Available for Redraw</p>
                      <p className="font-semibold">${loanData.redrawAvailable.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Redraw Fee</p>
                      <p className="font-semibold">$0 (Online)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold">Additional Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Extra Repayments</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Online Banking Access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Mobile App Access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>No Monthly Service Fee</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Split Loan Capability</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Loan Portability</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Recent activity on your loan account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loanData.recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                    <div
                      className={`text-right ${
                        transaction.type === "payment"
                          ? "text-green-600"
                          : transaction.type === "fee"
                            ? "text-red-600"
                            : ""
                      }`}
                    >
                      <p className="font-medium">
                        {transaction.type === "payment" ? "-" : transaction.type === "disbursement" ? "+" : "-"}$
                        {transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {transaction.type === "payment"
                          ? "Payment"
                          : transaction.type === "disbursement"
                            ? "Disbursement"
                            : "Fee"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Full Transaction History
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Your loan manager and support contacts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Your Loan Manager</h3>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-semibold">{loanData.contactPerson}</p>
                    <p className="text-sm text-gray-500">{loanData.contactRole}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold">{loanData.contactPhone}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold">{loanData.contactEmail}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold">Support Options</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">Customer Service</p>
                      <p className="text-sm text-gray-500">General inquiries and support</p>
                    </div>
                    <p className="font-medium">1300 123 456</p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">Technical Support</p>
                      <p className="text-sm text-gray-500">Online banking and app issues</p>
                    </div>
                    <p className="font-medium">1300 789 012</p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">Financial Hardship</p>
                      <p className="text-sm text-gray-500">Assistance with repayment difficulties</p>
                    </div>
                    <p className="font-medium">1300 456 789</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold">Branch Details</h3>
                <div className="flex items-start space-x-3">
                  <Home className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-semibold">Sydney CBD Branch</p>
                    <p className="text-sm">123 George Street, Sydney NSW 2000</p>
                    <p className="text-sm text-gray-500">Mon-Fri: 9:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Schedule Appointment</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
