"use client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, CheckCircle, Clock, FileText, Home, AlertCircle, Phone, Mail, Users } from "lucide-react"

export default function SettlementTracking() {
  // Mock data for settlement tracking
  const settlementData = {
    loanNumber: "HL-2023-78945",
    lender: "Commonwealth Bank",
    settlementDate: "2023-12-15",
    settlementTime: "2:00 PM",
    settlementLocation: "Electronic Settlement via PEXA",
    currentStage: "Final Approval",
    progress: 80,
    propertyAddress: "123 Main Street, Sydney NSW 2000",
    purchasePrice: 750000,
    loanAmount: 450000,
    depositPaid: 300000,
    contactPerson: "Sarah Johnson",
    contactRole: "Settlement Officer",
    contactPhone: "0412 345 678",
    contactEmail: "sarah.j@lender.com.au",
    tasks: [
      { name: "Loan application submitted", completed: true, date: "2023-11-15" },
      { name: "Conditional approval received", completed: true, date: "2023-11-20" },
      { name: "Property valuation completed", completed: true, date: "2023-11-25" },
      { name: "Final loan documents issued", completed: true, date: "2023-11-28" },
      { name: "Loan documents signed and returned", completed: true, date: "2023-12-01" },
      { name: "Final loan approval", completed: false, date: "2023-12-05" },
      { name: "Settlement booking confirmed", completed: false, date: "2023-12-10" },
      { name: "Settlement day", completed: false, date: "2023-12-15" },
      { name: "Keys handover", completed: false, date: "2023-12-15" },
    ],
    importantNotes: [
      "Please ensure all loan documents are signed and returned by December 3rd.",
      "Funds for settlement need to be cleared in your account 3 business days before settlement.",
      "You will be notified once settlement is complete on the settlement day.",
    ],
  }

  const calculateDaysRemaining = () => {
    const today = new Date()
    const settlementDate = new Date(settlementData.settlementDate)
    const timeDiff = settlementDate.getTime() - today.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
    return daysDiff > 0 ? daysDiff : 0
  }

  const daysRemaining = calculateDaysRemaining()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Settlement Tracking</h1>
          <p className="text-gray-500">Track the progress of your home loan settlement</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Settlement Overview Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">Settlement Overview</CardTitle>
                  <CardDescription>Current status of your settlement</CardDescription>
                </div>
                <Badge className="bg-blue-500">{settlementData.currentStage}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Settlement Progress</span>
                <span className="text-sm font-medium">{settlementData.progress}%</span>
              </div>
              <Progress value={settlementData.progress} className="h-2 mb-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Settlement Date</p>
                      <p className="font-semibold">{settlementData.settlementDate}</p>
                      <p className="text-sm">{settlementData.settlementTime}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Home className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Property Address</p>
                      <p className="font-semibold">{settlementData.propertyAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Loan Details</p>
                      <p className="font-semibold">Loan #: {settlementData.loanNumber}</p>
                      <p className="text-sm">Lender: {settlementData.lender}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Settlement Contact</p>
                      <p className="font-semibold">{settlementData.contactPerson}</p>
                      <p className="text-sm">{settlementData.contactRole}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Contact Phone</p>
                      <p className="font-semibold">{settlementData.contactPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Contact Email</p>
                      <p className="font-semibold">{settlementData.contactEmail}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settlement Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Settlement Timeline</CardTitle>
              <CardDescription>Track the progress of your settlement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {settlementData.tasks.map((task, index) => (
                  <div key={index} className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className={`rounded-full p-1 ${task.completed ? "bg-green-100" : "bg-gray-100"}`}>
                        {task.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      {index < settlementData.tasks.length - 1 && (
                        <div className={`w-px h-full ${task.completed ? "bg-green-200" : "bg-gray-200"} my-2`}></div>
                      )}
                    </div>
                    <div className="pb-6">
                      <p className="font-medium">{task.name}</p>
                      <p className="text-sm text-gray-500">{task.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Days Remaining Card */}
          <Card className="bg-blue-50 border-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-center">Days Until Settlement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-5xl font-bold text-blue-600">{daysRemaining}</p>
                <p className="text-gray-600 mt-2">days remaining</p>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Purchase Price</span>
                <span className="font-semibold">${settlementData.purchasePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Loan Amount</span>
                <span className="font-semibold">${settlementData.loanAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Deposit Paid</span>
                <span className="font-semibold">${settlementData.depositPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold">LVR (Loan-to-Value Ratio)</span>
                <span className="font-semibold">
                  {Math.round((settlementData.loanAmount / settlementData.purchasePrice) * 100)}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Important Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {settlementData.importantNotes.map((note, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{note}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/document-download">Download Settlement Guide</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                Contact Settlement Officer
              </Button>
              <Button className="w-full" variant="outline">
                View Settlement Checklist
              </Button>
              <Button className="w-full">Upload Settlement Documents</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
