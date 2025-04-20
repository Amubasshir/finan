"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

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
  Search,
  MessageSquare,
  ThumbsUp,
  Calendar,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import api from "@/lib/axios"
import { DocumentUploader } from "@/components/DocumentUploader"

interface DocumentFile {
  id: string
  name: string
  size: number
  uploadDate: string
  url?: string
  cloudinaryId?: string
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

export default function DocumentUploadContent() {
  const router = useRouter()
  const { id } = useParams()

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

  // Load user data and documents from API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        // Fetch loan info to get user data
        const loanInfoResponse = await api.get(`/loan-info/${id}`);
        if (loanInfoResponse.data && loanInfoResponse.data.loanInfo) {
          const loanInfo = loanInfoResponse.data.loanInfo;
          setHasPartner(loanInfo.hasPartner || false);
          setIsBusinessOwner(loanInfo.isBusinessOwner || false);
        } else {
          // If no loan info, initialize with defaults
          setHasPartner(false);
          setIsBusinessOwner(false);
        }

        // Fetch documents from API
        const documentsResponse = await api.get(`/documents/${id}`);
        
        if (documentsResponse?.data?.success && documentsResponse?.data?.documents) {
          // Check if documents is an array or has a documents property
          const docsData = Array.isArray(documentsResponse.data.documents.documents) 
            ? documentsResponse.data.documents.documents 
            : documentsResponse.data.documents.documents || [];
            
          if (docsData && docsData.length > 0) {
            setDocuments(docsData);
            updateProgress(docsData);
            console.log("Documents loaded successfully:", docsData);
          } else {
            // If documents array is empty, initialize with defaults
            initializeDefaultDocuments();
          }
        } else {
          // If no documents returned, initialize with defaults
          initializeDefaultDocuments();
        }
      } catch (error) {
        console.error("Error in loadData:", error);
        // Initialize default documents if API fails
        initializeDefaultDocuments();
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  // Helper function to initialize default documents
  const initializeDefaultDocuments = async () => {
    const initialDocuments = getInitialDocuments(hasPartner, isBusinessOwner);
    try {
      // Save initial documents to API
      await api.post(`/documents`, {
        loanInfoId: id,
        documents: initialDocuments,
        status: "pending",
      });
      
      setDocuments(initialDocuments);
      updateProgress(initialDocuments);
      console.log("Default documents initialized and saved to API");
    } catch (error) {
      console.error("Error saving initial documents to API:", error);
      setDocuments(initialDocuments); // Set defaults even if API save fails
      updateProgress(initialDocuments);
    }
  };

  const saveDocuments = async (documentsArr: any[]) => {
    if (documentsArr.length > 0 && id) {
      try {
        const response = await api.put(`/documents/${id}`, {
          documents: documentsArr,
          status: uploadProgress === 100 ? "review" : "pending",
        });
        
        if (response.data && response.data.success) {
          console.log("Documents saved successfully:", response.data);
        } else {
          console.error("Error in saveDocuments response:", response.data);
        }
      } catch (error) {
        console.error("Error saving documents to API:", error);
        toast({
          title: "Error",
          description: "Failed to save documents to database.",
          variant: "destructive",
        });
      }
    }
  };
  // Show process section when upload progress is 100%
  useEffect(() => {
    if (uploadProgress === 100) {
      setShowProcessSection(true)
    }
  }, [uploadProgress])

  // Function to fetch documents by loanInfoId
  const getDocumentsById = async (loanInfoId: string): Promise<Document[] | null> => {
    setIsLoading(true)
    try {
      const documentsResponse = await api.get(`/documents/${loanInfoId}`)
      if (documentsResponse.data && documentsResponse?.data?.documents?.documents && documentsResponse?.data?.documents?.documents.length > 0) {
        setDocuments(documentsResponse?.data?.documents?.documents)
        updateProgress(documentsResponse?.data?.documents?.documents)
        toast({
          title: "Documents retrieved",
          description: `Successfully fetched documents for loan ID ${loanInfoId}.`,
          variant: "default",
        })
        return documentsResponse?.data?.documents?.documents
      } else {
        const initialDocuments = getInitialDocuments(hasPartner, isBusinessOwner)
        try {
          await api.post(`/documents`, {
            loanInfoId,
            documents: initialDocuments,
            status: "pending",
          })
          setDocuments(initialDocuments)
          updateProgress(initialDocuments)
          toast({
            title: "Documents initialized",
            description: `Created default document structure for loan ID ${loanInfoId}.`,
            variant: "default",
          })
          return initialDocuments
        } catch (error) {
          console.error("Error saving initial documents to API:", error)
          setDocuments(initialDocuments)
          updateProgress(initialDocuments)
          toast({
            title: "Error",
            description: "Failed to initialize documents. Using defaults.",
            variant: "destructive",
          })
          return initialDocuments
        }
      }
    } catch (error) {
      console.error("Error fetching documents by ID:", error)
      const initialDocuments = getInitialDocuments(hasPartner, isBusinessOwner)
      setDocuments(initialDocuments)
      updateProgress(initialDocuments)
      toast({
        title: "Error fetching documents",
        description: `Initialized default documents for loan ID ${loanInfoId} due to an error.`,
        variant: "destructive",
      })
      return initialDocuments
    } finally {
      setIsLoading(false)
    }
  }

  const getInitialDocuments = (hasPartner: boolean, isBusinessOwner: boolean): Document[] => {
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
        name: "Pay Slips",
        description: "Last 3 months of pay slips showing regular income",
        required: true,
        category: "income",
        multipleAllowed: true,
        uploadedFiles: [],
        applicableFor: "primary",
      },
      {
        id: "doc4",
        name: "Bank Statements",
        description: "Last 3 months of bank statements showing income deposits",
        required: true,
        category: "income",
        multipleAllowed: true,
        uploadedFiles: [],
        applicableFor: "primary",
      },
      {
        id: "doc5",
        name: "Tax Returns",
        description: "Most recent tax return including all schedules",
        required: true,
        category: "financial",
        multipleAllowed: false,
        uploadedFiles: [],
        applicableFor: "primary",
      },
      {
        id: "doc6",
        name: "W-2 Forms",
        description: "Most recent W-2 forms from all employers",
        required: true,
        category: "financial",
        multipleAllowed: true,
        uploadedFiles: [],
        applicableFor: "primary",
      },
      {
        id: "doc7",
        name: "Property Information",
        description: "Current property details, title, or purchase agreement",
        required: true,
        category: "property",
        multipleAllowed: false,
        uploadedFiles: [],
        applicableFor: "primary",
      },
      {
        id: "doc8",
        name: "Property Insurance",
        description: "Current property insurance documentation",
        required: false,
        category: "property",
        multipleAllowed: false,
        uploadedFiles: [],
        applicableFor: "primary",
      },
      {
        id: "doc9",
        name: "Additional Assets",
        description: "Documentation of other assets (investments, properties, etc.)",
        required: false,
        category: "financial",
        multipleAllowed: true,
        uploadedFiles: [],
        applicableFor: "primary",
      },
      // Partner documents
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
        name: "Partner's Proof of Address",
        description: "Recent utility bill or bank statement showing partner's address",
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
        id: "doc12", 
        name: "Partner's Income Documents",
        description: "Last 3 months of pay slips or income statements",
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
      // Business documents
      {
        id: "doc13",
        name: "Business Registration",
        description: "Official business registration or incorporation documents",
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
      }
    ]

