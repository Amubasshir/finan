
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Switch } from '@headlessui/react';
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
  CheckCircle,
  Circle,
} from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import AdminLayout from "@/components/layouts/AdminLayout"
import api from "@/lib/axios"
const LABELS = {
  selectPriority: "Select priority",
  highPriority: "High",
  mediumPriority: "Medium",
  lowPriority: "Low",
  updating: "Updating...",
  updatePriority: "Update Priority",
};
// Interfaces
interface TimelineEvent {
  status: string
  description: string
  date: string
  changedBy: string
}

interface UploadedFile {
  id: string
  name: string
  size: number
  uploadDate: string
  url: string
  cloudinaryId: string
  _id: string
  status?: "pending" | "verified" | "rejected"
  signRequiredRequested?: boolean
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
  uploadedFiles: [UploadedFile]
}

interface LoanApplication {
  _id: string
  status: string
  priority: string

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
    draft: { color: "bg-gray-200 text-gray-800 capitalize", label: "Draft" },
    submitted: { color: "bg-blue-200 text-blue-800 capitalize", label: "Submitted" },

    approved: { color: "bg-green-200 text-green-800 capitalize", label: "Approved" },
    rejected: { color: "bg-red-200 text-red-800 capitalize", label: "Rejected" },
    needs_attention: { color: "bg-orange-200 text-orange-800 capitalize", label: "Needs Attention" },
  }

  const statusInfo = statusMap[status] || { color: "bg-gray-200 text-gray-800 capitalize", label: status }
  return <Badge className={`${statusInfo.color} font-medium capitalize`}>{statusInfo.label}</Badge>
}

// LoadingSpinner Component
const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
)

// Base predefined timeline statuses (excluding terminal statuses)
const baseTimelineStatuses = [
  "draft",
  "pending_review",
  "pre_approved",
  "needs_attention",
]

