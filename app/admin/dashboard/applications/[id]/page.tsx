
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Eye,
  Download,
  Upload,
  Plus,
  ArrowLeft,
  Edit,
  AlertTriangle,
  FileText,
  User,
  Mail,
  Phone,
  Home,
  Briefcase,
  DollarSign,
  CreditCard,
  Building,
} from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import AdminLayout from "@/components/layouts/AdminLayout"
import api from "@/lib/axios"

// Interfaces
interface TimelineEvent {
  status: string
  description: string
  date: string
  changedBy: string
}

interface Document {
  id: string
  name: string
  status: "pending" | "verified" | "rejected"
  uploadDate: string
  url?: string
}

interface AdditionalDocument {
  id: string
  name: string
  status: "requested" | "pending" | "verified" | "rejected"
  requestedAt: string
  uploadedFiles: string[]
}

interface LoanApplication {
  _id: string
  status: string
  priority: string
  assignedTo: string
  documentsComplete: boolean
  personal: {
    fullName: string
    email: string
    phone: string
    dateOfBirth: string
    maritalStatus: string
    dependents: number
  }
  employment: {
    employmentStatus: string
    employerName: string
    jobTitle: string
    annualIncome: number
  }
  financial: {
    currentLender: string
    currentInterestRate: number
  }
  property: {
    propertyAddress: string
  }
  loanRequirements: {
    loanAmount: number
    loanType: string
  }
  timeline: TimelineEvent[]
  documents: Document[]
  additionalDocuments: AdditionalDocument[]
  dateSubmitted: string
  lastUpdated: string
}

// StatusBadge Component
const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { color: string; label: string }> = {
    draft: { color: "bg-gray-200 text-gray-800", label: "Draft" },
    submitted: { color: "bg-blue-200 text-blue-800", label: "Submitted" },
    pending_review: { color: "bg-yellow-200 text-yellow-800", label: "Pending Review" },
    document_verification: { color: "bg-purple-200 text-purple-800", label: "Document Verification" },
    lender_submission: { color: "bg-indigo-200 text-indigo-800", label: "Lender Submission" },
    lender_assessment: { color: "bg-cyan-200 text-cyan-800", label: "Lender Assessment" },
    approved: { color: "bg-green-200 text-green-800", label: "Approved" },
    rejected: { color: "bg-red-200 text-red-800", label: "Rejected" },
    needs_attention: { color: "bg-orange-200 text-orange-800", label: "Needs Attention" },
    note: { color: "bg-gray-100 text-gray-600", label: "Note" },
  }

  const statusInfo = statusMap[status] || { color: "bg-gray-200 text-gray-800", label: status }
  return <Badge className={`${statusInfo.color} font-medium`}>{statusInfo.label}</Badge>
}

