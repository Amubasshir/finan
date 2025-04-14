"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CheckCircle,
  CreditCard,
  DollarSign,
  FileText,
  AlertCircle,
  Calendar,
  Clock,
  BanknoteIcon as Bank,
  Smartphone,
} from "lucide-react"

export default function LoanAccountSetup() {
  const [activeTab, setActiveTab] = useState("account")

  // Mock data for the loan account setup
  const accountData = {
    loanNumber: "HL-2023-78945",
    lender: "Commonwealth Bank",
    accountNumber: "062-000 12345678",
    bsb: "062-000",
    accountName: "John Smith Home Loan",
    interestRate: 4.25,
    offsetAccount: true,
    offsetAccountNumber: "062-000 87654321",
    offsetBalance: 15000,
    nextPaymentDate: "2024-01-15",
    nextPaymentAmount: 2212.5,
    paymentFrequency: "Monthly",
    setupProgress: 70,
    setupTasks: [
      { name: "Loan account created", completed: true },
      { name: "Online banking access setup", completed: true },
      { name: "Direct debit authorization", completed: true },
      { name: "Offset account linked", completed: true },
      { name: "Mobile app setup", completed: false },
      { name: "Payment schedule confirmed", completed: false },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Loan Account Setup</h1>
          <p className="text-gray-500">Set up and manage your new home loan account</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Account Setup Progress</CardTitle>
                <CardDescription>Complete these steps to finish setting up your loan account</CardDescription>
              </div>
              <Badge>{accountData.setupProgress}% Complete</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={accountData.setupProgress} className="h-2 mb-6" />

            <div className="space-y-4">
              {accountData.setupTasks.map((task, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`rounded-full p-1 ${task.completed ? "bg-green-100" : "bg-gray-100"}`}>
                    {task.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{task.name}</p>
                  </div>
                  {task.completed ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Completed
                    </Badge>
                  ) : (
                    <Button size="sm" variant="outline">
                      Complete
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="account" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="account">Account Details</TabsTrigger>
          <TabsTrigger value="payments">Payment Setup</TabsTrigger>
          <TabsTrigger value="banking">Online Banking</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loan Account Details</CardTitle>
              <CardDescription>Your new home loan account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Bank className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Lender</p>
                      <p className="font-semibold">{accountData.lender}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Loan Number</p>
                      <p className="font-semibold">{accountData.loanNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CreditCard className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Account Number</p>
                      <p className="font-semibold">{accountData.accountNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <DollarSign className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Interest Rate</p>
                      <p className="font-semibold">{accountData.interestRate}% p.a.</p>
                    </div>
                  </div>
                </div>

                {accountData.offsetAccount && (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CreditCard className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Offset Account</p>
                        <p className="font-semibold">{accountData.offsetAccountNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <DollarSign className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Offset Balance</p>
                        <p className="font-semibold">${accountData.offsetBalance.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Offset Benefit</p>
                        <p className="font-semibold">
                          Saving approximately $
                          {Math.round(accountData.offsetBalance * (accountData.interestRate / 100)).toLocaleString()}{" "}
                          per year
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-4">Account Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Offset Account</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Redraw Facility</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Extra Repayments</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Online Banking</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/loan-details/current">View Complete Loan Details</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Setup</CardTitle>
              <CardDescription>Set up your loan repayments</CardDescription>
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
                    <p className="text-xl font-bold">${accountData.nextPaymentAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="text-xl font-bold">{accountData.nextPaymentDate}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment Method</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="directDebit" defaultChecked />
                    <Label htmlFor="directDebit">Direct Debit</Label>
                  </div>

                  <div className="pl-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fromAccount">From Account</Label>
                      <Select defaultValue="offset">
                        <SelectTrigger id="fromAccount">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="offset">Offset Account (062-000 87654321)</SelectItem>
                          <SelectItem value="savings">Savings Account (062-000 11223344)</SelectItem>
                          <SelectItem value="other">Add Another Account</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                      <Select defaultValue="monthly">
                        <SelectTrigger id="paymentFrequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="fortnightly">Fortnightly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentDay">Payment Day</Label>
                      <Select defaultValue="15">
                        <SelectTrigger id="paymentDay">
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st of the month</SelectItem>
                          <SelectItem value="15">15th of the month</SelectItem>
                          <SelectItem value="lastDay">Last day of the month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Payment Options</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="extraPayments" />
                    <Label htmlFor="extraPayments">Set up additional regular payments</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="roundUp" />
                    <Label htmlFor="roundUp">Round up payments to nearest $100</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Save Payment Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="banking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Online Banking Setup</CardTitle>
              <CardDescription>Access your loan account online</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Online Banking Access</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Internet Banking</p>
                      <p className="text-sm text-gray-500">Your loan account has been added to your online banking</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Smartphone className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Mobile Banking App</p>
                      <p className="text-sm text-gray-500">Download the mobile app to manage your loan on the go</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Download App
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold">Account Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="paymentDue" defaultChecked />
                    <Label htmlFor="paymentDue">Payment due reminders</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="paymentConfirmation" defaultChecked />
                    <Label htmlFor="paymentConfirmation">Payment confirmation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="interestRateChanges" defaultChecked />
                    <Label htmlFor="interestRateChanges">Interest rate changes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="statementReady" defaultChecked />
                    <Label htmlFor="statementReady">Statement ready notification</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notificationEmail">Email Notifications</Label>
                    <Input id="notificationEmail" type="email" defaultValue="john.smith@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notificationSMS">SMS Notifications</Label>
                    <Input id="notificationSMS" type="tel" defaultValue="0412 345 678" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Save Notification Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Important Documents</CardTitle>
              <CardDescription>Access and download your loan documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                    <span>Loan Contract</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                    <span>Mortgage Documents</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                    <span>Direct Debit Authorization</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                    <span>Welcome Pack</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                    <span>Terms and Conditions</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Request Additional Documents
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
