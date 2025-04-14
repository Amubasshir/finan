"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronRight,
  FileText,
  Calendar,
  MessageSquare,
  Upload,
  Download,
  Bell,
  Settings,
  User,
  Zap,
  Trophy,
  BarChart,
  Info,
  Plus,
} from "lucide-react"

interface LoanApplication {
  id: string
  lender: string
  amount: number
  interestRate: number
  status: "document_collection" | "processing" | "approved" | "ready_for_settlement" | "completed" | "needs_attention"
  progress: number
  stage: string
  lastUpdated: string
  logoUrl: string
  documentsRequired: number
  documentsUploaded: number
  nextAction?: string
  nextActionDue?: string
  messages: number
  unreadMessages: number
}

interface Activity {
  id: string
  loanId: string
  type: "document" | "status" | "message" | "action" | "success"
  description: string
  date: string
  read: boolean
}

export default function LoanDashboard() {
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [showCompetitionStatus, setShowCompetitionStatus] = useState(true)

  useEffect(() => {
    // Simulate fetching loan applications
    const fetchData = async () => {
      setLoading(true)
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data for loan applications
      const mockApplications: LoanApplication[] = [
        {
          id: "app1",
          lender: "Commonwealth Bank",
          amount: 250000,
          interestRate: 5.49,
          status: "document_collection",
          progress: 25,
          stage: "Document Collection",
          lastUpdated: "2 hours ago",
          logoUrl: "/placeholder.svg?height=40&width=100",
          documentsRequired: 8,
          documentsUploaded: 3,
          nextAction: "Upload remaining documents",
          nextActionDue: "2 days",
          messages: 2,
          unreadMessages: 1,
        },
        {
          id: "app2",
          lender: "Westpac",
          amount: 250000,
          interestRate: 5.65,
          status: "processing",
          progress: 45,
          stage: "Application Review",
          lastUpdated: "1 day ago",
          logoUrl: "/placeholder.svg?height=40&width=100",
          documentsRequired: 8,
          documentsUploaded: 8,
          nextAction: "Wait for lender assessment",
          messages: 1,
          unreadMessages: 0,
        },
        {
          id: "app3",
          lender: "ANZ",
          amount: 250000,
          interestRate: 5.35,
          status: "needs_attention",
          progress: 35,
          stage: "Additional Information Needed",
          lastUpdated: "3 hours ago",
          logoUrl: "/placeholder.svg?height=40&width=100",
          documentsRequired: 8,
          documentsUploaded: 6,
          nextAction: "Provide additional income verification",
          nextActionDue: "1 day",
          messages: 3,
          unreadMessages: 2,
        },
      ]

      // Mock data for activities
      const mockActivities: Activity[] = [
        {
          id: "act1",
          loanId: "app3",
          type: "action",
          description: "Additional income verification requested by ANZ",
          date: "3 hours ago",
          read: false,
        },
        {
          id: "act2",
          loanId: "app1",
          type: "document",
          description: "3 documents uploaded for Commonwealth Bank",
          date: "2 hours ago",
          read: true,
        },
        {
          id: "act3",
          loanId: "app2",
          type: "status",
          description: "Westpac application moved to processing stage",
          date: "1 day ago",
          read: true,
        },
        {
          id: "act4",
          loanId: "app3",
          type: "message",
          description: "New message from ANZ loan officer",
          date: "3 hours ago",
          read: false,
        },
        {
          id: "act5",
          loanId: "app1",
          type: "document",
          description: "Document checklist updated for Commonwealth Bank",
          date: "1 day ago",
          read: true,
        },
      ]

      setApplications(mockApplications)
      setActivities(mockActivities)
      setLoading(false)
    }

    fetchData()
  }, [])

  const getStatusBadge = (status: LoanApplication["status"]) => {
    switch (status) {
      case "document_collection":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            <Upload className="h-3 w-3 mr-1" /> Document Collection
          </Badge>
        )
      case "processing":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            <Clock className="h-3 w-3 mr-1" /> Processing
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="h-3 w-3 mr-1" /> Approved
          </Badge>
        )
      case "ready_for_settlement":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
            <Calendar className="h-3 w-3 mr-1" /> Ready for Settlement
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="h-3 w-3 mr-1" /> Completed
          </Badge>
        )
      case "needs_attention":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" /> Needs Attention
          </Badge>
        )
    }
  }

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "document":
        return <FileText className="h-5 w-5 text-blue-600" />
      case "status":
        return <Clock className="h-5 w-5 text-purple-600" />
      case "message":
        return <MessageSquare className="h-5 w-5 text-green-600" />
      case "action":
        return <AlertTriangle className="h-5 w-5 text-amber-600" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
    }
  }

  const getTotalProgress = () => {
    if (applications.length === 0) return 0
    const totalProgress = applications.reduce((sum, app) => sum + app.progress, 0)
    return Math.round(totalProgress / applications.length)
  }

  const getUnreadActivities = () => {
    return activities.filter((activity) => !activity.read).length
  }

  const getApplicationsNeedingAttention = () => {
    return applications.filter((app) => app.status === "needs_attention").length
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Loading Your Loan Dashboard</h1>
        <div className="flex justify-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Your Loan Dashboard</h1>
          <p className="text-gray-500">Track and manage your loan applications</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {getUnreadActivities() > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {getUnreadActivities()}
              </span>
            )}
          </Button>
          <Button variant="outline" className="hidden md:flex">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button className="hidden md:flex">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </div>
      </div>

      {showCompetitionStatus && applications.length > 1 && (
        <Card className="mb-8 border-blue-300 bg-gradient-to-r from-blue-50 to-white shadow-md overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-blue-800">
              <Trophy className="mr-2 h-5 w-5 text-blue-600" />
              Lender Competition Status
            </CardTitle>
            <CardDescription className="text-blue-700">
              You have {applications.length} lenders competing for your business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                <p className="text-sm text-gray-500">Best Rate So Far</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.min(...applications.map((app) => app.interestRate))}%
                </p>
                <p className="text-xs text-gray-500">
                  From {applications.reduce((best, app) => (app.interestRate < best.interestRate ? app : best)).lender}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                <p className="text-sm text-gray-500">Potential Savings</p>
                <p className="text-2xl font-bold text-green-600">$18,200</p>
                <p className="text-xs text-gray-500">Compared to your current loan</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                <p className="text-sm text-gray-500">Competition Status</p>
                <p className="text-2xl font-bold text-purple-600">Active</p>
                <p className="text-xs text-gray-500">Lenders are competing for your business</p>
              </div>
            </div>
            <Alert className="bg-blue-50 border-blue-100">
              <Zap className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Competition Working!</AlertTitle>
              <AlertDescription className="text-blue-700">
                Your multiple applications are creating competition. ANZ has already offered a rate 0.14% lower than
                their standard rate!
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="bg-blue-50 border-t border-blue-100 flex justify-between">
            <Button
              variant="outline"
              className="border-blue-200 hover:bg-blue-100"
              onClick={() => setShowCompetitionStatus(false)}
            >
              Hide This Section
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">View Competition Details</Button>
          </CardFooter>
        </Card>
      )}

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="overview" className="text-base py-3">
            Overview
          </TabsTrigger>
          <TabsTrigger value="applications" className="text-base py-3">
            Applications ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-base py-3">
            Documents
          </TabsTrigger>
          <TabsTrigger value="activity" className="text-base py-3 relative">
            Activity
            {getUnreadActivities() > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {getUnreadActivities()}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overall Progress */}
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-blue-600" />
                Overall Progress
              </CardTitle>
              <CardDescription>Combined progress of all your loan applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Application Progress</span>
                    <span className="text-sm font-medium">{getTotalProgress()}%</span>
                  </div>
                  <Progress value={getTotalProgress()} className="h-3" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Applications</p>
                    <p className="text-2xl font-bold">{applications.length}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Needs Attention</p>
                    <p className="text-2xl font-bold">{getApplicationsNeedingAttention()}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Best Rate</p>
                    <p className="text-2xl font-bold">{Math.min(...applications.map((app) => app.interestRate))}%</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Estimated Completion</p>
                    <p className="text-2xl font-bold">14 days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applications Needing Attention */}
          {getApplicationsNeedingAttention() > 0 && (
            <Card className="border-amber-200 shadow-md">
              <CardHeader className="pb-2 bg-amber-50">
                <CardTitle className="flex items-center text-amber-800">
                  <AlertTriangle className="mr-2 h-5 w-5 text-amber-600" />
                  Applications Needing Attention
                </CardTitle>
                <CardDescription className="text-amber-700">
                  These applications require your immediate action
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications
                    .filter((app) => app.status === "needs_attention")
                    .map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-4 bg-white rounded-md border border-amber-200 hover:bg-amber-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 mr-4 flex-shrink-0">
                            <img
                              src={app.logoUrl || "/placeholder.svg"}
                              alt={`${app.lender} logo`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{app.lender}</p>
                            <p className="text-sm text-amber-600">{app.nextAction}</p>
                            {app.nextActionDue && <p className="text-xs text-gray-500">Due in: {app.nextActionDue}</p>}
                          </div>
                        </div>
                        <Button size="sm" className="bg-amber-600 hover:bg-amber-700" asChild>
                          <Link href={`/loan-application/${app.id}`}>Take Action</Link>
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-purple-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest updates on your loan applications</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {activities.slice(0, 3).map((activity) => (
                  <li
                    key={activity.id}
                    className={`flex items-start space-x-3 p-3 rounded-md ${!activity.read ? "bg-blue-50 border border-blue-100" : "hover:bg-gray-50"} transition-colors`}
                  >
                    <div
                      className={`mt-0.5 rounded-full p-2 ${
                        activity.type === "document"
                          ? "bg-blue-100"
                          : activity.type === "status"
                            ? "bg-purple-100"
                            : activity.type === "message"
                              ? "bg-green-100"
                              : activity.type === "action"
                                ? "bg-amber-100"
                                : "bg-green-100"
                      }`}
                    >
                      {getActivityIcon(activity.type)}
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
                <CardTitle className="text-sm font-medium">View Documents</CardTitle>
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
                    <span className="text-xs">View</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow group">
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Button
                  variant="ghost"
                  className="w-full h-20 flex flex-col items-center justify-center group-hover:bg-gray-50"
                  asChild
                >
                  <Link href="/messages">
                    <div className="bg-purple-100 rounded-full p-3 mb-2 group-hover:bg-purple-200 transition-colors relative">
                      <MessageSquare className="h-6 w-6 text-purple-600" />
                      {applications.reduce((sum, app) => sum + app.unreadMessages, 0) > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                          {applications.reduce((sum, app) => sum + app.unreadMessages, 0)}
                        </span>
                      )}
                    </div>
                    <span className="text-xs">Messages</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow group">
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">Get Help</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Button
                  variant="ghost"
                  className="w-full h-20 flex flex-col items-center justify-center group-hover:bg-gray-50"
                  asChild
                >
                  <Link href="/contact-support">
                    <div className="bg-amber-100 rounded-full p-3 mb-2 group-hover:bg-amber-200 transition-colors">
                      <Info className="h-6 w-6 text-amber-600" />
                    </div>
                    <span className="text-xs">Help</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {applications.map((app) => (
              <Card key={app.id} className="overflow-hidden shadow-md">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 mr-4 flex-shrink-0">
                      <img
                        src={app.logoUrl || "/placeholder.svg"}
                        alt={`${app.lender} logo`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <CardTitle>{app.lender}</CardTitle>
                        {getStatusBadge(app.status)}
                      </div>
                      <CardDescription>
                        ${app.amount.toLocaleString()} at {app.interestRate}%
                      </CardDescription>
                    </div>
                  </div>
                  <div>
                    {app.status === "needs_attention" && (
                      <Badge className="bg-red-100 text-red-800">Action Required</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">{app.stage}</span>
                        <span className="text-sm font-medium">{app.progress}%</span>
                      </div>
                      <Progress value={app.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Documents</p>
                        <p className="text-sm font-medium">
                          {app.documentsUploaded}/{app.documentsRequired} Uploaded
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Last Updated</p>
                        <p className="text-sm font-medium">{app.lastUpdated}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Messages</p>
                        <p className="text-sm font-medium flex items-center">
                          {app.messages} Total
                          {app.unreadMessages > 0 && (
                            <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                              {app.unreadMessages} Unread
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {app.nextAction && (
                      <div
                        className={`p-3 rounded-lg ${app.status === "needs_attention" ? "bg-red-50 border border-red-100" : "bg-blue-50 border border-blue-100"}`}
                      >
                        <p className="text-sm font-medium flex items-center">
                          {app.status === "needs_attention" ? (
                            <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
                          ) : (
                            <Info className="h-4 w-4 mr-2 text-blue-600" />
                          )}
                          Next Action: {app.nextAction}
                        </p>
                        {app.nextActionDue && (
                          <p className="text-xs text-gray-600 mt-1 ml-6">Due in: {app.nextActionDue}</p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" asChild>
                    <Link href={`/loan-application/${app.id}/documents`}>
                      <FileText className="mr-2 h-4 w-4" />
                      Documents
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/loan-application/${app.id}/messages`}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Messages
                      {app.unreadMessages > 0 && (
                        <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {app.unreadMessages}
                        </span>
                      )}
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/loan-application/${app.id}`}>
                      View Application <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button size="lg" asChild>
              <Link href="/pre-approved-loans">
                <Plus className="mr-2 h-5 w-5" />
                Apply for More Loans
              </Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-600" />
                Document Status
              </CardTitle>
              <CardDescription>Track the status of your documents across all applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {applications.map((app) => (
                  <div key={app.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 mr-3 flex-shrink-0">
                          <img
                            src={app.logoUrl || "/placeholder.svg"}
                            alt={`${app.lender} logo`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <h3 className="font-medium">{app.lender}</h3>
                      </div>
                      <Badge variant="outline">
                        {app.documentsUploaded}/{app.documentsRequired} Uploaded
                      </Badge>
                    </div>
                    <Progress value={(app.documentsUploaded / app.documentsRequired) * 100} className="h-2" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-sm">ID Verification</span>
                        </div>
                        <Badge variant="success">Uploaded</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-sm">Proof of Income</span>
                        </div>
                        <Badge variant="success">Uploaded</Badge>
                      </div>
                      {app.documentsUploaded < app.documentsRequired && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-amber-600 mr-2" />
                            <span className="text-sm">Bank Statements</span>
                          </div>
                          <Badge variant="outline">Required</Badge>
                        </div>
                      )}
                      {app.status === "needs_attention" && (
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-md border border-red-100">
                          <div className="flex items-center">
                            <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                            <span className="text-sm">Additional Income Verification</span>
                          </div>
                          <Badge className="bg-red-100 text-red-800">Requested</Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/loan-application/${app.id}/documents`}>View All Documents</Link>
                      </Button>
                    </div>

                    {app !== applications[applications.length - 1] && <div className="border-t my-4"></div>}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t">
              <Button variant="outline" asChild>
                <Link href="/document-download">
                  <Download className="mr-2 h-4 w-4" />
                  Download Templates
                </Link>
              </Button>
              <Button asChild>
                <Link href="/document-upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Documents
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-purple-600" />
                Activity Log
              </CardTitle>
              <CardDescription>Complete history of your loan applications</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="p-6">
                  {activities.map((activity, index) => (
                    <div
                      key={activity.id}
                      className={`flex mb-6 ${!activity.read ? "bg-blue-50 p-3 rounded-lg border border-blue-100" : ""}`}
                    >
                      <div className="mr-4 flex flex-col items-center">
                        <div
                          className={`rounded-full p-2 ${
                            activity.type === "document"
                              ? "bg-blue-100"
                              : activity.type === "status"
                                ? "bg-purple-100"
                                : activity.type === "message"
                                  ? "bg-green-100"
                                  : activity.type === "action"
                                    ? "bg-amber-100"
                                    : "bg-green-100"
                          }`}
                        >
                          {getActivityIcon(activity.type)}
                        </div>
                        {index < activities.length - 1 && <div className="w-px h-full bg-gray-200 my-2"></div>}
                      </div>
                      <div className="pb-6">
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                        {!activity.read && <Badge className="mt-2 bg-blue-100 text-blue-800">New</Badge>}
                        <div className="mt-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/loan-application/${activity.loanId}`}>View Application</Link>
                          </Button>
                        </div>
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