export default function LoanApplicationDetails() {
  const router = useRouter()
  const [loanInfo, setLoanInfo] = useState<LoanApplication | any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [newNote, setNewNote] = useState("")
  const [statusUpdate, setStatusUpdate] = useState("")
  const [documentRequest, setDocumentRequest] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [additionalDocs, setAdditionalDocs] = useState<AdditionalDocument[]>([])
  const params = useParams()
  // Fetch loan application details
  const fetchLoanInfo = async () => {
    try {
      setLoading(true)
      const { data } = await api.get(`/admin/applications/${params.id}`)
      if (data.success) {
        setLoanInfo(data.application)
        setStatusUpdate(data.application.status)
        fetchAdditionalDocuments()
      } else {
        setError("Failed to fetch application details")
      }
    } catch (err) {
      console.error("Error fetching application:", err)
      setError("An error occurred while fetching application")
    } finally {
      setLoading(false)
    }
  }

  // Fetch additional documents
  const fetchAdditionalDocuments = async () => {
    try {
      const { data } = await api.get(`/admin/applications/${params.id}/additional`)
      if (data.success) {
        setAdditionalDocs(data.additionalDocuments || [])
      }
    } catch (err) {
      console.error("Error fetching additional documents:", err)
      toast({
        title: "Error",
        description: "Failed to fetch additional documents",
        variant: "destructive",
      })
    }
  }

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!loanInfo || !statusUpdate) return
    try {
      const { data } = await api.patch(`/admin/applications/${params.id}`, {
        status: statusUpdate,
        $push: {
          timeline: {
            status: statusUpdate,
            description: `Status changed to ${statusUpdate}`,
            date: new Date().toISOString(),
            changedBy: "Admin",
          },
        },
      })
      if (data.success) {
        setLoanInfo(data.application)
        toast({
          title: "Status updated",
          description: `Application status changed to ${statusUpdate}`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update status",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error updating status:", err)
      toast({
        title: "Error",
        description: "An error occurred while updating status",
        variant: "destructive",
      })
    }
  }

  // Handle adding a note
  const handleAddNote = async () => {
    if (!newNote.trim() || !loanInfo) return
    try {
      const { data } = await api.patch(`/admin/applications/${params.id}`, {
        $push: {
          timeline: {
            status: "note",
            description: newNote,
            date: new Date().toISOString(),
            changedBy: "Admin",
          },
        },
      })
      if (data.success) {
        setLoanInfo(data.application)
        setNewNote("")
        toast({
          title: "Note added",
          description: "Your note has been added to the timeline",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to add note",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error adding note:", err)
      toast({
        title: "Error",
        description: "An error occurred while adding note",
        variant: "destructive",
      })
    }
  }

  // Handle requesting a new document
  const handleRequestDocument = async () => {
    if (!documentRequest.trim() || !loanInfo) return
    try {
      const { data } = await api.post(`/admin/applications/${params.id}/additional`, {
        documentName: documentRequest,
        status: "requested",
      })
      if (data.success) {
        setLoanInfo(data.application)
        setDocumentRequest("")
        fetchAdditionalDocuments()
        toast({
          title: "Document requested",
          description: `Requested ${documentRequest} from applicant`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to request document",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error requesting document:", err)
      toast({
        title: "Error",
        description: "An error occurred while requesting document",
        variant: "destructive",
      })
    }
  }

  // Handle file upload
  const handleFileUpload = async () => {
    if (!selectedFile || !loanInfo) return
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      const { data } = await api.post(`/admin/applications/${params.id}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      if (data.success) {
        setLoanInfo(data.application)
        setSelectedFile(null)
        fetchAdditionalDocuments()
        toast({
          title: "Document uploaded",
          description: "Document has been uploaded successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to upload document",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error uploading document:", err)
      toast({
        title: "Error",
        description: "An error occurred while uploading document",
        variant: "destructive",
      })
    }
  }

  // Update document status
  const updateDocumentStatus = async (docId: string, status: "verified" | "rejected") => {
    try {
      const { data } = await api.patch(`/admin/applications/${params.id}/documents/${docId}`, { status })
      if (data.success) {
        setLoanInfo(data.application)
        fetchAdditionalDocuments()
        toast({
          title: "Document status updated",
          description: `Document status changed to ${status}`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update document status",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error updating document status:", err)
      toast({
        title: "Error",
        description: "An error occurred while updating document status",
        variant: "destructive",
      })
    }
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    return <StatusBadge status={status} />
  }

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    const priorityMap: Record<string, { color: string }> = {
      high: { color: "bg-red-200 text-red-800" },
      medium: { color: "bg-yellow-200 text-yellow-800" },
      low: { color: "bg-green-200 text-green-800" },
    }
    const priorityInfo = priorityMap[priority] || { color: "bg-gray-200 text-gray-800" }
    return (
      <Badge className={`${priorityInfo.color} font-medium capitalize`}>{priority} Priority</Badge>
    )
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Fetch data on mount
  useEffect(() => {
    fetchLoanInfo()
  }, [params.id])

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Error state
  if (error || !loanInfo) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">{error || "Application not found"}</h3>
        <Button className="mt-4" onClick={fetchLoanInfo}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <Button variant="ghost" className="mb-2 hover:bg-gray-100 -ml-4" asChild>
              <Link href="/admin/dashboard/applications" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Applications
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Loan Application #{params.id}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {getStatusBadge(loanInfo.status)}
              {getPriorityBadge(loanInfo.priority)}
              {loanInfo.documentsComplete ? (
                <Badge className="bg-green-200 text-green-800">Documents Complete</Badge>
              ) : (
                <Badge className="bg-yellow-200 text-yellow-800">Documents Incomplete</Badge>
              )}
            </div>
          </div>

        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Application Summary</CardTitle>
                <CardDescription>
                  Submitted on {formatDate(loanInfo.dateSubmitted)} • Last updated{" "}
                  {formatDate(loanInfo.lastUpdated)}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                {/* Loan Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Loan Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Loan Amount</p>
                        <p className="text-lg font-semibold">
                          ${loanInfo.loanRequirements.loanAmount.toLocaleString() || "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Loan Purpose</p>
                        <p className="text-lg font-semibold capitalize">
                          {loanInfo.loanRequirements.loanPurpose || "Not specified"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Loan Term</p>
                        <p className="text-lg font-semibold">
                          {loanInfo.loanRequirements.loanTerm || "N/A"} years
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Interest Rate Preference</p>
                        <p className="text-lg font-semibold capitalize">
                          {loanInfo.loanRequirements.interestRatePreference || "Not specified"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Loan Type</p>
                        <p className="text-lg font-semibold capitalize">
                          {loanInfo.loanRequirements.loanType.replace("_", " ") || "Not specified"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Fixed Rate Term</p>
                        <p className="text-lg font-semibold">
                          {loanInfo.loanRequirements.fixedRateTerm || "N/A"} years
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal and Employment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Personal Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-gray-500" />
                          <p>Full Name: {loanInfo.personal.fullName || "N/A"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-gray-500" />
                          <p>Email: {loanInfo.personal.email || "N/A"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-gray-500" />
                          <p>Phone: {loanInfo.personal.phone || "N/A"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <p>Date of Birth: {loanInfo.personal.dateOfBirth || "N/A"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <p>Marital Status: {loanInfo.personal.maritalStatus || "N/A"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <p>Dependents: {loanInfo.personal.dependents || "0"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Employment Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <p>Employment Status: {loanInfo.employment.employmentStatus || "N/A"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Briefcase className="h-5 w-5 text-gray-500" />
                          <p>Employer: {loanInfo.employment.employerName || "N/A"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <p>Job Title: {loanInfo.employment.jobTitle || "N/A"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <p>Years in Job: {loanInfo.employment.yearsInCurrentJob || "0"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-gray-500" />
                          <p>
                            Annual Income: ${loanInfo.employment.annualIncome.toLocaleString() || "0"}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-gray-500" />
                          <p>
                            Additional Income: $
                            {loanInfo.employment.additionalIncome.toLocaleString() || "0"}
                          </p>
                        </div>
                        {loanInfo.employment.isSelfEmployed && (
                          <>
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-gray-500" />
                              <p>Business Type: {loanInfo.employment.businessType || "N/A"}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-gray-500" />
                              <p>ABN/ACN: {loanInfo.employment.abnAcn || "N/A"}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-gray-500" />
                              <p>Business Industry: {loanInfo.employment.businessIndustry || "N/A"}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <DollarSign className="h-5 w-5 text-gray-500" />
                              <p>
                                Business Revenue: $
                                {loanInfo.employment.annualBusinessRevenue.toLocaleString() || "0"}
                              </p>
                            </div>
                          </>
                        )}
                        {loanInfo.employment.hasPartner && (
                          <>
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-gray-500" />
                              <p>
                                Partner Employment Status:{" "}
                                {loanInfo.employment.partnerEmploymentStatus || "N/A"}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Briefcase className="h-5 w-5 text-gray-500" />
                              <p>Partner Employer: {loanInfo.employment.partnerEmployerName || "N/A"}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-gray-500" />
                              <p>Partner Job Title: {loanInfo.employment.partnerJobTitle || "N/A"}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-gray-500" />
                              <p>
                                Partner Years in Job:{" "}
                                {loanInfo.employment.partnerYearsInCurrentJob || "0"}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <DollarSign className="h-5 w-5 text-gray-500" />
                              <p>
                                Partner Annual Income: $
                                {loanInfo.employment.partnerAnnualIncome.toLocaleString() || "0"}
                              </p>
                            </div>
                            {loanInfo.employment.partnerIsSelfEmployed && (
                              <>
                                <div className="flex items-center gap-3">
                                  <FileText className="h-5 w-5 text-gray-500" />
                                  <p>
                                    Partner Business Type: {loanInfo.employment.partnerBusinessType || "N/A"}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <FileText className="h-5 w-5 text-gray-500" />
                                  <p>Partner ABN/ACN: {loanInfo.employment.partnerAbnAcn || "N/A"}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <FileText className="h-5 w-5 text-gray-500" />
                                  <p>
                                    Partner Business Industry:{" "}
                                    {loanInfo.employment.partnerBusinessIndustry || "N/A"}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <DollarSign className="h-5 w-5 text-gray-500" />
                                  <p>
                                    Partner Business Revenue: $
                                    {loanInfo.employment.partnerAnnualBusinessRevenue.toLocaleString() ||
                                      "0"}
                                  </p>
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Financial and Property */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Financial Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <p>Credit Score: {loanInfo.financial.creditScore || "N/A"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-gray-500" />
                          <p>
                            Monthly Expenses: ${loanInfo.financial.monthlyExpenses.toLocaleString() || "0"}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-gray-500" />
                          <p>Existing Debts: ${loanInfo.financial.existingDebts.toLocaleString() || "0"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <p>Bankruptcy History: {loanInfo.financial.bankruptcyHistory || "N/A"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-gray-500" />
                          <p>Savings: ${loanInfo.financial.savingsBalance.toLocaleString() || "0"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-gray-500" />
                          <p>Investments: ${loanInfo.financial.investments.toLocaleString() || "0"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-gray-500" />
                          <p>Other Assets: ${loanInfo.financial.otherAssets.toLocaleString() || "0"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-gray-500" />
                          <p>
                            Current Mortgage: ${loanInfo.financial.currentMortgage.toLocaleString() || "0"}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <p>Current Lender: {loanInfo.financial.currentLender || "N/A"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <p>
                            Current Interest Rate: {loanInfo.financial.currentInterestRate || "0"}%
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <p>Current Loan Term: {loanInfo.financial.currentLoanTerm || "0"} years</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <p>
                            Remaining Loan Term: {loanInfo.financial.remainingLoanTerm || "0"} years
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <p>Fixed Rate Expiry: {loanInfo.financial.fixedRateExpiry || "N/A"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-gray-500" />
                          <p>Exit Fees: ${loanInfo.financial.exitFees.toLocaleString() || "0"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Property Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <p>Type: {loanInfo.property.propertyType || "N/A"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-gray-500" />
                          <p>Value: ${loanInfo.property.propertyValue.toLocaleString() || "0"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Home className="h-5 w-5 text-gray-500" />
                          <p>Address: {loanInfo.property.propertyAddress || "N/A"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <p>Usage: {loanInfo.property.propertyUsage || "N/A"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <p>Age: {loanInfo.property.propertyAge || "0"} years</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <p>Bedrooms: {loanInfo.property.bedrooms || "0"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <p>Bathrooms: {loanInfo.property.bathrooms || "0"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-gray-500" />
                          <p>
                            Current Mortgage: ${loanInfo.property.currentMortgage.toLocaleString() || "0"}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <p>Current Lender: {loanInfo.property.currentLender || "N/A"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <p>Current Interest Rate: {loanInfo.property.currentInterestRate || "0"}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Additional Features */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Additional Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(loanInfo.additionalFeatures).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <p>
                            {key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())
                              .trim()}
                            : {value ? "Yes" : "No"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>
                  {loanInfo.documentsComplete ? "All documents verified" : "Documents pending verification"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Main Documents */}
                  <div>
                    <h3 className="font-medium mb-4">Required Documents</h3>
                    {Array.isArray(loanInfo.documents) && loanInfo.documents.length > 0 ? (
                      <div className="space-y-2">
                        {loanInfo.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-gray-500" />
                              <div>
                                <p className="font-medium">{doc.name}</p>
                                <p className="text-sm text-gray-500">
                                  Uploaded: {formatDate(doc.uploadDate)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  doc.status === "verified"
                                    ? "success"
                                    : doc.status === "rejected"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {doc.status}
                              </Badge>
                              {doc.url && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(doc.url, "_blank")}
                                >
                                  <Eye className="h-4 w-4 mr-1" /> View
                                </Button>
                              )}
                              <Select
                                value={doc.status}
                                onValueChange={(value) =>
                                  updateDocumentStatus(doc.id, value as "verified" | "rejected")
                                }
                              >
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="verified">Verify</SelectItem>
                                  <SelectItem value="rejected">Reject</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No required documents available</p>
                    )}
                  </div>

                  {/* Additional Documents */}
                  <div>
                    <h3 className="font-medium mb-4">Additional Documents</h3>
                    {Array.isArray(additionalDocs) && additionalDocs.length > 0 ? (
                      <div className="space-y-2">
                        {additionalDocs.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-gray-500" />
                              <div>
                                <p className="font-medium">{doc.name}</p>
                                <p className="text-sm text-gray-500">
                                  Requested: {formatDate(doc.requestedAt)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  doc.status === "verified"
                                    ? "success"
                                    : doc.status === "rejected"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {doc.status}
                              </Badge>
                              {Array.isArray(doc.uploadedFiles) && doc.uploadedFiles.length > 0 ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(doc.uploadedFiles[0], "_blank")}
                                >
                                  <Eye className="h-4 w-4 mr-1" /> View
                                </Button>
                              ) : (
                                <Badge variant="outline">Pending Upload</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No additional documents requested</p>
                    )}
                  </div>

                  {/* Request New Document */}
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-4">Request Additional Document</h3>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Document name"
                        value={documentRequest}
                        onChange={(e) => setDocumentRequest(e.target.value)}
                      />
                      <Button onClick={handleRequestDocument} disabled={!documentRequest.trim()}>
                        <Plus className="h-4 w-4 mr-1" /> Request
                      </Button>
                    </div>
                  </div>

                  {/* Upload Document */}
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-4">Upload Document</h3>
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      />
                      <Button onClick={handleFileUpload} disabled={!selectedFile}>
                        <Upload className="h-4 w-4 mr-1" /> Upload
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
                <CardDescription>History of all actions and status changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Array.isArray(loanInfo.timeline) && loanInfo.timeline.length > 0 ? (
                    loanInfo.timeline.map((event, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                          {index < loanInfo.timeline.length - 1 && (
                            <div className="w-0.5 h-12 bg-gray-200" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <StatusBadge status={event.status} />
                            <span className="text-sm text-gray-500">
                              {formatDate(event.date)}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{event.description}</p>
                          <p className="text-xs text-gray-500 mt-1">By: {event.changedBy}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No timeline events available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Manage application status and add notes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Update Status */}
                <div>
                  <h3 className="font-medium mb-2">Update Status</h3>
                  <div className="flex gap-2">
                    <Select value={statusUpdate} onValueChange={setStatusUpdate}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="pending_review">Pending Review</SelectItem>
                        <SelectItem value="document_verification">Document Verification</SelectItem>
                        <SelectItem value="lender_submission">Lender Submission</SelectItem>
                        <SelectItem value="lender_assessment">Lender Assessment</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="needs_attention">Needs Attention</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleStatusUpdate} disabled={!statusUpdate}>
                      Update Status
                    </Button>
                  </div>
                </div>

                {/* Add Note */}
                <div>
                  <h3 className="font-medium mb-2">Add Note</h3>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add a note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                      Add Note
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>


        </Tabs>
      </div>
    </AdminLayout>
  )
}