    return initialDocuments.filter((doc) => {
      if (!doc.conditionalDisplay) return true
      if (doc.conditionalDisplay.field === "hasPartner") return hasPartner === doc.conditionalDisplay.value
      if (doc.conditionalDisplay.field === "isBusinessOwner") return isBusinessOwner === doc.conditionalDisplay.value
      return true
    })
  }

  // Update progress calculation to properly handle conditional documents
  const updateProgress = (docs: Document[]) => {
    // Filter documents that should be considered for progress calculation
    // Only include documents that are applicable based on hasPartner and isBusinessOwner
    const applicableDocs = docs.filter(doc => {
      if (!doc.conditionalDisplay) return true;
      if (doc.conditionalDisplay.field === "hasPartner") return hasPartner === doc.conditionalDisplay.value;
      if (doc.conditionalDisplay.field === "isBusinessOwner") return isBusinessOwner === doc.conditionalDisplay.value;
      return true;
    });

    // Count required documents from the applicable ones
    const totalRequired = applicableDocs.filter(doc => doc.required).length;
    
    if (totalRequired === 0) return;

    // Count completed required documents from the applicable ones
    const completedRequired = applicableDocs.filter(
      doc => doc.required && doc.uploadedFiles.length > 0
    ).length;
    
    // Calculate progress percentage
    const newProgress = Math.round((completedRequired / totalRequired) * 100);
    setUploadProgress(newProgress);

    // Update total completed uploads count
    const totalCompleted = applicableDocs.filter(doc => doc.uploadedFiles.length > 0).length;
    setCompletedUploads(totalCompleted);
  };

  // Make sure to update progress when hasPartner or isBusinessOwner changes
  useEffect(() => {
    if (documents.length > 0) {
      updateProgress(documents);
    }
  }, [documents, hasPartner, isBusinessOwner]);
  const handleFileUpload = async (docId: string, file: File, metadata: any) => {
    try {
      const fileRecord: DocumentFile = {
        id: metadata?.fileId || `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        uploadDate: new Date().toISOString(),
        url: metadata?.url || "",
        cloudinaryId: metadata?.cloudinaryId || "",
      };

      // Create a new array with the updated document
      const updatedDocuments = documents.map((doc) => {
        if (doc.id === docId) {
          const newUploadedFiles = doc.multipleAllowed
            ? [...doc.uploadedFiles, fileRecord]
            : [fileRecord];
          return { ...doc, uploadedFiles: newUploadedFiles };
        }
        return doc;
      });
      
      // Update state first for immediate UI feedback
      setDocuments(updatedDocuments);
      
      // Then save to database
      await saveDocuments(updatedDocuments);
     
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been uploaded.`,
        variant: "default",
      });
      return true;
    } catch (error) {
      console.error("Error handling file upload:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleRemoveFile = async (docId: string, fileId: string) => {
    try {
      const doc = documents.find(d => d.id === docId);
      const file = doc?.uploadedFiles.find(f => f.id === fileId);
      
      // Create a new array with the updated document
      const updatedDocuments = documents.map((doc) => {
        if (doc.id === docId) {
          return { 
            ...doc, 
            uploadedFiles: doc.uploadedFiles.filter((file) => file.id !== fileId)
          };
        }
        return doc;
      });
      
      // Update state first for immediate UI feedback
      setDocuments(updatedDocuments);
      
      // Then delete file from storage if it exists
      if (file && file.cloudinaryId) {
        await api.delete(`/documents/file/${id}/${docId}/${fileId}/${file.cloudinaryId}`);
      }
      
      // Finally save updated documents to database
      await saveDocuments(updatedDocuments);
      
      toast({
        title: "File removed",
        description: "The file has been removed successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error removing file:", error);
      toast({
        title: "Error removing file",
        description: "There was an error removing the file. Please try again.",
        variant: "destructive",
      });
    }
  };
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
    router.push(`/pre-approval-status/${id}`)
  }

  const goToNextDocument = () => {
    const currentCategoryDocs = getDocumentsByCategory(currentCategory as Document["category"])
    if (currentDocumentIndex < currentCategoryDocs.length - 1) {
      setCurrentDocumentIndex(currentDocumentIndex + 1)
    } else {
      const categories = ["identity", "income", "financial", "property"]
      if (hasPartner) categories.push("partner")
      if (isBusinessOwner) categories.push("business")
      const currentCategoryIndex = categories.indexOf(currentCategory)
      if (currentCategoryIndex < categories.length - 1) {
        const nextCategory = categories[currentCategoryIndex + 1]
        setCurrentCategory(nextCategory)
        setCurrentDocumentIndex(0)
      } else {
        setActiveTab("overview")
      }
    }
  }

  const goToPreviousDocument = () => {
    if (currentDocumentIndex > 0) {
      setCurrentDocumentIndex(currentDocumentIndex - 1)
    } else {
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

          <Progress value={uploadProgress} className="h-4 mb-2 text-center" />

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

                  <div className="relative z-10 mb-8 flex items-start">
                    <div className="bg-green-600 rounded-full h-6 w-6 flex items-center justify-center text-white font-bold text-xs mr-4">
                      1
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-green-200 flex-1">
                      <h4 className="font-semibold text-green-800 flex items-center">
                        <Search className="h-4 w-4 mr-2 text-green-600" />
                        Document Review
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Our team will review your documents to ensure they meet all requirements. This typically takes
                        1-2 business days.
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 mb-8 flex items-start">
                    <div className="bg-green-600 rounded-full h-6 w-6 flex items-center justify-center text-white font-bold text-xs mr-4">
                      2
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-green-200 flex-1">
                      <h4 className="font-semibold text-green-800 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2 text-green-600" />
                        Additional Information (If Needed)
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        If we need any clarification or additional documents, we'll contact you via email or phone.
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 mb-8 flex items-start">
                    <div className="bg-green-600 rounded-full h-6 w-6 flex items-center justify-center text-white font-bold text-xs mr-4">
                      3
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-green-200 flex-1">
                      <h4 className="font-semibold text-green-800 flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-2 text-green-600" />
                        Pre-Approval Decision
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Once all documents are verified, we'll make a pre-approval decision on your loan application.
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-start">
                    <div className="bg-green-600 rounded-full h-6 w-6 flex items-center justify-center text-white font-bold text-xs mr-4">
                      4
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-green-200 flex-1">
                      <h4 className="font-semibold text-green-800 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-green-600" />
                        Next Steps
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        You'll receive notification of your pre-approval status, and we'll guide you through the next
                        steps in the loan process.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button onClick={handleContinueToPreApproval} className="bg-green-600 hover:bg-green-700">
                    Continue to Pre-Approval Status
                  </Button>
                </div>
              </div>
            )}

            {uploadProgress < 100 && (
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={() => {
                    setCurrentCategory("identity")
                    setCurrentDocumentIndex(0)
                    setActiveTab("document")
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Start Uploading Documents <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{getCurrentDocument()?.name || "Document"}</CardTitle>
            <CardDescription>{getCurrentDocument()?.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentUploader
              document={
                getCurrentDocument() || {
                  id: Date.now().toString(),
                  name: "",
                  description: "",
                  required: false,
                  category: "other",
                  multipleAllowed: false,
                  uploadedFiles: [],
                  applicableFor: "primary",
                }
              }
              loanInfoId={id as string}
              onFileUpload={async (docId: string, file: File, metadata: any): Promise<boolean> => {
                return await handleFileUpload(docId, file, metadata)
              }}
              onFileRemove={async (docId: string, fileId: string) => {
                await handleRemoveFile(docId, fileId)
              }}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={goToPreviousDocument}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button onClick={goToNextDocument}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Document Categories Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <File className="h-5 w-5 mr-2 text-blue-600" />
              Identity Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {getDocumentsByCategory("identity").map((doc) => (
                <li key={doc.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {doc.uploadedFiles.length > 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    ) : doc.required ? (
                      <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                    ) : (
                      <Info className="h-4 w-4 text-blue-600 mr-2" />
                    )}
                    <span className={doc.required ? "font-medium" : "text-gray-600"}>
                      {doc.name} {doc.required ? "*" : ""}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCurrentCategory("identity")
                      setCurrentDocumentIndex(getDocumentsByCategory("identity").indexOf(doc))
                      setActiveTab("document")
                    }}
                  >
                    {doc.uploadedFiles.length > 0 ? "View" : "Upload"}
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <File className="h-5 w-5 mr-2 text-blue-600" />
              Income Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {getDocumentsByCategory("income").map((doc) => (
                <li key={doc.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {doc.uploadedFiles.length > 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    ) : doc.required ? (
                      <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                    ) : (
                      <Info className="h-4 w-4 text-blue-600 mr-2" />
                    )}
                    <span className={doc.required ? "font-medium" : "text-gray-600"}>
                      {doc.name} {doc.required ? "*" : ""}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCurrentCategory("income")
                      setCurrentDocumentIndex(getDocumentsByCategory("income").indexOf(doc))
                      setActiveTab("document")
                    }}
                  >
                    {doc.uploadedFiles.length > 0 ? "View" : "Upload"}
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <File className="h-5 w-5 mr-2 text-blue-600" />
              Financial Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {getDocumentsByCategory("financial").map((doc) => (
                <li key={doc.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {doc.uploadedFiles.length > 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    ) : doc.required ? (
                      <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                    ) : (
                      <Info className="h-4 w-4 text-blue-600 mr-2" />
                    )}
                    <span className={doc.required ? "font-medium" : "text-gray-600"}>
                      {doc.name} {doc.required ? "*" : ""}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCurrentCategory("financial")
                      setCurrentDocumentIndex(getDocumentsByCategory("financial").indexOf(doc))
                      setActiveTab("document")
                    }}
                  >
                    {doc.uploadedFiles.length > 0 ? "View" : "Upload"}
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <File className="h-5 w-5 mr-2 text-blue-600" />
              Property Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {getDocumentsByCategory("property").map((doc) => (
                <li key={doc.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {doc.uploadedFiles.length > 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    ) : doc.required ? (
                      <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                    ) : (
                      <Info className="h-4 w-4 text-blue-600 mr-2" />
                    )}
                    <span className={doc.required ? "font-medium" : "text-gray-600"}>
                      {doc.name} {doc.required ? "*" : ""}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCurrentCategory("property")
                      setCurrentDocumentIndex(getDocumentsByCategory("property").indexOf(doc))
                      setActiveTab("document")
                    }}
                  >
                    {doc.uploadedFiles.length > 0 ? "View" : "Upload"}
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {hasPartner && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <File className="h-5 w-5 mr-2 text-blue-600" />
                Partner Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {getDocumentsByCategory("partner").map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {doc.uploadedFiles.length > 0 ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      ) : doc.required ? (
                        <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                      ) : (
                        <Info className="h-4 w-4 text-blue-600 mr-2" />
                      )}
                      <span className={doc.required ? "font-medium" : "text-gray-600"}>
                        {doc.name} {doc.required ? "*" : ""}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCurrentCategory("partner")
                        setCurrentDocumentIndex(getDocumentsByCategory("partner").indexOf(doc))
                        setActiveTab("document")
                      }}
                    >
                      {doc.uploadedFiles.length > 0 ? "View" : "Upload"}
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {isBusinessOwner && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <File className="h-5 w-5 mr-2 text-blue-600" />
                Business Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {getDocumentsByCategory("business").map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {doc.uploadedFiles.length > 0 ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      ) : doc.required ? (
                        <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                      ) : (
                        <Info className="h-4 w-4 text-blue-600 mr-2" />
                      )}
                      <span className={doc.required ? "font-medium" : "text-gray-600"}>
                        {doc.name} {doc.required ? "*" : ""}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCurrentCategory("business")
                        setCurrentDocumentIndex(getDocumentsByCategory("business").indexOf(doc))
                        setActiveTab("document")
                      }}
                    >
                      {doc.uploadedFiles.length > 0 ? "View" : "Upload"}
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-center mt-8">
        <Button
          variant="outline"
          onClick={() => {
            localStorage.setItem("loanInfoFormData",JSON.stringify({ _id: id }))
            location.href = "/loan-info/property"
          }}
          className="mr-4"
        >
          Back to Application
        </Button>
        {uploadProgress >= 70 && (
          <Button onClick={handleContinueToPreApproval} className="bg-green-600 hover:bg-green-700">
            Continue to Pre-Approval
          </Button>
        )}
        <Button
          onClick={() => getDocumentsById(id as string)}
          className="ml-4 bg-blue-600 hover:bg-blue-700"
        >
          Refresh Documents
        </Button>
      </div>
    </div>
  )
}