export default function LoanApplicationDetails() {
  const router = useRouter()
  const [loanInfo, setLoanInfo] = useState<LoanApplication | any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [newNote, setNewNote] = useState("")
  const [statusUpdate, setStatusUpdate] = useState("")
  const [additionalDocumentRequestData, setAdditionalDocumentRequestData] = useState<any>({ category: "additional", name: "" })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [additionalDocs, setAdditionalDocs] = useState<any[]>([])
  const [documents, setDocuments] = useState<any>([])
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const params = useParams()

  // Centralized loading state for all API calls
  const [apiLoading, setApiLoading] = useState<Record<string, boolean>>({
    fetchLoanInfo: false,
    fetchDocuments: false,
    handleStatusUpdate: false,
    handleAddNote: false,
    handleRequestDocument: false,
  })

  // State for document status loading
  const [documentStatusLoading, setDocumentStatusLoading] = useState<Record<string, boolean>>({})
  const [additionalDocStatusLoading, setAdditionalDocStatusLoading] = useState<Record<string, boolean>>({})

  // Dynamic timeline statuses based on current status
  const getTimelineStatuses = () => {
    if (!loanInfo) return baseTimelineStatuses
    if (loanInfo.status === "approved") {
      return [...baseTimelineStatuses, "approved"].filter(status => status !== "rejected")
    } else if (loanInfo.status === "rejected") {
      return [...baseTimelineStatuses, "rejected"].filter(status => status !== "approved")
    } else {
      return [...baseTimelineStatuses, "approved", "rejected"].filter(status => status !== "rejected")
    }
  }

  // Fetch loan application details
  const fetchLoanInfo = async () => {
    try {
      setApiLoading(prev => ({ ...prev, fetchLoanInfo: true }))
      const { data } = await api.get(`/admin/applications/${params.id}`)
      if (data.success) {
        setLoanInfo(data.application)
        setStatusUpdate(data.application.status)
        await fetchDocuments()
      } else {
        setError("Failed to fetch application details")
      }
    } catch (err) {
      console.error("Error fetching application:", err)
      setError("An error occurred while fetching application")
    } finally {
      setApiLoading(prev => ({ ...prev, fetchLoanInfo: false }))
      setLoading(false)
    }
  }

  // Fetch additional documents
  const fetchDocuments = async () => {
    try {
      setApiLoading(prev => ({ ...prev, fetchDocuments: true }))
      const { data } = await api.get(`/admin/applications/${params.id}/additional`)
      // console.log(data.documents)
      if (data.success) {
        setAdditionalDocs(data.additionalDocuments || [])
        setDocuments(data.documents || [])
      }
    } catch (err) {
      console.error("Error fetching documents:", err)
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      })
    } finally {
      setApiLoading(prev => ({ ...prev, fetchDocuments: false }))
    }
  }

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!loanInfo || !statusUpdate) return

    try {
      setApiLoading(prev => ({ ...prev, handleStatusUpdate: true }))
      const payload = {
        status: statusUpdate,
        timeline: {
          status: statusUpdate,
          description: `Status changed to ${statusUpdate}`,
          date: new Date().toISOString(),
          changedBy: "Admin",
        },
      }

      const { data } = await api.patch(`/admin/applications/${params.id}`, payload)

      if (data.success) {
        setLoanInfo(data.application)
        toast({
          title: "Status updated",
          description: `Application status changed to ${statusUpdate}`,
        })
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update status",
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
    } finally {
      setApiLoading(prev => ({ ...prev, handleStatusUpdate: false }))
    }
  }



  // Handle requesting additional document
  const handleRequestDocument = async () => {
    // Reset errors first
    setFormErrors({})

    // Collect all validation errors
    const errors: Record<string, string> = {}

    if (!additionalDocumentRequestData.name?.trim()) {
      errors.name = "Document name is required"
    }

    if (!additionalDocumentRequestData.category) {
      errors.category = "Category is required"
    }

    if (!additionalDocumentRequestData.description?.trim()) {
      errors.description = "Description is required"
    }

    if (!additionalDocumentRequestData.deadline) {
      errors.deadline = "Deadline is required"
    }

    // If there are errors, set them and stop form submission
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      setApiLoading(prev => ({ ...prev, handleRequestDocument: true }))
      const { data } = await api.post(`/admin/applications/${params.id}/additional`, {
        ...additionalDocumentRequestData,
        requestedBy: "Admin",
        requestedAt: new Date().toISOString(),
        status: "requested",
      })
      if (data.success) {
        setAdditionalDocumentRequestData({ category: "additional", name: "" })
        await fetchDocuments()
        toast({
          title: "Document requested",
          description: `Successfully requested ${additionalDocumentRequestData.name} from applicant`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to request document",
          variant: "destructive",
        })
      }
    } catch (err: any) {
      console.error("Error requesting document:", err)
      toast({
        title: "Error",
        description: err?.response?.data?.message || "An error occurred while requesting document",
        variant: "destructive",
      })
    } finally {
      setApiLoading(prev => ({ ...prev, handleRequestDocument: false }))
    }
  }

  // Update document status with loading spinner
  const updateDocumentStatus = async (docId: string, status: "verified" | "rejected") => {
    try {
      // console.log(docId, status)
      setDocumentStatusLoading(prev => ({ ...prev, [docId]: true }))
      const { data } = await api.patch(`/admin/applications/${params.id}/documents/${docId}`, { status })
      if (data.success) {
        await fetchDocuments()
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
    } finally {
      setDocumentStatusLoading(prev => ({ ...prev, [docId]: false }))
    }
  }

  // Update additional document status with loading spinner
  const updateAdditionalDocumentStatus = async (docId: string, status: "verified" | "rejected") => {
    try {
      setAdditionalDocStatusLoading(prev => ({ ...prev, [docId]: true }))
      const { data } = await api.patch(`/admin/applications/${params.id}/additional/${docId}`, { status })
      if (data.success) {

        await fetchDocuments()
        toast({
          title: "Document status updated",
          description: `Additional document status changed to ${status}`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update additional document status",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error updating additional document status:", err)
      toast({
        title: "Error",
        description: "An error occurred while updating additional document status",
        variant: "destructive",
      })
    } finally {
      setAdditionalDocStatusLoading(prev => ({ ...prev, [docId]: false }))
    }
  }


  // Toggle sign required for regular document
  const toggleSignRequired = async (docId: string, currentValue: boolean) => {
    try {
      setDocumentStatusLoading(prev => ({ ...prev, [`sign_${docId}`]: true }));

      const { data } = await api.patch(`/admin/applications/${params.id}/documents/${docId}`, {
        signRequiredRequested: !currentValue
      });

      if (data.success) {
        await fetchDocuments();
        toast({
          title: "Document updated",
          description: `Signature requirement ${!currentValue ? 'enabled' : 'disabled'}`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update document",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error updating document:", err);
      toast({
        title: "Error",
        description: "An error occurred while updating document",
        variant: "destructive",
      });
    } finally {
      setDocumentStatusLoading(prev => ({ ...prev, [`sign_${docId}`]: false }));
    }
  };

  // Toggle sign required for additional document
  const toggleAdditionalSignRequired = async (docId: string, currentValue: boolean) => {
    try {
      setAdditionalDocStatusLoading(prev => ({ ...prev, [`sign_${docId}`]: true }));

      const { data } = await api.patch(`/admin/applications/${params.id}/additional/${docId}`, {
        signRequiredRequested: !currentValue
      });

      if (data.success) {
        await fetchDocuments();
        toast({
          title: "Document updated",
          description: `Signature requirement ${!currentValue ? 'enabled' : 'disabled'}`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update document",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error updating document:", err);
      toast({
        title: "Error",
        description: "An error occurred while updating document",
        variant: "destructive",
      });
    } finally {
      setAdditionalDocStatusLoading(prev => ({ ...prev, [`sign_${docId}`]: false }));
    }
  };



  // Function to update priority
  const updatePriority = async (newPriority: string) => {
    try {
      setApiLoading(prev => ({ ...prev, updatePriority: true })); // Set loading state
      const { data } = await api.post(`/admin/applications/${params.id}/update-priority`, { priority: newPriority });
      if (data.success) {
        setLoanInfo((prev: any) => ({ ...prev, priority: newPriority }));
        toast({
          title: "Priority updated",
          description: `Application priority changed to ${newPriority}`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update priority",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error updating priority:", err);
      toast({
        title: "Error",
        description: "An error occurred while updating priority",
        variant: "destructive",
      });
    } finally {
      setApiLoading(prev => ({ ...prev, updatePriority: false })); // Reset loading state
    }
  };

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

  // Determine if a status is "done" based on position in timelineStatuses
  const isStatusDone = (status: string) => {
    if (!loanInfo) return false
    const timelineStatuses = getTimelineStatuses()
    const currentStatusIndex = timelineStatuses.indexOf(loanInfo.status)
    const statusIndex = timelineStatuses.indexOf(status)

    // Mark as done if the status is at or before the current status
    return statusIndex <= currentStatusIndex
  }

  // Fetch data on mount
  useEffect(() => {
    fetchLoanInfo()
  }, [params.id])

  // Loading state for initial fetch
  if (loading || apiLoading.fetchLoanInfo) {
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
          {apiLoading.fetchLoanInfo ? (
            <>
              <LoadingSpinner />
              Retrying...
            </>
          ) : (
            "Retry"
          )}
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
              <Link href="/admin/dashboard" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Applications
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Loan Application #{params.id}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {getStatusBadge(loanInfo.status)}
              {getPriorityBadge(loanInfo.priority)}
              {loanInfo.status == "approved" ? (
                <Badge className="bg-green-200 text-green-800">Documents Complete</Badge>
              ) : (
                <Badge className="bg-yellow-200 text-yellow-800">Documents Incomplete</Badge>
              )}
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="timeline">Timeline & Actions</TabsTrigger>

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
                      {Object.entries(loanInfo.additionalFeatures || {}).map(([key, value]) => (
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
                <div className="space-y-4">

                  {/* Required Documents */}
                  <div>
                    <h3 className="font-medium mb-4">Required Documents</h3>
                    {Array.isArray(documents) && documents.length > 0 ? (
                      <div className="space-y-4">
                        {/* Group documents by category */}
                        {Object.entries(
                          documents.reduce((acc, doc) => {
                            const category = doc.category || "other"
                            if (!acc[category]) acc[category] = []
                            acc[category].push(doc)
                            return acc
                          }, {} as Record<string, any[]>)
                        ).map(([category, docs]) => (
                          <div key={category} className="border rounded-lg overflow-hidden">
                            <div
                              className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer"
                              onClick={() => {
                                const elem = document.getElementById(`document-category-${category}`)
                                if (elem) {
                                  elem.classList.toggle("hidden")
                                }
                              }}
                            >
                              <div className="flex items-center gap-2 font-medium capitalize">
                                {category === "identity" ? (
                                  <User className="h-4 w-4 text-gray-500" />
                                ) : category === "financial" ? (
                                  <DollarSign className="h-4 w-4 text-gray-500" />
                                ) : category === "property" ? (
                                  <Home className="h-4 w-4 text-gray-500" />
                                ) : (
                                  <FileText className="h-4 w-4 text-gray-500" />
                                )}
                                {category.replace("_", " ")}
                              </div>
                              <div className="flex items-center gap-2">
                                {docs.every(doc => doc.uploadedFiles && doc.uploadedFiles.length > 0) ? (
                                  <Badge variant="success" className="bg-green-100 text-green-800">Uploaded</Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Incomplete</Badge>
                                )}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="chevron-down"
                                >
                                  <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                              </div>
                            </div>
                            <div id={`document-category-${category}`} className="divide-y">
                              {docs.map((doc) => (
                                <div key={doc._id} className="p-3">
                                  <div className="flex items-center gap-3 mb-2">
                                    <FileText className="h-5 w-5 text-gray-500" />
                                    <div>
                                      <p className="font-medium">{doc.name}</p>
                                      <p className="text-sm text-gray-500">{doc.description}</p>
                                    </div>
                                  </div>
                                  {Array.isArray(doc.uploadedFiles) && doc.uploadedFiles.length > 0 ? (
                                    doc.uploadedFiles.map((file) => (
                                      <div
                                        key={file._id}
                                        className="flex items-center justify-between p-3 pl-8 hover:bg-gray-100 rounded transition-colors"
                                      >
                                        <div className="flex items-center gap-3">
                                          <FileText className="h-4 w-4 text-gray-500" />
                                          <div>
                                            <p className="text-sm">{file.name}</p>
                                            <p className="text-xs text-gray-500">
                                              Uploaded: {formatDate(file.updatedAt || new Date())}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">


                                          {documentStatusLoading[file._id] ? (
                                            <div className="w-[120px] flex items-center justify-center">
                                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                            </div>
                                          ) : (
                                            <Select
                                              value={file.status || "pending"}
                                              onValueChange={(value) =>
                                                updateDocumentStatus(file._id, value as "verified" | "rejected")
                                              }
                                            >
                                              <SelectTrigger className="w-[120px]">
                                                <SelectValue placeholder="Status" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="uploaded">Uploaded</SelectItem>
                                                <SelectItem value="verified">Verified</SelectItem>
                                                <SelectItem value="rejected">Rejected</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          )}
                                          <div className="flex items-center ml-2">
                                            <Switch
                                              checked={file.signRequiredRequested || false}
                                              onChange={() => toggleSignRequired(file._id, file.signRequiredRequested || false)}
                                              className={`${documentStatusLoading[`sign_${file._id}`] ? 'bg-gray-400' : 'bg-blue-600'
                                                } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none`}
                                              disabled={documentStatusLoading[`sign_${file._id}`]}
                                            >
                                              <span
                                                className={`${file.signRequiredRequested ? 'translate-x-6' : 'translate-x-1'
                                                  } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                                              />
                                            </Switch>




                                            {documentStatusLoading[`sign_${file._id}`] && (
                                              <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                            )}
                                            <span className="ml-2 text-xs text-gray-500">Signature</span>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => window.open(file.url, "_blank")}
                                          >
                                            <Eye className="h-4 w-4 mr-1" /> View
                                          </Button>
                                        </div>
                                      </div>
                                    ))
                                  )
                                    : (
                                      <div className="p-3 pl-8">
                                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                          Pending Upload
                                        </Badge>
                                      </div>
                                    )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No required documents available</p>
                    )}
                  </div>

                  {/* Additional Documents with Categories */}
                  <div>
                    <h3 className="font-medium mb-4">Additional Documents</h3>
                    {Array.isArray(additionalDocs) && additionalDocs.length > 0 ? (
                      <div className="space-y-4">
                        {/* Group additional documents by category */}
                        {Object.entries(
                          additionalDocs.reduce((acc, doc) => {
                            const category = doc.category || "other"
                            if (!acc[category]) acc[category] = []
                            acc[category].push(doc)
                            return acc
                          }, {} as Record<string, any[]>)
                        ).map(([category, docs]) => (
                          <div key={category} className="border rounded-lg overflow-hidden">
                            <div
                              className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer"
                              onClick={() => {
                                const elem = document.getElementById(`additional-category-${category}`)
                                if (elem) {
                                  elem.classList.toggle("hidden")
                                }
                              }}
                            >
                              <div className="flex items-center gap-2 font-medium capitalize">
                                {category === "identity" ? (
                                  <User className="h-4 w-4 text-gray-500" />
                                ) : category === "financial" ? (
                                  <DollarSign className="h-4 w-4 text-gray-500" />
                                ) : category === "property" ? (
                                  <Home className="h-4 w-4 text-gray-500" />
                                ) : category === "additional" ? (
                                  <Plus className="h-4 w-4 text-gray-500" />
                                ) : (
                                  <FileText className="h-4 w-4 text-gray-500" />
                                )}
                                {category.replace("_", " ")}
                              </div>
                              <div className="flex items-center gap-2">
                                {docs.every(doc => doc.uploadedFiles && doc.uploadedFiles.length > 0) ? (
                                  <Badge variant="success" className="bg-green-100 text-green-800">Uploded</Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Incomplete</Badge>
                                )}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="chevron-down"
                                >
                                  <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                              </div>
                            </div>
                            <div id={`additional-category-${category}`} className="divide-y">
                              {docs.map((doc) => (
                                <div key={doc._id} className="p-3">
                                  <div className="flex items-center gap-3 mb-2">
                                    <FileText className="h-5 w-5 text-gray-500" />
                                    <div>
                                      <p className="font-medium">{doc.name}</p>
                                      <p className="text-sm text-gray-500">
                                        Requested: {formatDate(doc.requestedAt || new Date())}
                                      </p>
                                    </div>
                                  </div>
                                  {Array.isArray(doc.uploadedFiles) && doc.uploadedFiles.length > 0 ? (
                                    doc.uploadedFiles.map((file) => (
                                      <div
                                        key={file._id}
                                        className="flex items-center justify-between p-3 pl-8 hover:bg-gray-100 rounded transition-colors"
                                      >
                                        <div className="flex items-center gap-3">
                                          <FileText className="h-4 w-4 text-gray-500" />
                                          <div>
                                            <p className="text-sm">{file.name}</p>
                                            <p className="text-xs text-gray-500">
                                              Uploaded: {formatDate(file.uploadDate || new Date())}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">

                                          {additionalDocStatusLoading[file._id] ? (
                                            <div className="w-[120px] flex items-center justify-center">
                                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                            </div>
                                          ) : (
                                            <Select
                                              value={file.status || "pending"}
                                              onValueChange={(value) =>
                                                updateAdditionalDocumentStatus(file._id, value as "verified" | "rejected")
                                              }
                                            >
                                              <SelectTrigger className="w-[120px]">
                                                <SelectValue placeholder="Status" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="requested">Requested</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="verified">Verified</SelectItem>
                                                <SelectItem value="rejected">Rejected</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          )}
                                          <div className="flex items-center ml-2">

                                            <Switch
                                              checked={file.signRequiredRequested || false}
                                              onChange={() => toggleAdditionalSignRequired(file._id, file.signRequiredRequested || false)}
                                              className={`${additionalDocStatusLoading[`sign_${file._id}`] ? 'bg-gray-400' : 'bg-blue-600'
                                                } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none`}
                                              disabled={additionalDocStatusLoading[`sign_${file._id}`]}
                                            >
                                              <span
                                                className={`${file.signRequiredRequested ? 'translate-x-6' : 'translate-x-1'
                                                  } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                                              />
                                            </Switch>

                                            {additionalDocStatusLoading[`sign_${file._id}`] && (
                                              <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                            )}
                                            <span className="ml-2 text-xs text-gray-500">Signature</span>
                                          </div>

                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => window.open(file.url, "_blank")}
                                          >
                                            <Eye className="h-4 w-4 mr-1" /> View
                                          </Button>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="p-3 pl-8">
                                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                        Pending Upload
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No additional documents requested</p>
                    )}
                  </div>


                </div>



                {/* Request New Document */}
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-4">Request Additional Document</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="doc-name">Document Name</Label>
                      <Input
                        id="doc-name"
                        placeholder="W-2 Form, Bank Statement, etc."
                        value={additionalDocumentRequestData.name || ""}
                        onChange={(e) => setAdditionalDocumentRequestData((prev: any) => ({ ...prev, name: e.target.value }))}
                        className={formErrors.name ? "border-red-500" : ""}
                      />
                      {formErrors.name && <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>}
                    </div>

                    <div>
                      <Label htmlFor="doc-category">Category</Label>
                      <Select
                        value={additionalDocumentRequestData.category || ""}
                        onValueChange={(value) => setAdditionalDocumentRequestData((prev: any) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger id="doc-category" className={formErrors.category ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Income</SelectItem>
                          <SelectItem value="identity">Identity</SelectItem>
                          <SelectItem value="property">Property</SelectItem>
                          <SelectItem value="financial">Financial</SelectItem>
                          <SelectItem value="additional">Additional</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.category && <p className="text-sm text-red-500 mt-1">{formErrors.category}</p>}
                    </div>

                    <div>
                      <Label htmlFor="doc-description">Description</Label>
                      <Textarea
                        id="doc-description"
                        placeholder="Please provide details about what this document should contain"
                        value={additionalDocumentRequestData.description || ""}
                        onChange={(e) => setAdditionalDocumentRequestData((prev: any) => ({ ...prev, description: e.target.value }))}
                        className={formErrors.description ? "border-red-500" : ""}
                      />
                      {formErrors.description && <p className="text-sm text-red-500 mt-1">{formErrors.description}</p>}
                    </div>

                    <div>
                      <Label htmlFor="doc-deadline">Deadline</Label>
                      <Input
                        id="doc-deadline"
                        type="date"
                        value={additionalDocumentRequestData.deadline || ""}
                        onChange={(e) => setAdditionalDocumentRequestData((prev: any) => ({ ...prev, deadline: e.target.value }))}
                        className={formErrors.deadline ? "border-red-500" : ""}
                      />
                      {formErrors.deadline && <p className="text-sm text-red-500 mt-1">{formErrors.deadline}</p>}
                    </div>

                    <Button
                      onClick={handleRequestDocument}
                      disabled={apiLoading.handleRequestDocument}
                      className="w-full"
                    >
                      {apiLoading.handleRequestDocument ? (
                        <>
                          <LoadingSpinner />
                          Requesting...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-1" />
                          Request Document
                        </>
                      )}
                    </Button>
                  </div>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
         
              <CardContent>
                <Card>
            
                  <Card>
                    <CardHeader>
                      <CardTitle>Actions</CardTitle>
                      <CardDescription>Manage application status and priority</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                  

                      {/* Update Status */}
                      <div className="">
                        <div>
                          <h3 className="font-medium mb-2">Update Status</h3>
                          <div className="flex gap-2">
                            <Select value={statusUpdate} onValueChange={setStatusUpdate}>
                              <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="pending_review">Pending Review</SelectItem>
                                <SelectItem value="pre_approved">Pre Approved</SelectItem>
                                <SelectItem value="needs_attention">Needs Attention</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              onClick={handleStatusUpdate}
                              disabled={!statusUpdate || apiLoading.handleStatusUpdate}
                            >
                              {apiLoading.handleStatusUpdate ? (
                                <>
                                  <LoadingSpinner />
                                  Updating...
                                </>
                              ) : (
                                "Update Status"
                              )}
                            </Button>
                          </div>

                        </div>



                      </div>

                      <div>
  <h3 className="font-medium text-lg">Update Priority</h3>
  <CardDescription>Manage application priority</CardDescription>
  <Select onValueChange={updatePriority} value={loanInfo.priority}>
    <SelectTrigger className="w-full mt-2">
      <SelectValue placeholder={LABELS.selectPriority} />
      {apiLoading.updatePriority && <LoadingSpinner />} {/* Ensure this condition is correct */}
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="high">{LABELS.highPriority}</SelectItem>
      <SelectItem value="medium">{LABELS.mediumPriority}</SelectItem>
      <SelectItem value="low">{LABELS.lowPriority}</SelectItem>
    </SelectContent>      
  </Select>
  
</div>
                    </CardContent>
                  </Card>



                </Card>
                <div className="space-y-3 mt-4">
                  {/* Predefined Timeline */}
                  {getTimelineStatuses().map((status, index) => (
                    <div
                      key={status}
                      className="flex items-start gap-4 py-2 hover:bg-gray-100 rounded transition-colors"
                    >
                      <div className="flex flex-col items-center">
                        {isStatusDone(status) ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                        {index < getTimelineStatuses().length - 1 && (
                          <div className="w-0.5 h-12 bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={status} />
                          <span className="text-sm text-gray-500 capitalize">
                            {isStatusDone(status)
                              ? formatDate(
                                loanInfo.timeline.find((e: TimelineEvent) => e.status === status)?.date ||
                                new Date()
                              )
                              : "Pending"}
                          </span>
                        </div>
                        <p className="text-sm mt-1 capitalize">
                          {isStatusDone(status) ? `Completed: ${status}` : `Awaiting: ${status}`}
                        </p>
                      </div>
                    </div>
                  ))}


                </div>
              </CardContent>
            </Card>
          </TabsContent>


        </Tabs>
      </div>
    </AdminLayout>
  )
}