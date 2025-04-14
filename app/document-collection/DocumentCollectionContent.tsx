"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  AlertTriangle,
  Home,
  CheckCircle,
  DollarSign,
  FileText,
  Clock,
  Info,
  Star,
  Trophy,
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  type File,
} from "lucide-react"
import Link from "next/link"
import confetti from "canvas-confetti"
import { DocumentUploadSection } from "@/components/DocumentUploadSection"

interface Document {
  id: string
  name: string
  description: string
  downloadLink?: string
  required: boolean
  lenders: string[]
  category: "identity" | "income" | "property" | "financial" | "other" | "business" | "partner"
  uploadStatus: "not_started" | "in_progress" | "completed"
  multipleAllowed: boolean
  uploadedFiles: Array<{
    id: string
    name: string
    size: number
    uploadDate: string
  }>
  applicableFor: "primary" | "partner" | "business" | "all"
  conditionalDisplay?: {
    field: string
    value: any
  }
}

interface Lender {
  id: string
  name: string
  logoUrl: string
  documentsRequired: number
  documentsUploaded: number
}

export default function DocumentCollectionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedLoanIds = searchParams.getAll("id")

  const [documents, setDocuments] = useState<Document[]>([])
  const [lenders, setLenders] = useState<Lender[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [gamePoints, setGamePoints] = useState(0)
  const [completedUploads, setCompletedUploads] = useState(0)
  const [showTip, setShowTip] = useState(0)
  const [hasPartner, setHasPartner] = useState(false)
  const [isBusinessOwner, setIsBusinessOwner] = useState(false)

  // Simulate fetching documents and lenders based on selected loan IDs
  useEffect(() => {
    const fetchData = async () => {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check localStorage for user data
      const userData = localStorage.getItem("userData")
      if (userData) {
        const parsedData = JSON.parse(userData)
        setHasPartner(parsedData.hasPartner || false)
        setIsBusinessOwner(parsedData.isBusinessOwner || false)
      }

      // Mock lenders data
      const mockLenders: Lender[] = [
        {
          id: "lender1",
          name: "Commonwealth Bank",
          logoUrl: "/placeholder.svg?height=40&width=100",
          documentsRequired: 8,
          documentsUploaded: 0,
        },
        {
          id: "lender2",
          name: "Westpac",
          logoUrl: "/placeholder.svg?height=40&width=100",
          documentsRequired: 7,
          documentsUploaded: 0,
        },
        {
          id: "lender3",
          name: "ANZ",
          logoUrl: "/placeholder.svg?height=40&width=100",
          documentsRequired: 9,
          documentsUploaded: 0,
        },
      ]

      // Filter lenders based on selected loan IDs
      const filteredLenders =
        selectedLoanIds.length > 0 ? mockLenders.slice(0, selectedLoanIds.length) : [mockLenders[0]]

      // Mock documents data
      const mockDocuments: Document[] = [
        {
          id: "doc1",
          name: "Photo ID (Driver's License or Passport)",
          description: "Clear copy of your current photo ID",
          required: true,
          lenders: filteredLenders.map((l) => l.id),
          category: "identity",
          uploadStatus: "not_started",
          multipleAllowed: false,
          uploadedFiles: [],
          applicableFor: "primary",
        },
        {
          id: "doc2",
          name: "Proof of Address",
          description: "Utility bill or bank statement from the last 3 months",
          required: true,
          lenders: filteredLenders.map((l) => l.id),
          category: "identity",
          uploadStatus: "not_started",
          multipleAllowed: false,
          uploadedFiles: [],
          applicableFor: "primary",
        },
        {
          id: "doc3",
          name: "Last 2 Payslips",
          description: "Your most recent payslips showing income details",
          required: true,
          lenders: filteredLenders.map((l) => l.id),
          category: "income",
          uploadStatus: "not_started",
          multipleAllowed: true,
          uploadedFiles: [],
          applicableFor: "primary",
        },
        {
          id: "doc4",
          name: "Employment Contract",
          description: "Current employment contract or letter from employer",
          required: false,
          lenders: filteredLenders.map((l) => l.id),
          category: "income",
          uploadStatus: "not_started",
          multipleAllowed: false,
          uploadedFiles: [],
          applicableFor: "primary",
        },
        {
          id: "doc5",
          name: "Last 2 Years Tax Returns",
          description: "Complete tax returns for the last two financial years",
          required: true,
          lenders: filteredLenders.map((l) => l.id),
          category: "income",
          uploadStatus: "not_started",
          multipleAllowed: true,
          uploadedFiles: [],
          applicableFor: "primary",
        },
        {
          id: "doc6",
          name: "Last 3 Months Bank Statements",
          description: "Statements for all bank accounts showing income and expenses",
          required: true,
          lenders: filteredLenders.map((l) => l.id),
          category: "financial",
          uploadStatus: "not_started",
          multipleAllowed: true,
          uploadedFiles: [],
          applicableFor: "primary",
        },
        {
          id: "doc7",
          name: "Current Home Loan Statement",
          description: "Most recent statement from your existing home loan",
          required: true,
          lenders: filteredLenders.map((l) => l.id),
          category: "financial",
          downloadLink: "/templates/loan-statement-template.pdf",
          uploadStatus: "not_started",
          multipleAllowed: false,
          uploadedFiles: [],
          applicableFor: "primary",
        },
        {
          id: "doc8",
          name: "Property Rates Notice",
          description: "Most recent council rates notice for the property",
          required: true,
          lenders: filteredLenders.map((l) => l.id),
          category: "property",
          uploadStatus: "not_started",
          multipleAllowed: false,
          uploadedFiles: [],
          applicableFor: "primary",
        },
        {
          id: "doc9",
          name: "Property Insurance",
          description: "Current property insurance policy document",
          required: false,
          lenders: filteredLenders.map((l) => l.id),
          category: "property",
          uploadStatus: "not_started",
          multipleAllowed: false,
          uploadedFiles: [],
          applicableFor: "primary",
        },
        // Partner documents (conditionally displayed)
        {
          id: "doc10",
          name: "Partner's Photo ID",
          description: "Clear copy of your partner's current photo ID",
          required: hasPartner,
          lenders: filteredLenders.map((l) => l.id),
          category: "partner",
          uploadStatus: "not_started",
          multipleAllowed: false,
          uploadedFiles: [],
          applicableFor: "partner",
          conditionalDisplay: {
            field: "hasPartner",
            value: true,
          },
        },
        {
          id: "doc11",
          name: "Partner's Proof of Income",
          description: "Recent payslips or income statements for your partner",
          required: hasPartner,
          lenders: filteredLenders.map((l) => l.id),
          category: "partner",
          uploadStatus: "not_started",
          multipleAllowed: true,
          uploadedFiles: [],
          applicableFor: "partner",
          conditionalDisplay: {
            field: "hasPartner",
            value: true,
          },
        },
        {
          id: "doc12",
          name: "Partner's Tax Returns",
          description: "Most recent tax return for your partner",
          required: false,
          lenders: filteredLenders.map((l) => l.id),
          category: "partner",
          uploadStatus: "not_started",
          multipleAllowed: true,
          uploadedFiles: [],
          applicableFor: "partner",
          conditionalDisplay: {
            field: "hasPartner",
            value: true,
          },
        },
        // Business owner documents (conditionally displayed)
        {
          id: "doc13",
          name: "Business Registration",
          description: "Business registration or incorporation documents",
          required: isBusinessOwner,
          lenders: filteredLenders.map((l) => l.id),
          category: "business",
          uploadStatus: "not_started",
          multipleAllowed: false,
          uploadedFiles: [],
          applicableFor: "business",
          conditionalDisplay: {
            field: "isBusinessOwner",
            value: true,
          },
        },
        {
          id: "doc14",
          name: "Business Financial Statements",
          description: "Last 2 years of business financial statements",
          required: isBusinessOwner,
          lenders: filteredLenders.map((l) => l.id),
          category: "business",
          uploadStatus: "not_started",
          multipleAllowed: true,
          uploadedFiles: [],
          applicableFor: "business",
          conditionalDisplay: {
            field: "isBusinessOwner",
            value: true,
          },
        },
        {
          id: "doc15",
          name: "Business Tax Returns",
          description: "Last 2 years of business tax returns",
          required: isBusinessOwner,
          lenders: filteredLenders.map((l) => l.id),
          category: "business",
          uploadStatus: "not_started",
          multipleAllowed: true,
          uploadedFiles: [],
          applicableFor: "business",
          conditionalDisplay: {
            field: "isBusinessOwner",
            value: true,
          },
        },
      ]

      // Filter documents based on conditional display
      const filteredDocuments = mockDocuments.filter((doc) => {
        if (!doc.conditionalDisplay) return true
        if (doc.conditionalDisplay.field === "hasPartner") return hasPartner === doc.conditionalDisplay.value
        if (doc.conditionalDisplay.field === "isBusinessOwner") return isBusinessOwner === doc.conditionalDisplay.value
        return true
      })

      setLenders(filteredLenders)
      setDocuments(filteredDocuments)
    }

    fetchData()
  }, [selectedLoanIds, hasPartner, isBusinessOwner])

  // Rotate through tips
  useEffect(() => {
    const tipTimer = setInterval(() => {
      setShowTip((prevTip) => (prevTip + 1) % 5)
    }, 8000)

    return () => clearInterval(tipTimer)
  }, [])

  // Confetti effect when progress reaches certain milestones
  useEffect(() => {
    if (uploadProgress >= 25 && uploadProgress < 30) {
      triggerConfetti()
    } else if (uploadProgress >= 50 && uploadProgress < 55) {
      triggerConfetti()
    } else if (uploadProgress >= 75 && uploadProgress < 80) {
      triggerConfetti()
    } else if (uploadProgress === 100) {
      triggerConfetti()
    }
  }, [uploadProgress])

  const triggerConfetti = () => {
    setShowConfetti(true)

    const duration = 2 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)

    setTimeout(() => {
      setShowConfetti(false)
      clearInterval(interval)
    }, duration)
  }

  const handleFileUpload = (docId: string, file: File) => {
    console.log(`Uploading file for document ${docId}: ${file.name}`)

    // Update document status and add file to uploadedFiles
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          const newUploadedFiles = [
            ...doc.uploadedFiles,
            {
              id: `file-${Date.now()}`,
              name: file.name,
              size: file.size,
              uploadDate: new Date().toISOString(),
            },
          ]

          return {
            ...doc,
            uploadStatus: "completed",
            uploadedFiles: newUploadedFiles,
          }
        }
        return doc
      }),
    )

    // Update lender document counts
    const updatedDoc = documents.find((d) => d.id === docId)
    if (updatedDoc) {
      setLenders((prev) =>
        prev.map((lender) =>
          updatedDoc.lenders.includes(lender.id)
            ? { ...lender, documentsUploaded: lender.documentsUploaded + 1 }
            : lender,
        ),
      )
    }

    // Update progress
    const totalRequired = documents.filter((doc) => doc.required).length
    const completedRequired = documents.filter((doc) => doc.required && doc.uploadStatus === "completed").length + 1
    const newProgress = Math.round((completedRequired / totalRequired) * 100)
    setUploadProgress(newProgress)

    // Update game points
    setGamePoints((prev) => prev + 100)
    setCompletedUploads((prev) => prev + 1)

    // Show confetti for certain milestones
    if (completedUploads + 1 === 3 || completedUploads + 1 === 5 || completedUploads + 1 === 7) {
      triggerConfetti()
    }
  }

  const handleRemoveFile = (docId: string, fileId: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          const newUploadedFiles = doc.uploadedFiles.filter((file) => file.id !== fileId)

          // If no files left, set status back to not_started
          const newStatus = newUploadedFiles.length > 0 ? "completed" : "not_started"

          return {
            ...doc,
            uploadStatus: newStatus,
            uploadedFiles: newUploadedFiles,
          }
        }
        return doc
      }),
    )

    // Update progress
    const totalRequired = documents.filter((doc) => doc.required).length
    const completedRequired = documents.filter((doc) => doc.required && doc.uploadStatus === "completed").length

    const newProgress = Math.round((completedRequired / totalRequired) * 100)
    setUploadProgress(newProgress)
  }

  const getDocumentsByCategory = (category: Document["category"]) => {
    return documents.filter((doc) => doc.category === category)
  }

  const getRequiredDocumentsCount = () => {
    return documents.filter((doc) => doc.required).length
  }

  const getUploadedRequiredDocumentsCount = () => {
    return documents.filter((doc) => doc.required && doc.uploadStatus === "completed").length
  }

  const handleContinueToPreApproval = () => {
    router.push("/waiting-for-approval")
  }

  const tips = [
    {
      title: "Upload clear, readable documents",
      description: "Make sure all text is clearly visible and documents are properly oriented.",
      icon: <FileText className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "Use PDF format when possible",
      description: "PDFs maintain quality and are preferred by most lenders.",
      icon: <FileText className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "Ensure documents are current",
      description: "Most documents should be less than 90 days old.",
      icon: <Clock className="h-5 w-5 text-amber-500" />,
    },
    {
      title: "Include all pages",
      description: "Upload all pages of multi-page documents, even if they're blank.",
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    },
    {
      title: "Check file size limits",
      description: "Keep files under 10MB each for faster uploads.",
      icon: <Info className="h-5 w-5 text-purple-500" />,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Document Collection</h1>
        <p className="text-gray-600 mb-4">
          Upload your documents to complete your loan {lenders.length > 1 ? `applications` : "application"}
        </p>

        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-blue-800 flex items-center">
                <Trophy className="mr-2 h-5 w-5 text-blue-600" />
                Document Upload Progress
              </h2>
              <p className="text-blue-600">
                {getUploadedRequiredDocumentsCount()} of {getRequiredDocumentsCount()} required documents uploaded
              </p>
            </div>
            <div className="bg-white px-4 py-2 rounded-full border border-blue-200 shadow-sm">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-amber-500 mr-2" />
                <span className="font-bold text-lg">{gamePoints} points</span>
              </div>
            </div>
          </div>

          <Progress value={uploadProgress} className="h-4 mb-2" />

          <div className="flex justify-between text-sm text-blue-700">
            <span>Start</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>Complete</span>
          </div>

          {uploadProgress === 100 ? (
            <div className="mt-4 bg-green-100 text-green-800 p-3 rounded-lg border border-green-200 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              <span className="font-medium">All required documents uploaded! You can now proceed to pre-approval.</span>
            </div>
          ) : (
            <div className="mt-4 bg-blue-100 text-blue-800 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                <span className="font-medium">Upload Milestone Rewards:</span>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2">
                <div
                  className={`p-2 rounded-lg text-center ${uploadProgress >= 25 ? "bg-green-100 text-green-800" : "bg-white text-gray-500"}`}
                >
                  <span className="text-xs">25%</span>
                  <div className="font-medium">+250 points</div>
                </div>
                <div
                  className={`p-2 rounded-lg text-center ${uploadProgress >= 50 ? "bg-green-100 text-green-800" : "bg-white text-gray-500"}`}
                >
                  <span className="text-xs">50%</span>
                  <div className="font-medium">+500 points</div>
                </div>
                <div
                  className={`p-2 rounded-lg text-center ${uploadProgress >= 75 ? "bg-green-100 text-green-800" : "bg-white text-gray-500"}`}
                >
                  <span className="text-xs">75%</span>
                  <div className="font-medium">+750 points</div>
                </div>
                <div
                  className={`p-2 rounded-lg text-center ${uploadProgress >= 100 ? "bg-green-100 text-green-800" : "bg-white text-gray-500"}`}
                >
                  <span className="text-xs">100%</span>
                  <div className="font-medium">+1000 points</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {lenders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Selected Lenders</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lenders.map((lender) => (
              <Card key={lender.id} className="overflow-hidden">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{lender.name}</CardTitle>
                    <CardDescription>
                      {lender.documentsUploaded} of {lender.documentsRequired} documents uploaded
                    </CardDescription>
                  </div>
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={lender.logoUrl || "/placeholder.svg"}
                      alt={`${lender.name} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={(lender.documentsUploaded / lender.documentsRequired) * 100} className="h-2 mb-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="identity">Identity</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="property">Property</TabsTrigger>
          {hasPartner && <TabsTrigger value="partner">Partner</TabsTrigger>}
          {isBusinessOwner && <TabsTrigger value="business">Business</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5 text-blue-600" />
                Complete Your Loan Application
              </CardTitle>
              <CardDescription>Upload the required documents to finalize your loan application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-blue-50 border-blue-100">
                <Zap className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Pro Tip</AlertTitle>
                <AlertDescription className="text-blue-700">
                  {tips[showTip].title}: {tips[showTip].description}
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                  <h3 className="text-lg font-semibold mb-3 text-green-800 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    Your Applications Are In Progress
                  </h3>
                  <p className="text-gray-700 mb-4">
                    You've applied for {lenders.length} {lenders.length > 1 ? "loans" : "loan"}. To complete your
                    application, we need:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Shield className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                      <span>Identity and personal information</span>
                    </li>
                    <li className="flex items-start">
                      <DollarSign className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                      <span>Income and employment status</span>
                    </li>
                    <li className="flex items-start">
                      <Home className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                      <span>Property details and value</span>
                    </li>
                    <li className="flex items-start">
                      <FileText className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                      <span>Current financial situation</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <h3 className="text-lg font-semibold mb-3 text-blue-800 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-blue-600" />
                    Document Upload Benefits
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Upload once, apply to multiple lenders</p>
                        <p className="text-sm text-gray-600">
                          Your documents are securely shared with all selected lenders
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Faster approval process</p>
                        <p className="text-sm text-gray-600">Complete documentation speeds up your application</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Secure document handling</p>
                        <p className="text-sm text-gray-600">Bank-level encryption protects your information</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-amber-50 p-6 rounded-lg border border-amber-100">
                <h3 className="text-lg font-semibold mb-3 text-amber-800 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
                  Required vs. Optional Documents
                </h3>
                <p className="text-gray-700 mb-4">
                  While some documents are optional, providing them can strengthen your application and potentially lead
                  to better loan terms.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-amber-200">
                    <h4 className="font-medium mb-2 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />
                      Required Documents
                    </h4>
                    <p className="text-sm text-gray-600">
                      These documents are essential for your application to proceed. Your application cannot be
                      processed without them.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-amber-200">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Info className="h-4 w-4 mr-2 text-amber-600" />
                      Optional Documents
                    </h4>
                    <p className="text-sm text-gray-600">
                      These documents provide additional information that may help strengthen your application or
                      qualify for better rates.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" asChild>
                <Link href="/document-templates">
                  <Download className="mr-2 h-4 w-4" />
                  Download Templates
                </Link>
              </Button>
              <Button onClick={() => setActiveTab("identity")}>
                Start Uploading Documents
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="identity">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Identity Documents</h2>
              <Badge variant="outline">
                {getDocumentsByCategory("identity").filter((doc) => doc.uploadStatus === "completed").length} of{" "}
                {getDocumentsByCategory("identity").length} uploaded
              </Badge>
            </div>

            {getDocumentsByCategory("identity").map((doc) => (
              <DocumentUploadSection
                key={doc.id}
                id={doc.id}
                name={doc.name}
                description={doc.description}
                required={doc.required}
                multipleAllowed={doc.multipleAllowed}
                downloadLink={doc.downloadLink}
                onFileUpload={handleFileUpload}
                onFileRemove={handleRemoveFile}
                uploadedFiles={doc.uploadedFiles}
              />
            ))}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("overview")}>
                Back to Overview
              </Button>
              <Button onClick={() => setActiveTab("income")}>
                Continue to Income Documents
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="income">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Income Documents</h2>
              <Badge variant="outline">
                {getDocumentsByCategory("income").filter((doc) => doc.uploadStatus === "completed").length} of{" "}
                {getDocumentsByCategory("income").length} uploaded
              </Badge>
            </div>

            {getDocumentsByCategory("income").map((doc) => (
              <DocumentUploadSection
                key={doc.id}
                id={doc.id}
                name={doc.name}
                description={doc.description}
                required={doc.required}
                multipleAllowed={doc.multipleAllowed}
                downloadLink={doc.downloadLink}
                onFileUpload={handleFileUpload}
                onFileRemove={handleRemoveFile}
                uploadedFiles={doc.uploadedFiles}
              />
            ))}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("identity")}>
                Back to Identity Documents
              </Button>
              <Button onClick={() => setActiveTab("financial")}>
                Continue to Financial Documents
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="financial">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Financial Documents</h2>
              <Badge variant="outline">
                {getDocumentsByCategory("financial").filter((doc) => doc.uploadStatus === "completed").length} of{" "}
                {getDocumentsByCategory("financial").length} uploaded
              </Badge>
            </div>

            {getDocumentsByCategory("financial").map((doc) => (
              <DocumentUploadSection
                key={doc.id}
                id={doc.id}
                name={doc.name}
                description={doc.description}
                required={doc.required}
                multipleAllowed={doc.multipleAllowed}
                downloadLink={doc.downloadLink}
                onFileUpload={handleFileUpload}
                onFileRemove={handleRemoveFile}
                uploadedFiles={doc.uploadedFiles}
              />
            ))}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("income")}>
                Back to Income Documents
              </Button>
              <Button onClick={() => setActiveTab("property")}>
                Continue to Property Documents
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="property">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Property Documents</h2>
              <Badge variant="outline">
                {getDocumentsByCategory("property").filter((doc) => doc.uploadStatus === "completed").length} of{" "}
                {getDocumentsByCategory("property").length} uploaded
              </Badge>
            </div>

            {getDocumentsByCategory("property").map((doc) => (
              <DocumentUploadSection
                key={doc.id}
                id={doc.id}
                name={doc.name}
                description={doc.description}
                required={doc.required}
                multipleAllowed={doc.multipleAllowed}
                downloadLink={doc.downloadLink}
                onFileUpload={handleFileUpload}
                onFileRemove={handleRemoveFile}
                uploadedFiles={doc.uploadedFiles}
              />
            ))}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("financial")}>
                Back to Financial Documents
              </Button>
              <Button onClick={() => setActiveTab("overview")}>
                Return to Overview
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
        {hasPartner && (
          <TabsContent value="partner">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Partner Documents</h2>
                <Badge variant="outline">
                  {getDocumentsByCategory("partner").filter((doc) => doc.uploadStatus === "completed").length} of{" "}
                  {getDocumentsByCategory("partner").length} uploaded
                </Badge>
              </div>

              {getDocumentsByCategory("partner").map((doc) => (
                <DocumentUploadSection
                  key={doc.id}
                  id={doc.id}
                  name={doc.name}
                  description={doc.description}
                  required={doc.required}
                  multipleAllowed={doc.multipleAllowed}
                  downloadLink={doc.downloadLink}
                  onFileUpload={handleFileUpload}
                  onFileRemove={handleRemoveFile}
                  uploadedFiles={doc.uploadedFiles}
                />
              ))}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("property")}>
                  Back to Property Documents
                </Button>
                {isBusinessOwner ? (
                  <Button onClick={() => setActiveTab("business")}>
                    Continue to Business Documents
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={() => setActiveTab("overview")}>
                    Return to Overview
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
        )}
        {isBusinessOwner && (
          <TabsContent value="business">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Business Documents</h2>
                <Badge variant="outline">
                  {getDocumentsByCategory("business").filter((doc) => doc.uploadStatus === "completed").length} of{" "}
                  {getDocumentsByCategory("business").length} uploaded
                </Badge>
              </div>

              {getDocumentsByCategory("business").map((doc) => (
                <DocumentUploadSection
                  key={doc.id}
                  id={doc.id}
                  name={doc.name}
                  description={doc.description}
                  required={doc.required}
                  multipleAllowed={doc.multipleAllowed}
                  downloadLink={doc.downloadLink}
                  onFileUpload={handleFileUpload}
                  onFileRemove={handleRemoveFile}
                  uploadedFiles={doc.uploadedFiles}
                />
              ))}

              <div className="flex justify-between">
                {hasPartner ? (
                  <Button variant="outline" onClick={() => setActiveTab("partner")}>
                    Back to Partner Documents
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => setActiveTab("property")}>
                    Back to Property Documents
                  </Button>
                )}
                <Button onClick={() => setActiveTab("overview")}>
                  Return to Overview
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>

      <div className="flex justify-center mt-8">
        <Button
          onClick={handleContinueToPreApproval}
          size="lg"
          className={`px-8 py-6 text-lg font-semibold ${
            uploadProgress === 100 ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={uploadProgress < 100 && getRequiredDocumentsCount() > 0}
        >
          {uploadProgress === 100 ? (
            <>
              <CheckCircle className="mr-2 h-5 w-5" />
              Complete Applications
            </>
          ) : (
            <>
              {getRequiredDocumentsCount() > 0 ? (
                <>
                  Upload Required Documents
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              ) : (
                <>
                  Complete Applications
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
