"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  SlidersHorizontal,
} from "lucide-react"
import AdminLayout from "@/components/layouts/AdminLayout"
import {debounce} from "lodash"
import api from "@/lib/axios" // Import axios instance

// Use your existing loanInfo model type
interface LoanApplication {
  _id: string
  personal: {
    fullName: string
  }
  loanRequirements: {
    loanAmount: number
    loanType: string
  }
  financial: {
    currentLender: string
    interestRate: number
  }
  status: string
  createdAt: any
  updatedAt: any
  dateSubmitted: string
  lastUpdated: string
  priority: "high" | "medium" | "low"
  assignedTo: string | null
  documentsComplete: boolean
}

interface FilterOptions {
  lender: string | null
  priority: string | null
  assignedTo: string | null
  dateRange: {
    from: string | null
    to: string | null
  }
}

interface ApiResponse {
  success: boolean
  applications: LoanApplication[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  stats: {
    total: number
    needsAttention: number
    approved: number
    pendingReview: number
  }
  tabCounts: {
    all: number
    pending: number
    processing: number
    attention: number
    completed: number
  }
}

export default function AdminDashboard() {
  const router = useRouter()
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<LoanApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | "all" | null>(null)
  const [sortBy, setSortBy] = useState<string>("dateSubmitted")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    lender: null,
    priority: null,
    assignedTo: null,
    dateRange: {
      from: null,
      to: null
    }
  })
  const [uniqueLenders, setUniqueLenders] = useState<string[]>([])
  const [uniqueAssignees, setUniqueAssignees] = useState<string[]>([])
  const [stats, setStats] = useState({
    total: 0,
    needsAttention: 0,
    approved: 0,
    pendingReview: 0
  })
  const [tabCounts, setTabCounts] = useState({
    all: 0,
    pending: 0,
    processing: 0,
    attention: 0,
    completed: 0
  })
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 0
  })

  // Format helpers
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Fetch applications from API
  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true)
      
      // Build query parameters
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter)
      if (activeTab !== 'all') params.append('tab', activeTab)
      params.append('sortBy', sortBy)
      params.append('sortDirection', sortDirection)
      params.append('page', pagination.page.toString())
      params.append('limit', pagination.limit.toString())
      
      const response = await api.get<ApiResponse>(`/admin/applications?${params.toString()}`)
      
      if (response.data.success) {
        setApplications(response.data.applications)
        setFilteredApplications(response.data.applications)
        setPagination(response.data.pagination)
        setStats(response.data.stats)
        setTabCounts(response.data.tabCounts)
        
        // Extract unique lenders and assignees for filters
        const lenders = [...new Set(response.data.applications.map(app => app.financial.currentLender).filter(Boolean))]
        const assignees = [...new Set(response.data.applications.map(app => app.assignedTo).filter(Boolean))]
        
        setUniqueLenders(lenders)
        setUniqueAssignees(assignees)
      } else {
        setError('Failed to fetch applications')
      }
    } catch (err) {
      console.error('Error fetching applications:', err)
      setError('An error occurred while fetching applications')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, statusFilter, activeTab, sortBy, sortDirection, pagination.page, pagination.limit])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term)
    }, 300),
    []
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
  }

  const getStatusBadge = (status: string) => {
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
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            {status.replace('_', ' ')}
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
      default:
        return <Badge className="bg-gray-100 text-gray-800">Normal</Badge>
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

  const handleViewApplication = (id: string) => {
    router.push(`/admin/dashboard/applications/${id}`)
  }



  const resetFilters = () => {
    setFilterOptions({
      lender: null,
      priority: null,
      assignedTo: null,
      dateRange: {
        from: null,
        to: null
      }
    })
    setShowFiltersModal(false)
  }

  const applyFilters = () => {
    // Filters are applied via the API call
    setShowFiltersModal(false)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-center mb-8">Loading Admin Dashboard</h1>
          <div className="flex justify-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-red-500 mb-2">Error</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => fetchApplications()}>
              Try Again
            </Button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
            <p className="text-gray-500">Manage and process loan applications</p>
          </div>
        
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Applications</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
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
                  <p className="text-3xl font-bold">{stats.needsAttention}</p>
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
                  <p className="text-3xl font-bold">{stats.approved}</p>
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
                  <p className="text-3xl font-bold">{stats.pendingReview}</p>
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
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>{statusFilter && statusFilter !== "all" ? `Status: ${statusFilter.replace("_", " ")}` : "Filter by Status"}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
                <SelectItem value="pre_approved">Pre Approved</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="needs_attention">Needs Attention</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setShowFiltersModal(true)}>
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="text-base py-3">
              All ({tabCounts.all})
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-base py-3">
              Pending ({tabCounts.pending})
            </TabsTrigger>
            <TabsTrigger value="processing" className="text-base py-3">
              Processing ({tabCounts.processing})
            </TabsTrigger>
            <TabsTrigger value="attention" className="text-base py-3">
              Needs Attention ({tabCounts.attention})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-base py-3">
              Completed ({tabCounts.completed})
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
                        <TableRow key={app._id} className={app.status === "needs_attention" ? "bg-red-50" : ""}>
                          <TableCell className="font-medium">{app._id.substring(0, 8)}</TableCell>
                          <TableCell>{app.personal.fullName}</TableCell>
                          <TableCell>{app.financial.currentLender || "N/A"}</TableCell>
                          <TableCell>{formatCurrency(app.loanRequirements.loanAmount)}</TableCell>
                          <TableCell>{getStatusBadge(app.status)}</TableCell>
                          <TableCell>{getPriorityBadge(app.priority)}</TableCell>
                          <TableCell>{formatDate(app.createdAt)}</TableCell>
                          <TableCell>{formatDate(app.updatedAt)}</TableCell>
                        
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewApplication(app._id)}
                                title="View Application"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                         
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

        {/* Pagination controls */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} applications
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Advanced Filters Dialog */}
        <Dialog open={showFiltersModal} onOpenChange={setShowFiltersModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Advanced Filters</DialogTitle>
              <DialogDescription>Filter applications by multiple criteria</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <SelectLabel htmlFor="lender-filter">Lender</SelectLabel>
                <Select
                  value={filterOptions.lender || ""}
                  onValueChange={(value) => setFilterOptions({ ...filterOptions, lender: value || null })}
                >
                  <SelectTrigger id="lender-filter">
                    <SelectValue placeholder="Select lender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Lenders</SelectItem>
                    {uniqueLenders.map((lender) => (
                      <SelectItem key={lender} value={lender}>
                        {lender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <SelectLabel htmlFor="priority-filter">Priority</SelectLabel>
                <Select
                  value={filterOptions.priority || ""}
                  onValueChange={(value) => setFilterOptions({ ...filterOptions, priority: value || null })}
                >
                  <SelectTrigger id="priority-filter">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
        
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <SelectLabel htmlFor="date-from">Date From</SelectLabel>
                  <Input
                    id="date-from"
                    type="date"
                    value={filterOptions.dateRange.from || ""}
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        dateRange: { ...filterOptions.dateRange, from: e.target.value || null },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <SelectLabel htmlFor="date-to">Date To</SelectLabel>
                  <Input
                    id="date-to"
                    type="date"
                    value={filterOptions.dateRange.to || ""}
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        dateRange: { ...filterOptions.dateRange, to: e.target.value || null },
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
              <Button onClick={applyFilters}>Apply Filters</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}