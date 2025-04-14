"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Home,
  FileText,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  BarChart,
  Settings,
  Download,
  Upload,
  FileSignature,
  AlertTriangle,
  ThumbsUp,
  BanknoteIcon as Bank,
  ArrowRight,
  Bell,
  HelpCircle,
  ExternalLink,
  InfoIcon as InfoCircle,
  MessageSquare,
} from "lucide-react"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showNotifications, setShowNotifications] = useState(false)
  const [animateNotification, setAnimateNotification] = useState(false)

  // Simulate notification animation
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimateNotification((prev) => !prev)
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  // Mock data for the dashboard
  const loanData = {
    status: "In Progress",
    stage: "Settlement",
    progress: 75,
    loanAmount: 450000,
    interestRate: 4.25,
    loanTerm: 30,
    monthlyRepayment: 2212.5,
    settlementDate: "2023-12-15",
    loanNumber: "HL-2023-78945",
    lender: "Commonwealth Bank",
    documentsRequired: 3,
    documentsUploaded: 2,
    nextPaymentDate: "2024-01-15",
    nextPaymentAmount: 2212.5,
    recentActivity: [
      { date: "2023-11-28", description: "Loan offer accepted", type: "success" },
      { date: "2023-11-25", description: "Document verification completed", type: "success" },
      { date: "2023-11-20", description: "Property valuation completed", type: "success" },
      { date: "2023-11-15", description: "Application submitted", type: "info" },
    ],
    upcomingTasks: [
      { date: "2023-12-05", description: "Sign settlement documents", completed: false },
      { date: "2023-12-10", description: "Final loan approval", completed: false },
      { date: "2023-12-15", description: "Settlement day", completed: false },
    ],
  }

  // Mock data for documents to sign
  const documentsToSign = [
    {
      id: "doc1",
      title: "Loan Contract",
      description: "Official loan agreement with terms and conditions",
      dueDate: "2023-12-02",
      status: "urgent",
      lender: "Commonwealth Bank",
    },
    {
      id: "doc2",
      title: "Mortgage Documents",
      description: "Legal documents for property security",
      dueDate: "2023-12-03",
      status: "pending",
      lender: "Commonwealth Bank",
    },
    {
      id: "doc3",
      title: "Direct Debit Authorization",
      description: "Authorization for automatic loan repayments",
      dueDate: "2023-12-05",
      status: "pending",
      lender: "Commonwealth Bank",
    },
  ]

  // Mock data for alternative approved loans
  const alternativeLoans = [
    {
      id: "loan2",
      lender: "Westpac",
      amount: 450000,
      interestRate: 4.35,
      comparisonRate: 4.42,
      monthlyRepayment: 2235.78,
      term: 30,
      features: ["Offset account", "Redraw facility", "Extra repayments"],
      status: "approved",
      logoUrl: "/placeholder.svg?height=40&width=100",
      highlight: "Lowest fees",
    },
    {
      id: "loan3",
      lender: "ANZ",
      amount: 450000,
      interestRate: 4.29,
      comparisonRate: 4.38,
      monthlyRepayment: 2222.45,
      term: 30,
      features: ["Package benefits", "Fixed rate option", "No annual fee"],
      status: "approved",
      logoUrl: "/placeholder.svg?height=40&width=100",
      highlight: "Best rate",
    },
    {
      id: "loan4",
      lender: "NAB",
      amount: 450000,
      interestRate: 4.32,
      comparisonRate: 4.4,
      monthlyRepayment: 2228.12,
      term: 30,
      features: ["Flexible repayments", "Online banking", "Mobile app"],
      status: "approved",
      logoUrl: "/placeholder.svg?height=40&width=100",
      highlight: "Most flexible",
    },
  ]

  // Mock notifications
  const notifications = [
    {
      id: "notif1",
      title: "Documents ready to sign",
      description: "3 documents require your signature",
      time: "2 hours ago",
      type: "document",
      read: false,
    },
    {
      id: "notif2",
      title: "Loan pre-approved",
      description: "Your loan has been pre-approved",
      time: "1 day ago",
      type: "success",
      read: true,
    },
    {
      id: "notif3",
      title: "Alternative loans available",
      description: "3 alternative loans are available for you",
      time: "1 day ago",
      type: "info",
      read: false,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Home Loan Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's your loan overview.</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-5 w-5" />
                  {notifications.some((n) => !n.read) && (
                    <span
                      className={`absolute -top-1 -right-1 flex h-3 w-3 ${animateNotification ? "scale-125" : "scale-100"} transition-transform duration-300`}
                    >
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button variant="outline" className="hidden md:flex">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button className="hidden md:flex">
            <FileText className="mr-2 h-4 w-4" />
            Documents
          </Button>
          <Button variant="outline" size="icon" className="md:hidden">
            <Settings className="h-5 w-5" />
          </Button>
          <Button size="icon" className="md:hidden">
            <FileText className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Notifications dropdown */}
      {showNotifications && (
        <div className="absolute right-4 md:right-8 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50 overflow-hidden">
          <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
            <h3 className="font-semibold">Notifications</h3>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              Mark all as read
            </Button>
          </div>
          <ScrollArea className="h-80">
            <div className="p-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 mb-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors ${notification.read ? "" : "border-l-4 border-blue-500"}`}
                >
                  <div className="flex items-start">
                    <div
                      className={`rounded-full p-2 mr-3 ${
                        notification.type === "document"
                          ? "bg-amber-100 text-amber-600"
                          : notification.type === "success"
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {notification.type === "document" ? (
                        <FileSignature className="h-4 w-4" />
                      ) : notification.type === "success" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Bell className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-gray-600">{notification.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-2 border-t bg-gray-50">
            <Button variant="ghost" size="sm" className="w-full justify-center" asChild>
              <Link href="/notifications">
                View All Notifications
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-white sticky top-0 z-10 pb-2 -mx-4 px-4 pt-2">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 lg:w-[800px]">
            <TabsTrigger value="overview" className="flex items-center">
              <Home className="mr-2 h-4 w-4 md:mr-1" />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4 md:mr-1" />
              <span className="hidden md:inline">Loan Details</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center">
              <FileText className="mr-2 h-4 w-4 md:mr-1" />
              <span className="hidden md:inline">Documents</span>
            </TabsTrigger>
            <TabsTrigger value="sign" className="flex items-center relative">
              <FileSignature className="mr-2 h-4 w-4 md:mr-1" />
              <span className="hidden md:inline">Documents to Sign</span>
              {documentsToSign.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-red-500 text-[10px] md:text-xs text-white">
                  {documentsToSign.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="alternatives" className="flex items-center">
              <Bank className="mr-2 h-4 w-4 md:mr-1" />
              <span className="hidden md:inline">Alternative Loans</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center">
              <Clock className="mr-2 h-4 w-4 md:mr-1" />
              <span className="hidden md:inline">Activity</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6 mt-0">
          {/* Loan Status Card */}
          <Card className="overflow-hidden border-t-4 border-t-blue-500 shadow-md">
            <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-white">
              <CardTitle className="text-xl flex items-center">
                <Home className="mr-2 h-5 w-5 text-blue-500" />
                Loan Status
              </CardTitle>
              <CardDescription>Current status of your home loan application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Badge variant={loanData.status === "Approved" ? "success" : "default"} className="mr-2">
                    {loanData.status}
                  </Badge>
                  <span className="text-sm text-gray-500">Stage: {loanData.stage}</span>
                </div>
                <span className="text-sm font-medium">{loanData.progress}% Complete</span>
              </div>
              <Progress value={loanData.progress} className="h-2" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Loan Amount</p>
                  <p className="text-xl font-bold">${loanData.loanAmount.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Interest Rate</p>
                  <p className="text-xl font-bold">{loanData.interestRate}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Loan Term</p>
                  <p className="text-xl font-bold">{loanData.loanTerm} years</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Monthly Repayment</p>
                  <p className="text-xl font-bold">${loanData.monthlyRepayment.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/loan-details/current">
                  View Full Loan Details
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Documents to Sign Alert */}
          {documentsToSign.length > 0 && (
            <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-white shadow-md overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center text-amber-800">
                  <FileSignature className="mr-2 h-5 w-5 text-amber-600" />
                  Documents Requiring Signature
                </CardTitle>
                <CardDescription className="text-amber-700">
                  You have {documentsToSign.length} document(s) that need your signature
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documentsToSign.slice(0, 2).map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between bg-white p-3 rounded-md border border-amber-200 hover:border-amber-300 transition-colors"
                    >
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium">{doc.title}</p>
                          {doc.status === "urgent" && <Badge className="ml-2 bg-red-100 text-red-800">Urgent</Badge>}
                        </div>
                        <p className="text-sm text-gray-500">Due: {doc.dueDate}</p>
                      </div>
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white" asChild>
                        <Link href={`/documents/sign/${doc.id}`}>Sign Now</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-amber-50 border-t border-amber-200">
                <Button
                  variant="outline"
                  className="w-full border-amber-200 hover:border-amber-300 hover:bg-amber-100"
                  onClick={() => setActiveTab("sign")}
                >
                  View All Documents to Sign
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow group">
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">Upload Documents</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Button
                  variant="ghost"
                  className="w-full h-20 flex flex-col items-center justify-center group-hover:bg-gray-50"
                  asChild
                >
                  <Link href="/document-upload">
                    <div className="bg-blue-100 rounded-full p-3 mb-2 group-hover:bg-blue-200 transition-colors">
                      <Upload className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="text-xs">Upload</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow group">
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">Download Documents</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Button
                  variant="ghost"
                  className="w-full h-20 flex flex-col items-center justify-center group-hover:bg-gray-50"
                  asChild
                >
                  <Link href="/document-download">
                    <div className="bg-green-100 rounded-full p-3 mb-2 group-hover:bg-green-200 transition-colors">
                      <Download className="h-6 w-6 text-green-600" />
                    </div>
                    <span className="text-xs">Download</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow group">
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">Track Progress</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Button
                  variant="ghost"
                  className="w-full h-20 flex flex-col items-center justify-center group-hover:bg-gray-50"
                  asChild
                >
                  <Link href="/loan-progress-tracker">
                    <div className="bg-purple-100 rounded-full p-3 mb-2 group-hover:bg-purple-200 transition-colors">
                      <BarChart className="h-6 w-6 text-purple-600" />
                    </div>
                    <span className="text-xs">Track</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow group">
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">Settlement Tracking</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Button
                  variant="ghost"
                  className="w-full h-20 flex flex-col items-center justify-center group-hover:bg-gray-50"
                  asChild
                >
                  <Link href="/settlement-tracking">
                    <div className="bg-amber-100 rounded-full p-3 mb-2 group-hover:bg-amber-200 transition-colors">
                      <Calendar className="h-6 w-6 text-amber-600" />
                    </div>
                    <span className="text-xs">Settlement</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Alternative Loans Preview */}
          {alternativeLoans.length > 0 && (
            <Card className="overflow-hidden border-t-4 border-t-green-500 shadow-md">
              <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-white">
                <CardTitle className="text-xl flex items-center">
                  <Bank className="mr-2 h-5 w-5 text-green-600" />
                  Alternative Approved Loans
                </CardTitle>
                <CardDescription>Other loan options you've been approved for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alternativeLoans.slice(0, 2).map((loan) => (
                    <div
                      key={loan.id}
                      className="flex items-center justify-between bg-white p-4 rounded-md border border-gray-200 hover:border-green-200 hover:bg-green-50 transition-all"
                    >
                      <div className="flex items-center">
                        <div className="w-16 mr-4 flex-shrink-0">
                          <img src={loan.logoUrl || "/placeholder.svg"} alt={`${loan.lender} logo`} className="h-8" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <p className="font-medium">{loan.lender}</p>
                            {loan.highlight && (
                              <Badge className="ml-2 bg-green-100 text-green-800">{loan.highlight}</Badge>
                            )}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="font-semibold text-green-600">{loan.interestRate}%</span>
                            <span className="mx-1">|</span>
                            <span>${loan.monthlyRepayment.toFixed(2)}/mo</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="hidden sm:flex" asChild>
                          <Link href={`/loan-details/${loan.id}`}>View Details</Link>
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" asChild>
                          <Link href={`/switch-loan/${loan.id}`}>Switch</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("alternatives")}>
                  View All Alternative Loans
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Upcoming Tasks */}
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-600" />
                Upcoming Tasks
              </CardTitle>
              <CardDescription>Tasks that need your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {loanData.upcomingTasks.map((task, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className={`mt-0.5 rounded-full p-2 ${task.completed ? "bg-green-100" : "bg-amber-100"}`}>
                      {task.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{task.description}</p>
                      <p className="text-sm text-gray-500">Due: {task.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-purple-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest updates on your loan application</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {loanData.recentActivity.slice(0, 3).map((activity, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`mt-0.5 rounded-full p-2 ${
                        activity.type === "success"
                          ? "bg-green-100"
                          : activity.type === "warning"
                            ? "bg-amber-100"
                            : "bg-blue-100"
                      }`}
                    >
                      {activity.type === "success" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : activity.type === "warning" ? (
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                      ) : (
                        <FileText className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveTab("activity")}>
                View All Activity
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6 mt-0">
          <Card className="shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-blue-600" />
                Loan Details
              </CardTitle>
              <CardDescription>Comprehensive information about your home loan</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Loan Number</h3>
                    <p className="text-lg font-semibold">{loanData.loanNumber}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Lender</h3>
                    <p className="text-lg font-semibold">{loanData.lender}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Loan Amount</h3>
                    <p className="text-lg font-semibold">${loanData.loanAmount.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Interest Rate</h3>
                    <p className="text-lg font-semibold">{loanData.interestRate}% p.a.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Loan Term</h3>
                    <p className="text-lg font-semibold">{loanData.loanTerm} years</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Monthly Repayment</h3>
                    <p className="text-lg font-semibold">${loanData.monthlyRepayment.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Settlement Date</h3>
                    <p className="text-lg font-semibold">{loanData.settlementDate}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Loan Type</h3>
                    <p className="text-lg font-semibold">Principal & Interest</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-4">Loan Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Offset Account</span>
                  </div>
                  <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Redraw Facility</span>
                  </div>
                  <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Extra Repayments</span>
                  </div>
                  <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Online Banking</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <Button asChild>
                <Link href="/loan-details/current">View Complete Loan Details</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6 mt-0">
          <Card className="shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-600" />
                Documents
              </CardTitle>
              <CardDescription>Manage your loan documents</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div>
                    <h3 className="font-medium">Required Documents</h3>
                    <p className="text-sm text-gray-600">Documents needed for your loan application</p>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    {loanData.documentsUploaded}/{loanData.documentsRequired} Uploaded
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-white rounded-md border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <span>Proof of Income</span>
                    </div>
                    <Badge variant="success">Uploaded</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-md border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <span>ID Verification</span>
                    </div>
                    <Badge variant="success">Uploaded</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-md border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <span>Property Valuation</span>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" asChild className="flex-1">
                    <Link href="/document-download" className="flex items-center justify-center">
                      <Download className="mr-2 h-4 w-4" />
                      Download Documents
                    </Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href="/document-upload" className="flex items-center justify-center">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Documents
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sign" className="space-y-6 mt-0">
          <Card className="shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-white border-b">
              <CardTitle className="flex items-center">
                <FileSignature className="mr-2 h-5 w-5 text-amber-600" />
                Documents to Sign
              </CardTitle>
              <CardDescription>These documents require your signature to proceed with your loan</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {documentsToSign.map((doc) => (
                  <Card
                    key={doc.id}
                    className={`border overflow-hidden hover:shadow-md transition-shadow ${
                      doc.status === "urgent" ? "border-red-200" : "border-gray-200"
                    }`}
                  >
                    <div className={`h-1 ${doc.status === "urgent" ? "bg-red-500" : "bg-blue-500"}`}></div>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <div
                              className={`p-2 rounded-full mr-3 ${
                                doc.status === "urgent" ? "bg-red-100" : "bg-blue-100"
                              }`}
                            >
                              <FileSignature
                                className={`h-5 w-5 ${doc.status === "urgent" ? "text-red-600" : "text-blue-600"}`}
                              />
                            </div>
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-semibold text-lg">{doc.title}</h3>
                                {doc.status === "urgent" && (
                                  <Badge className="ml-2 bg-red-100 text-red-800">Urgent</Badge>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm">{doc.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 ml-10">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Due: {doc.dueDate}</span>
                            <span className="mx-2">•</span>
                            <span>From: {doc.lender}</span>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center space-x-2 ml-10 md:ml-0">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/documents/preview/${doc.id}`}>Preview</Link>
                          </Button>
                          <Button
                            size="sm"
                            className={doc.status === "urgent" ? "bg-red-600 hover:bg-red-700" : ""}
                            asChild
                          >
                            <Link href={`/documents/sign/${doc.id}`}>Sign Now</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t flex flex-col sm:flex-row justify-between gap-3">
              <Button variant="outline" asChild>
                <Link href="/documents/history" className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  View Signed Documents
                </Link>
              </Button>
              <Button asChild>
                <Link href="/documents/sign-all" className="flex items-center">
                  <FileSignature className="mr-2 h-4 w-4" />
                  Sign All Documents
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
              <CardTitle className="flex items-center">
                <HelpCircle className="mr-2 h-5 w-5 text-blue-600" />
                Electronic Signature Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                    <InfoCircle className="h-5 w-5 mr-2 text-blue-600" />
                    About Electronic Signatures
                  </h3>
                  <p className="text-blue-700 text-sm">
                    Electronic signatures on our platform are legally binding and comply with the Electronic
                    Transactions Act. Your signature is secured with encryption and a complete audit trail is
                    maintained.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium mb-2 flex items-center">
                      <FileSignature className="h-5 w-5 mr-2 text-gray-600" />
                      How It Works
                    </h3>
                    <ol className="text-sm space-y-2 list-decimal list-inside">
                      <li>Click "Sign Now" on any document</li>
                      <li>Review the document carefully</li>
                      <li>Follow the prompts to add your signature</li>
                      <li>Confirm and submit your signed document</li>
                    </ol>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium mb-2 flex items-center">
                      <HelpCircle className="h-5 w-5 mr-2 text-gray-600" />
                      Need Help?
                    </h3>
                    <p className="text-sm mb-3">
                      If you have any questions about signing documents or need assistance:
                    </p>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/contact-support" className="flex items-center justify-center">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact Support
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alternatives" className="space-y-6 mt-0">
          <Card className="shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b">
              <CardTitle className="flex items-center">
                <Bank className="mr-2 h-5 w-5 text-green-600" />
                Alternative Approved Loans
              </CardTitle>
              <CardDescription>Other loan options you've been approved for</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {alternativeLoans.map((loan) => (
                  <Card key={loan.id} className="overflow-hidden border hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-24 mr-4 flex-shrink-0">
                            <img
                              src={loan.logoUrl || "/placeholder.svg"}
                              alt={`${loan.lender} logo`}
                              className="h-10"
                            />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-semibold text-lg">{loan.lender}</h3>
                              <Badge className="ml-2 bg-green-100 text-green-800">Approved</Badge>
                              {loan.highlight && (
                                <Badge className="ml-2 bg-blue-100 text-blue-800">{loan.highlight}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">{loan.interestRate}%</p>
                          <p className="text-sm text-gray-500">Comparison rate: {loan.comparisonRate}%</p>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Loan Amount</p>
                            <p className="font-semibold">${loan.amount.toLocaleString()}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Monthly Repayment</p>
                            <p className="font-semibold">${loan.monthlyRepayment.toFixed(2)}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Loan Term</p>
                            <p className="font-semibold">{loan.term} years</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Key Features</h4>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {loan.features.map((feature, index) => (
                              <li key={index} className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 border-t flex flex-col sm:flex-row gap-2 justify-end">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/loan-details/${loan.id}`} className="flex items-center">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" asChild>
                          <Link href={`/switch-loan/${loan.id}`} className="flex items-center">
                            <ThumbsUp className="mr-2 h-4 w-4" />
                            Switch to This Loan
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <div className="w-full bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-blue-600" />
                  About Switching Loans
                </h3>
                <p className="text-blue-700 text-sm mb-3">
                  If your current loan application encounters issues or you prefer a different option, you can switch to
                  any of these pre-approved alternatives without starting a new application.
                </p>
                <Button variant="outline" size="sm" className="bg-white" asChild>
                  <Link href="/loan-switching-guide" className="flex items-center">
                    Learn More About Switching Loans
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6 mt-0">
          <Card className="shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-b">
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-purple-600" />
                Activity Log
              </CardTitle>
              <CardDescription>Complete history of your loan application</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="p-6">
                  {loanData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex mb-6">
                      <div className="mr-4 flex flex-col items-center">
                        <div
                          className={`rounded-full p-2 ${
                            activity.type === "success"
                              ? "bg-green-100"
                              : activity.type === "warning"
                                ? "bg-amber-100"
                                : "bg-blue-100"
                          }`}
                        >
                          {activity.type === "success" ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : activity.type === "warning" ? (
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                          ) : (
                            <FileText className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        {index < loanData.recentActivity.length - 1 && (
                          <div className="w-px h-full bg-gray-200 my-2"></div>
                        )}
                      </div>
                      <div className="pb-6">
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/activity-history" className="flex items-center justify-center">
                  <Download className="mr-2 h-4 w-4" />
                  Download Activity Log
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
