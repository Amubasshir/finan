"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  User,
  Users,
  ArrowUpDown,
  Eye,
  Edit,
  ThumbsDown,
  Loader,
  Plus,
} from "lucide-react"

interface LoanApplication {
  id: string
  applicantName: string
  lender: string
  amount: number
  interestRate: number
  status:
    | "pending_review"
    | "document_verification"
    | "lender_submission"
    | "lender_assessment"
    | "approved"
    | "rejected"
    | "needs_attention"
  progress: number
  stage: string
  assignedTo: string | null
  dateSubmitted: string
  lastUpdated: string
  priority: "high" | "medium" | "low"
  documentsComplete: boolean
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<LoanApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>("dateSubmitted")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

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
          applicantName: "John Smith",
          lender: "Commonwealth Bank",
          amount: 250000,
          interestRate: 5.49,
          status: "pending_review",
          progress: 15,
          stage: "Initial Review",
          assignedTo: null,
          dateSubmitted: "2023-11-28",
          lastUpdated: "2023-11-28",
          priority: "medium",
          documentsComplete: false,
        },
        {
          id: "app2",
          applicantName: "Sarah Johnson",
          lender: "Westpac",
          amount: 320000,
          interestRate: 5.65,
          status: "document_verification",
          progress: 35,
          stage: "Document Verification",
          assignedTo: "admin1",
          dateSubmitted: "2023-11-25",
          lastUpdated: "2023-11-27",
          priority: "high",
          documentsComplete: false,
        },
        {
          id: "app3",
          applicantName: "Michael Brown",
          lender: "ANZ",
          amount: 275000,
          interestRate: 5.35,
          status: "needs_attention",
          progress: 45,
          stage: "Additional Information Needed",
          assignedTo: "admin2",
          dateSubmitted: "2023-11-24",
          lastUpdated: "2023-11-26",
          priority: "high",
          documentsComplete: true,
        },
        {
          id: "app4",
          applicantName: "Emily Wilson",
          lender: "NAB",
          amount: 420000,
          interestRate: 5.42,
          status: "lender_submission",
          progress: 65,
          stage: "Submitted to Lender",
          assignedTo: "admin1",
          dateSubmitted: "2023-11-22",
          lastUpdated: "2023-11-25",
          priority: "medium",
          documentsComplete: true,
        },
        {
          id: "app5",
          applicantName: "David Lee",
          lender: "ING",
          amount: 380000,
          interestRate: 5.29,
          status: "lender_assessment",
          progress: 75,
          stage: "Lender Assessment",
          assignedTo: "admin3",
          dateSubmitted: "2023-11-20",
          lastUpdated: "2023-11-24",
          priority: "low",
          documentsComplete: true,
        },
        {
          id: "app6",
          applicantName: "Jessica Taylor",
          lender: "Commonwealth Bank",
          amount: 295000,
          interestRate: 5.49,
          status: "approved",
          progress: 100,
          stage: "Approved",
          assignedTo: "admin2",
          dateSubmitted: "2023-11-18",
          lastUpdated: "2023-11-23",
          priority: "medium",
          documentsComplete: true,
        },
        {
          id: "app7",
          applicantName: "Robert Martin",
          lender: "Westpac",
          amount: 340000,
          interestRate: 5.65,
          status: "rejected",
          progress: 100,
          stage: "Rejected",
          assignedTo: "admin1",
          dateSubmitted: "2023-11-17",
          lastUpdated: "2023-11-22",
          priority: "medium",
          documentsComplete: true,
        },
      ]

      setApplications(mockApplications)
      setFilteredApplications(mockApplications)
      setLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    // Apply filters and search
    let result = [...applications]

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (app) =>
          app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.lender.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter((app) => app.status === statusFilter)
    }

    // Apply tab filter
    if (activeTab === "pending") {
      result = result.filter((app) => ["pending_review", "document_verification"].includes(app.status))
    } else if (activeTab === "processing") {
      result = result.filter((app) => ["lender_submission", "lender_assessment"].includes(app.status))
    } else if (activeTab === "attention") {
      result = result.filter((app) => app.status === "needs_attention")
    } else if (activeTab === "completed") {
      result = result.filter((app) => ["approved", "rejected"].includes(app.status))
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0

      if (sortBy === "dateSubmitted") {
        comparison = new Date(a.dateSubmitted).getTime() - new Date(b.dateSubmitted).getTime()
      } else if (sortBy === "lastUpdated") {
        comparison = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
      } else if (sortBy === "applicantName") {
        comparison = a.applicantName.localeCompare(b.applicantName)
      } else if (sortBy === "amount") {
        comparison = a.amount - b.amount
      } else if (sortBy === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

    setFilteredApplications(result)
  }, [applications, searchTerm, statusFilter, activeTab, sortBy, sortDirection])

  const getStatusBadge = (status: LoanApplication["status"]) => {
    switch (status) {
      case "pending_review":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            <Clock className="h-3 w-3 mr-1" /> Pending Review
          </Badge>
        )
      case "document_verification":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            <FileText className="h-3 w-3 mr-1" /> Document Verification
          </Badge>
        )
      case "lender_submission":
        return (
          <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
            <Loader className="h-3 w-3 mr-1" /> Lender Submission
          </Badge>
        )
      case "lender_assessment":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
            <Clock className="h-3 w-3 mr-1" /> Lender Assessment
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="h-3 w-3 mr-1" /> Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <ThumbsDown className="h-3 w-3 mr-1" /> Rejected
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

  const getPriorityBadge = (priority: LoanApplication["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High</Badge>
      case "medium":
        return <Badge className="bg-amber-100 text-amber-800">Medium</Badge>
      case "low":
        return <Badge className="bg-blue-100 text-blue-800">Low</Badge>
    }
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortDirection("asc")
    }
  }

  const getApplicationsCount = (status: string) => {
    if (status === "pending") {
      return applications.filter((app) => ["pending_review", "document_verification"].includes(app.status)).length
    } else if (status === "processing") {
      return applications.filter((app) => ["lender_submission", "lender_assessment"].includes(app.status)).length
    } else if (status === "attention") {
      return applications.filter((app) => app.status === "needs_attention").length
    } else if (status === "completed") {
      return applications.filter((app) => ["approved", "rejected"].includes(app.status)).length
    } else {
      return applications.length
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Loading Admin Dashboard</h1>
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
          <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
          <p className="text-gray-500">Manage and process loan applications</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <Button variant="outline" className="hidden md:flex">
            <Users className="mr-2 h-4 w-4" />
            Team
          </Button>
          <Button className="hidden md:flex">
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Applications</p>
                <p className="text-3xl font-bold">{applications.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Needs Attention</p>
                <p className="text-3xl font-bold">
                  {applications.filter((app) => app.status === "needs_attention").length}
                </p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Approved</p>
                <p className="text-3xl font-bold">{applications.filter((app) => app.status === "approved").length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Review</p>
                <p className="text-3xl font-bold">
                  {applications.filter((app) => app.status === "pending_review").length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name, ID, or lender..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value || null)}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <span>{statusFilter ? `Status: ${statusFilter.replace("_", " ")}` : "Filter by Status"}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending_review">Pending Review</SelectItem>
              <SelectItem value="document_verification">Document Verification</SelectItem>
              <SelectItem value="lender_submission">Lender Submission</SelectItem>
              <SelectItem value="lender_assessment">Lender Assessment</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="needs_attention">Needs Attention</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="text-base py-3">
            All ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-base py-3">
            Pending ({getApplicationsCount("pending")})
          </TabsTrigger>
          <TabsTrigger value="processing" className="text-base py-3">
            Processing ({getApplicationsCount("processing")})
          </TabsTrigger>
          <TabsTrigger value="attention" className="text-base py-3">
            Needs Attention ({getApplicationsCount("attention")})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-base py-3">
            Completed ({getApplicationsCount("completed")})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("applicantName")}>
                      <div className="flex items-center">
                        Applicant
                        {sortBy === "applicantName" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                      </div>
                    </TableHead>
                    <TableHead>Lender</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("amount")}>
                      <div className="flex items-center">
                        Amount
                        {sortBy === "amount" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("priority")}>
                      <div className="flex items-center">
                        Priority
                        {sortBy === "priority" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("dateSubmitted")}>
                      <div className="flex items-center">
                        Submitted
                        {sortBy === "dateSubmitted" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("lastUpdated")}>
                      <div className="flex items-center">
                        Last Updated
                        {sortBy === "lastUpdated" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                      </div>
                    </TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <FileText className="h-12 w-12 text-gray-300 mb-2" />
                          <p className="text-gray-500">No applications found</p>
                          <p className="text-sm text-gray-400">Try adjusting your filters</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.map((app) => (
                      <TableRow key={app.id} className={app.status === "needs_attention" ? "bg-red-50" : ""}>
                        <TableCell className="font-medium">{app.id.slice(-4)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="bg-gray-100 rounded-full p-1 mr-2">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                            {app.applicantName}
                          </div>
                        </TableCell>
                        <TableCell>{app.lender}</TableCell>
                        <TableCell>${app.amount.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell>{getPriorityBadge(app.priority)}</TableCell>
                        <TableCell>{app.dateSubmitted}</TableCell>
                        <TableCell>{app.lastUpdated}</TableCell>
                        <TableCell>
                          {app.assignedTo ? (
                            <Badge variant="outline">Admin {app.assignedTo.slice(-1)}</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-100">
                              Unassigned
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/admin/applications/${app.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/admin/applications/${app.id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            {app.status === "pending_review" && (
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
                                <Link href={`/admin/applications/${app.id}/process`}>Process</Link>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
