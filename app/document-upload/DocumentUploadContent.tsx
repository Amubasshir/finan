"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle,
  CheckCircle,
  Info,
  ArrowRight,
  ArrowLeft,
  File,
  FileCheck,
  Clock,
  Search,
  MessageSquare,
  ThumbsUp,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { DocumentUploader } from "@/components/DocumentUploader"

interface DocumentFile {
  id: string
  name: string
  size: number
  uploadDate: string
}

interface Document {
  id: string
  name: string
  description: string
  downloadLink?: string
  required: boolean
  category: "identity" | "income" | "property" | "financial" | "other" | "business" | "partner"
  multipleAllowed: boolean
  uploadedFiles: DocumentFile[]
  applicableFor: "primary" | "partner" | "business" | "all"
  conditionalDisplay?: {
    field: string
    value: any
  }
}

export function DocumentUploadContent() {
  const router = useRouter()

  const [documents, setDocuments] = useState<Document[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [completedUploads, setCompletedUploads] = useState(0)
  const [hasPartner, setHasPartner] = useState(false)
  const [isBusinessOwner, setIsBusinessOwner] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0)
  const [currentCategory, setCurrentCategory] = useState<string>("identity")
  const [showProcessSection, setShowProcessSection] = useState(false)

  // Load user data and initialize documents
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check localStorage for user data
      const userData = localStorage.getItem("userData")
      if (userData) {
        const parsedData = JSON.parse(userData)
        setHasPartner(parsedData.hasPartner || false)
        setIsBusinessOwner(parsedData.isBusinessOwner || false)
      }

      // Initialize documents
      const initialDocuments: Document[] = [
        {
          id: "doc1",
          name: "Photo ID (Driver's License or Passport)",
          description: "Clear copy of your current photo ID",
          required: true,
          category: "identity",
          multipleAllowed: false,
          uploadedFiles: [],
          applicableFor: "primary",
        },
        {
          id: "doc2",
          name: "Proof of Address",
          description: "Utility bill or bank statement from the last 3 months",
          required: true,
          category: "identity",
          multipleAllowed: false,
          uploadedFiles: [],
          applicableFor: "primary",
        },
        {
          id: "doc3",
          name: "Last 2 Payslips",
          description: "Your most recent payslips showing income details",
          required: true,
          category: "income",
          multipleAllowed: true,
          uploadedFiles: [],
          applicableFor: "primary",
        },
        {
          id: "doc4",
          name: "Employment Contract",
          description: "Current employment contract or letter from employer",
          required: false,
          category: "income",
          multipleAllowed: false,
          uploadedFiles: [],
          applicableFor: "primary",
        },
        {
          id: "doc5",
          name: "Last 2 Years Tax Returns",
          description: "Complete tax returns for the last two financial years",
          required: true,
          category: "income",
          multipleAllowed: true,
          uploadedFiles: [],
          applicableFor: "primary",
        },
        {
          id: "doc6",
          name: "Last 3 Months Bank Statements",
          description: "Statements for all bank accounts showing income and expenses",
          required: true,
          category: "financial",
          multipleAllowed: true,
          uploadedFiles: [],
          applicableFor: "primary",
        },
        {
          id: "doc7",
          name: "Current Home Loan Statement",
          description: "Most recent statement from your existing home loan",
          required: true,
          category: "financial",
          downloadLink: "/templates/loan-statement-template.pdf",
          multipleAllowed: false,
          uploadedFiles: [],
          applicableFor: "primary",
        },
        {
          id: "doc8",
          name: "Property Rates Notice",
          description: "Most recent council rates notice for the property",
          required: true,
          category: "property",
          multipleAllowed: false,
          uploadedFiles: [],
          applicableFor: "primary",
        },
        {
          id: "doc9",
          name: "Property Insurance",
          description: "Current property insurance policy document",
          required: false,
          category: "property",
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
          category: "partner",
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
          category: "partner",
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
          category: "partner",
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
          category: "business",
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
          category: "business",
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
          category: "business",
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
      const filteredDocuments = initialDocuments.filter((doc) => {
        if (!doc.conditionalDisplay) return true
        if (doc.conditionalDisplay.field === "hasPartner") return hasPartner === doc.conditionalDisplay.value
        if (doc.conditionalDisplay.field === "isBusinessOwner") return isBusinessOwner === doc.conditionalDisplay.value
        return true
      })

      // Check localStorage for previously uploaded documents
      const savedDocuments = localStorage.getItem("uploadedDocuments")
      if (savedDocuments) {
        try {
          const parsedDocuments = JSON.parse(savedDocuments)
          // Merge saved uploaded files with our document structure
          filteredDocuments.forEach((doc) => {
            const savedDoc = parsedDocuments.find((d: any) => d.id === doc.id)
            if (savedDoc && savedDoc.uploadedFiles) {
              doc.uploadedFiles = savedDoc.uploadedFiles
            }
          })

          // Calculate initial progress
          updateProgress(filteredDocuments)
        } catch (error) {
          console.error("Error parsing saved documents:", error)
        }
      }

      setDocuments(filteredDocuments)
      setIsLoading(false)
    }

    loadData()
  }, [hasPartner, isBusinessOwner])

  // Update progress whenever documents change
  useEffect(() => {
    updateProgress(documents)
  }, [documents])

  // Save documents to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && documents.length > 0) {
      localStorage.setItem("uploadedDocuments", JSON.stringify(documents))
    }
  }, [documents, isLoading])

  // Show process section when upload progress is 100%
  useEffect(() => {
    if (uploadProgress === 100) {
      setShowProcessSection(true)
    }
  }, [uploadProgress])

  const updateProgress = (docs: Document[]) => {
    const totalRequired = docs.filter((doc) => doc.required).length
    if (totalRequired === 0) return

    const completedRequired = docs.filter((doc) => doc.required && doc.uploadedFiles.length > 0).length

    const newProgress = Math.round((completedRequired / totalRequired) * 100)
    setUploadProgress(newProgress)

    // Update completed uploads count
    const totalCompleted = docs.filter((doc) => doc.uploadedFiles.length > 0).length
    setCompletedUploads(totalCompleted)
  }

  const handleFileUpload = (docId: string, file: File) => {
    console.log(`Uploading file for document ${docId}: ${file.name}`)

    // Update document by adding file to uploadedFiles
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          const newUploadedFiles = [
            ...doc.uploadedFiles,
            {
              id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: file.name,
              size: file.size,
              uploadDate: new Date().toISOString(),
            },
          ]

          return {
            ...doc,
            uploadedFiles: newUploadedFiles,
          }
        }
        return doc
      }),
    )
  }

  const handleRemoveFile = (docId: string, fileId: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          const newUploadedFiles = doc.uploadedFiles.filter((file) => file.id !== fileId)
          return {
            ...doc,
            uploadedFiles: newUploadedFiles,
          }
        }
        return doc
      }),
    )
  }

  const getDocumentsByCategory = (category: Document["category"]) => {
    return documents.filter((doc) => doc.category === category)
  }

  const getRequiredDocumentsCount = () => {
    return documents.filter((doc) => doc.required).length
  }

  const getUploadedRequiredDocumentsCount = () => {
    return documents.filter((doc) => doc.required && doc.uploadedFiles.length > 0).length
  }

  const handleContinueToPreApproval = () => {
    router.push("/pre-approval-status")
  }

  const goToNextDocument = () => {
    const currentCategoryDocs = getDocumentsByCategory(currentCategory as Document["category"])

    if (currentDocumentIndex < currentCategoryDocs.length - 1) {
      // Move to next document in the same category
      setCurrentDocumentIndex(currentDocumentIndex + 1)
    } else {
      // Move to the next category
      const categories = ["identity", "income", "financial", "property"]
      if (hasPartner) categories.push("partner")
      if (isBusinessOwner) categories.push("business")

      const currentCategoryIndex = categories.indexOf(currentCategory)
      if (currentCategoryIndex < categories.length - 1) {
        const nextCategory = categories[currentCategoryIndex + 1]
        setCurrentCategory(nextCategory)
        setCurrentDocumentIndex(0)
      } else {
        // We've reached the end, go back to overview
        setActiveTab("overview")
      }
    }
  }

  const goToPreviousDocument = () => {
    if (currentDocumentIndex > 0) {
      // Move to previous document in the same category
      setCurrentDocumentIndex(currentDocumentIndex - 1)
    } else {
      // Move to the previous category
      const categories = ["identity", "income", "financial", "property"]
      if (hasPartner) categories.push("partner")
      if (isBusinessOwner) categories.push("business")

      const currentCategoryIndex = categories.indexOf(currentCategory)
      if (currentCategoryIndex > 0) {
        const prevCategory = categories[currentCategoryIndex - 1]
        const prevCategoryDocs = getDocumentsByCategory(prevCategory as Document["category"])
        setCurrentCategory(prevCategory)
        setCurrentDocumentIndex(prevCategoryDocs.length - 1)
      } else {
        // We're at the beginning, go back to overview
        setActiveTab("overview")
      }
    }
  }

  const getCurrentDocument = () => {
    const categoryDocs = getDocumentsByCategory(currentCategory as Document["category"])
    return categoryDocs[currentDocumentIndex] || null
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-b-blue-600 border-l-transparent border-r-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading document uploader...</h2>
          <p className="text-gray-500 mt-2">Please wait while we prepare your document upload page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Document Upload</h1>
        <p className="text-gray-600 mb-4">Upload your documents to complete your loan application</p>

        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-blue-800 flex items-center">
                <FileCheck className="mr-2 h-5 w-5 text-blue-600" />
                Document Upload Progress
              </h2>
              <p className="text-blue-600">
                {getUploadedRequiredDocumentsCount()} of {getRequiredDocumentsCount()} required documents uploaded
              </p>
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
                <Info className="h-5 w-5 mr-2 text-blue-600" />
                <span className="font-medium">
                  Please upload all required documents to proceed with your application.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {activeTab === "overview" ? (
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
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Document Upload Instructions</AlertTitle>
              <AlertDescription className="text-blue-700">
                Click on each document category below to upload your files. You can drag and drop files directly onto
                the upload area.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                <h3 className="text-lg font-semibold mb-3 text-green-800 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Document Categories
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Button
                      variant="ghost"
                      className="text-left justify-start w-full"
                      onClick={() => {
                        setCurrentCategory("identity")
                        setCurrentDocumentIndex(0)
                        setActiveTab("document")
                      }}
                    >
                      <File className="h-5 w-5 text-blue-600 mr-2" />
                      <span>Identity Documents</span>
                    </Button>
                  </li>
                  <li className="flex items-start">
                    <Button
                      variant="ghost"
                      className="text-left justify-start w-full"
                      onClick={() => {
                        setCurrentCategory("income")
                        setCurrentDocumentIndex(0)
                        setActiveTab("document")
                      }}
                    >
                      <File className="h-5 w-5 text-blue-600 mr-2" />
                      <span>Income Documents</span>
                    </Button>
                  </li>
                  <li className="flex items-start">
                    <Button
                      variant="ghost"
                      className="text-left justify-start w-full"
                      onClick={() => {
                        setCurrentCategory("financial")
                        setCurrentDocumentIndex(0)
                        setActiveTab("document")
                      }}
                    >
                      <File className="h-5 w-5 text-blue-600 mr-2" />
                      <span>Financial Documents</span>
                    </Button>
                  </li>
                  <li className="flex items-start">
                    <Button
                      variant="ghost"
                      className="text-left justify-start w-full"
                      onClick={() => {
                        setCurrentCategory("property")
                        setCurrentDocumentIndex(0)
                        setActiveTab("document")
                      }}
                    >
                      <File className="h-5 w-5 text-blue-600 mr-2" />
                      <span>Property Documents</span>
                    </Button>
                  </li>
                  {hasPartner && (
                    <li className="flex items-start">
                      <Button
                        variant="ghost"
                        className="text-left justify-start w-full"
                        onClick={() => {
                          setCurrentCategory("partner")
                          setCurrentDocumentIndex(0)
                          setActiveTab("document")
                        }}
                      >
                        <File className="h-5 w-5 text-blue-600 mr-2" />
                        <span>Partner Documents</span>
                      </Button>
                    </li>
                  )}
                  {isBusinessOwner && (
                    <li className="flex items-start">
                      <Button
                        variant="ghost"
                        className="text-left justify-start w-full"
                        onClick={() => {
                          setCurrentCategory("business")
                          setCurrentDocumentIndex(0)
                          setActiveTab("document")
                        }}
                      >
                        <File className="h-5 w-5 text-blue-600 mr-2" />
                        <span>Business Documents</span>
                      </Button>
                    </li>
                  )}
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h3 className="text-lg font-semibold mb-3 text-blue-800 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-600" />
                  Document Upload Tips
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Upload clear, readable documents</p>
                      <p className="text-sm text-gray-600">
                        Make sure all text is clearly visible and documents are properly oriented
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Use PDF format when possible</p>
                      <p className="text-sm text-gray-600">PDFs maintain quality and are preferred by most lenders</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Include all pages</p>
                      <p className="text-sm text-gray-600">
                        Upload all pages of multi-page documents, even if they're blank
                      </p>
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
                    These documents are essential for your application to proceed. Your application cannot be processed
                    without them.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-amber-200">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-2 text-amber-600" />
                    Optional Documents
                  </h4>
                  <p className="text-sm text-gray-600">
                    These documents provide additional information that may help strengthen your application or qualify
                    for better rates.
                  </p>
                </div>
              </div>
            </div>

            {/* Process Section - What Happens After Document Upload */}
            {showProcessSection && (
              <div className="bg-green-50 p-6 rounded-lg border border-green-100 mt-8">
                <h3 className="text-xl font-semibold mb-4 text-green-800 flex items-center">
                  <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
                  What Happens After Document Upload
                </h3>
                <p className="text-gray-700 mb-6">
                  Now that you've uploaded your documents, here's what happens next in your loan application process:
                </p>

                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-1 bg-green-200"></div>

                  <div className="relative z-10 mb-8">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4 shadow-md">
                        Step 1
                      </div>
                      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex-grow">
                        <h4 className="font-semibold text-lg mb-2 flex items-center">
                          <FileCheck className="h-5 w-5 mr-2 text-green-600" />
                          Document Verification
                        </h4>
                        <p className="text-gray-600 mb-2">
                          Our team reviews your documents to ensure they meet lender requirements. This typically takes
                          1-2 business days.
                        </p>
                        <div className="bg-green-50 p-3 rounded-md border border-green-100 text-sm">
                          <p className="text-green-800 flex items-center">
                            <Info className="h-4 w-4 mr-2 text-green-600" />
                            You'll receive an email confirmation once your documents have been verified.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 mb-8">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4 shadow-md">
                        Step 2
                      </div>
                      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex-grow">
                        <h4 className="font-semibold text-lg mb-2 flex items-center">
                          <Search className="h-5 w-5 mr-2 text-blue-600" />
                          Lender Matching
                        </h4>
                        <p className="text-gray-600 mb-2">
                          Your application is submitted to multiple lenders who will review your information and provide
                          pre-approval offers.
                        </p>
                        <div className="bg-blue-50 p-3 rounded-md border border-blue-100 text-sm">
                          <p className="text-blue-800 flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-blue-600" />
                            This process typically takes 3-5 business days.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 mb-8">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4 shadow-md">
                        Step 3
                      </div>
                      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex-grow">
                        <h4 className="font-semibold text-lg mb-2 flex items-center">
                          <ThumbsUp className="h-5 w-5 mr-2 text-purple-600" />
                          Pre-Approval Offers
                        </h4>
                        <p className="text-gray-600 mb-2">
                          You'll receive multiple pre-approval offers from different lenders. You can compare rates,
                          terms, and features to select the best option.
                        </p>
                        <div className="bg-purple-50 p-3 rounded-md border border-purple-100 text-sm">
                          <p className="text-purple-800 flex items-center">
                            <MessageSquare className="h-4 w-4 mr-2 text-purple-600" />
                            Our loan specialists are available to help you understand and compare your options.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-amber-600 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4 shadow-md">
                        Step 4
                      </div>
                      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex-grow">
                        <h4 className="font-semibold text-lg mb-2 flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-amber-600" />
                          Final Approval & Settlement
                        </h4>
                        <p className="text-gray-600 mb-2">
                          Once you select a loan offer, the lender will finalize your application and prepare for
                          settlement. This includes property valuation and final contract preparation.
                        </p>
                        <div className="bg-amber-50 p-3 rounded-md border border-amber-100 text-sm">
                          <p className="text-amber-800 flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-amber-600" />
                            The final approval and settlement process typically takes 2-4 weeks.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-semibold text-blue-800 mb-2">How You'll Be Kept Informed</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <span>Email notifications at each stage of the process</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <span>Real-time status updates in your Refii dashboard</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <span>SMS alerts for urgent actions or important updates</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <span>Direct communication with your dedicated loan specialist</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" asChild>
              <Link href="/settings">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Settings
              </Link>
            </Button>
            <Button
              onClick={() => {
                setCurrentCategory("identity")
                setCurrentDocumentIndex(0)
                setActiveTab("document")
              }}
            >
              Start Uploading Documents
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ) : activeTab === "document" ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <File className="mr-2 h-5 w-5 text-blue-600" />
              {getCurrentDocument()?.name}
            </CardTitle>
            <CardDescription>
              {getCurrentDocument()?.description}
              {getCurrentDocument()?.required && <span className="text-red-500 ml-2 font-medium">(Required)</span>}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentUploader
              document={
                getCurrentDocument() || {
                  id: "",
                  name: "",
                  description: "",
                  required: false,
                  multipleAllowed: false,
                  uploadedFiles: [],
                }
              }
              onFileUpload={handleFileUpload}
              onFileRemove={handleRemoveFile}
            />
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" onClick={goToPreviousDocument}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button onClick={goToNextDocument}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ) : null}

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
              Complete Application
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
                  Complete Application
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
