"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileUploader } from "@/components/FileUploader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, AlertTriangle, MessageSquare, Download, FileSignature } from "lucide-react"

interface LoanStatus {
  id: string
  status: string
  currentStage: string
  stages: { name: string; completed: boolean; description: string }[]
}

interface Message {
  sender: string
  message: string
  timestamp: string
}

interface Document {
  id: number
  name: string
  status: "Pending" | "Signed" | "Uploaded"
  type: "Digital" | "Upload" | "Download"
  description: string
}

// Add a new interface for requested documents
interface RequestedDocument {
  id: number
  name: string
  description: string
  requestDate: string
  status: "Requested" | "Uploaded" | "Approved"
  priority: "High" | "Medium" | "Low"
  reason: string
}

export default function LoanProgressTrackerContent() {
  const router = useRouter()

  const handleContinueToPreApproval = () => {
    router.push("/document-upload")
  }

  const searchParams = useSearchParams()
  const loanId = searchParams.get("loanId")

  // Update the stages to be business-focused
  const [loanStatus, setLoanStatus] = useState<LoanStatus>({
    id: loanId || "1",
    status: "In Progress",
    currentStage: "Application Review",
    stages: [
      {
        name: "Application Submitted",
        completed: true,
        description:
          "Your home loan refinancing application and documents have been received and are being prepared for review.",
      },
      {
        name: "Document Verification",
        completed: true,
        description: "Your personal and financial documents are being verified for accuracy and completeness.",
      },
      {
        name: "Credit Assessment",
        completed: false,
        description: "The lender is reviewing your credit history, income, and existing loan details.",
      },
      {
        name: "Property Valuation",
        completed: false,
        description:
          "A professional valuation of your property is being conducted to determine its current market value.",
      },
      {
        name: "Final Approval",
        completed: false,
        description: "Final assessment and approval of your home loan refinancing application.",
      },
      {
        name: "Loan Documentation",
        completed: false,
        description: "Preparation and signing of home loan documents and mortgage contracts.",
      },
      {
        name: "Settlement",
        completed: false,
        description: "Final settlement process where your old home loan is paid out and new loan is established.",
      },
    ],
  })

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "Refii Team",
      message:
        "Welcome to your loan progress tracker. We've received your application and documents. Our team is reviewing them, and we'll keep you updated here.",
      timestamp: new Date().toLocaleString(),
    },
    {
      sender: "Refii Team",
      message:
        "Your documents have been verified. We're now preparing your application for lender review. This typically takes 1-2 business days.",
      timestamp: new Date(Date.now() - 3600000).toLocaleString(), // 1 hour ago
    },
  ])

  const [newMessage, setNewMessage] = useState("")
  const [activeTab, setActiveTab] = useState("progress")

  // Update the documents to be business-focused
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 1,
      name: "Home Loan Agreement",
      status: "Pending",
      type: "Digital",
      description:
        "The formal contract between you and the lender outlining all terms and conditions of your new home loan.",
    },
    {
      id: 2,
      name: "Property Valuation Consent",
      status: "Pending",
      type: "Upload",
      description: "Authorization for the lender to conduct a valuation of your property.",
    },
    {
      id: 3,
      name: "Privacy Statement",
      status: "Signed",
      type: "Digital",
      description: "Consent for the lender to collect, use, and disclose your personal information.",
    },
    {
      id: 4,
      name: "Mortgage Discharge Authority",
      status: "Pending",
      type: "Download",
      description: "Document authorizing the discharge of your existing mortgage from your current lender.",
    },
    {
      id: 5,
      name: "Direct Debit Request",
      status: "Pending",
      type: "Digital",
      description: "Authorization for the lender to automatically deduct loan repayments from your account.",
    },
  ])

  // Add a new state for notifications about requested documents
  const [documentNotifications, setDocumentNotifications] = useState<{
    hasNew: boolean
    lastRequested: string
  }>({
    hasNew: true, // Set to true to show the notification by default
    lastRequested: new Date(Date.now() - 86400000).toLocaleDateString(), // 1 day ago
  })

  // Add the requestedDocuments state after the documents state
  // Update the requested documents to be business-focused
  const [requestedDocuments, setRequestedDocuments] = useState<RequestedDocument[]>([
    {
      id: 1,
      name: "Bank Statements (Last 3 months)",
      description: "The lender requires additional bank statements to verify your income and expenses.",
      requestDate: new Date(Date.now() - 86400000).toLocaleDateString(), // 1 day ago
      status: "Requested",
      priority: "High",
      reason: "Income verification requires additional documentation.",
    },
    {
      id: 2,
      name: "Proof of Additional Income",
      description: "Documentation for any additional income sources mentioned in your application.",
      requestDate: new Date(Date.now() - 86400000).toLocaleDateString(), // 1 day ago
      status: "Requested",
      priority: "High",
      reason: "Standard verification process for all home loan applicants.",
    },
    {
      id: 3,
      name: "Explanation of Credit Inquiry",
      description: "The lender noticed a recent credit inquiry and requires an explanation.",
      requestDate: new Date(Date.now() - 172800000).toLocaleDateString(), // 2 days ago
      status: "Uploaded",
      priority: "Medium",
      reason:
        "Recent credit inquiry on your report needs clarification to ensure it won't affect your borrowing capacity.",
    },
  ])

  const sendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        sender: "You",
        message: newMessage.trim(),
        timestamp: new Date().toLocaleString(),
      }
      setMessages([...messages, userMessage])
      setNewMessage("")

      // Simulate a response from the Refii team
      setTimeout(() => {
        const teamResponse = {
          sender: "Refii Team",
          message:
            "Thank you for your message. We've received it and will get back to you shortly if any action is required.",
          timestamp: new Date().toLocaleString(),
        }
        setMessages((prevMessages) => [...prevMessages, teamResponse])
      }, 1000)
    }
  }

  const handleFileUpload = (file: File) => {
    console.log("File uploaded:", file.name)
    // In a real application, you would handle the file upload here
    // Update the document status
    setDocuments((prev) =>
      prev.map((doc) => (doc.type === "Upload" && doc.status === "Pending" ? { ...doc, status: "Uploaded" } : doc)),
    )
  }

  const handleSignDocument = (documentId: number) => {
    console.log(`Signing document ${documentId}`)
    // In a real application, this would open a digital signature interface
    // For now, we'll just update the document status
    setDocuments((prev) => prev.map((doc) => (doc.id === documentId ? { ...doc, status: "Signed" } : doc)))
  }

  // Add a new function to handle uploads for requested documents
  const handleRequestedDocUpload = (docId: number, file: File) => {
    console.log(`Uploading requested document ${docId}: ${file.name}`)
    // In a real application, you would handle the file upload here
    // Update the document status
    setRequestedDocuments((prev) => prev.map((doc) => (doc.id === docId ? { ...doc, status: "Uploaded" } : doc)))

    // Simulate a message from the team acknowledging receipt
    setTimeout(() => {
      const teamResponse = {
        sender: "Refii Team",
        message: `Thank you for uploading the requested document. Our team will review it and update you soon.`,
        timestamp: new Date().toLocaleString(),
      }
      setMessages((prevMessages) => [...prevMessages, teamResponse])
    }, 1000)
  }

  // Add this function after the handleRequestedDocUpload function
  const dismissNotification = () => {
    setDocumentNotifications((prev) => ({
      ...prev,
      hasNew: false,
    }))
  }

  // Simulate progress updates
  useEffect(() => {
    const timer = setInterval(() => {
      setLoanStatus((prevStatus) => {
        const updatedStages = prevStatus.stages.map((stage, index) => {
          if (!stage.completed && Math.random() > 0.7) {
            return { ...stage, completed: true }
          }
          return stage
        })

        const completedStages = updatedStages.filter((stage) => stage.completed)
        const nextIncompleteStage = updatedStages.find((stage) => !stage.completed)
        const currentStage = nextIncompleteStage?.name || "Settlement"
        const status = completedStages.length === updatedStages.length ? "Completed" : "In Progress"

        return { ...prevStatus, stages: updatedStages, currentStage, status }
      })
    }, 30000) // Update every 30 seconds for demo purposes

    return () => clearInterval(timer)
  }, [])

  // Calculate progress percentage
  const progressPercentage = Math.round(
    (loanStatus.stages.filter((stage) => stage.completed).length / loanStatus.stages.length) * 100,
  )

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Refinance Application Progress</h1>

      <div className="flex justify-center mb-8">
        <Button
          onClick={handleContinueToPreApproval}
          size="lg"
          className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-6 text-lg font-semibold"
        >
          Continue to Pre-Approval
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="progress">Application Status</TabsTrigger>
          <TabsTrigger value="documents" className="relative">
            Documents to Sign
            {documentNotifications.hasNew && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
                Application Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Status:</span>
                  <Badge variant={loanStatus.status === "Completed" ? "success" : "default"}>{loanStatus.status}</Badge>
                </div>
                <Progress value={progressPercentage} className="w-full h-6" />
                <div className="text-center text-sm font-medium">{progressPercentage}% Complete</div>
                <p className="font-semibold text-lg">Current Stage: {loanStatus.currentStage}</p>

                <div className="mt-8 space-y-6">
                  {loanStatus.stages.map((stage, index) => (
                    <div key={index} className="flex">
                      <div className="flex-shrink-0 flex flex-col items-center mr-4">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            stage.completed
                              ? "bg-green-100 text-green-600"
                              : index === loanStatus.stages.findIndex((s) => !s.completed)
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {stage.completed ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : index === loanStatus.stages.findIndex((s) => !s.completed) ? (
                            <Clock className="h-6 w-6" />
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </div>
                        {index < loanStatus.stages.length - 1 && (
                          <div className={`w-0.5 h-16 ${stage.completed ? "bg-green-200" : "bg-gray-200"}`}></div>
                        )}
                      </div>
                      <div className="pt-1 pb-8">
                        <h3
                          className={`text-xl font-semibold mb-2 ${
                            stage.completed
                              ? "text-green-700"
                              : index === loanStatus.stages.findIndex((s) => !s.completed)
                                ? "text-blue-700"
                                : "text-gray-500"
                          }`}
                        >
                          {stage.name}
                        </h3>
                        <p className="text-gray-600">{stage.description}</p>
                        {stage.completed && (
                          <span className="inline-block mt-2 text-sm text-green-600 font-medium">Completed</span>
                        )}
                        {!stage.completed && index === loanStatus.stages.findIndex((s) => !s.completed) && (
                          <span className="inline-block mt-2 text-sm text-blue-600 font-medium">In Progress</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Next Steps</AlertTitle>
            <AlertDescription>
              Keep an eye on this page for updates on your loan progress. We'll notify you here if we need any
              additional information or documents. You can also check the "Documents to Sign" tab for any documents that
              require your signature.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileSignature className="mr-2 h-6 w-6 text-purple-500" />
                Documents Requiring Your Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              {documentNotifications.hasNew && (
                <Alert className="mb-6 border-red-300 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <AlertTitle className="text-red-700 font-bold">New Documents Requested</AlertTitle>
                  <AlertDescription className="text-red-700">
                    The lender has requested additional documents on {documentNotifications.lastRequested}. Please
                    review and upload them as soon as possible to avoid delays in your application.
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={dismissNotification}
                      className="ml-2 mt-2 border-red-300 text-red-700 hover:bg-red-100"
                    >
                      Dismiss
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>{doc.description}</TableCell>
                      <TableCell>
                        <Badge variant={doc.status === "Signed" || doc.status === "Uploaded" ? "success" : "default"}>
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {doc.status === "Pending" && (
                          <>
                            {doc.type === "Digital" && (
                              <Button onClick={() => handleSignDocument(doc.id)}>
                                <FileSignature className="mr-2 h-4 w-4" />
                                Sign Digitally
                              </Button>
                            )}
                            {doc.type === "Upload" && (
                              <FileUploader
                                onFileSelect={handleFileUpload}
                                acceptedFileTypes=".pdf,.jpg,.png"
                                maxFileSize={5 * 1024 * 1024} // 5MB
                              />
                            )}
                            {doc.type === "Download" && (
                              <Button asChild>
                                <a href={`/api/documents/${doc.id}/download`} download>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download & Sign
                                </a>
                              </Button>
                            )}
                          </>
                        )}
                        {(doc.status === "Signed" || doc.status === "Uploaded") && (
                          <span className="flex items-center text-green-500">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Completed
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Digital Signature Process</h3>
                <p className="text-sm text-blue-600 mb-2">
                  When you click "Sign Digitally", you'll be guided through our secure electronic signature process:
                </p>
                <ol className="list-decimal list-inside text-sm text-blue-600 space-y-1">
                  <li>Review the document contents carefully</li>
                  <li>Verify your identity with a one-time security code sent to your phone</li>
                  <li>Create or upload your signature</li>
                  <li>Place your signature on the document where indicated</li>
                  <li>Confirm and submit your signed document</li>
                </ol>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                  Additional Documents Requested by Lender
                </h3>

                {requestedDocuments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Requested On</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reason Requested</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requestedDocuments.map((doc) => (
                        <TableRow key={`requested-${doc.id}`}>
                          <TableCell className="font-medium">{doc.name}</TableCell>
                          <TableCell>{doc.description}</TableCell>
                          <TableCell>{doc.requestDate}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                doc.priority === "High"
                                  ? "destructive"
                                  : doc.priority === "Medium"
                                    ? "default"
                                    : "outline"
                              }
                            >
                              {doc.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                doc.status === "Uploaded"
                                  ? "success"
                                  : doc.status === "Approved"
                                    ? "success"
                                    : "default"
                              }
                            >
                              {doc.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">{doc.reason}</TableCell>
                          <TableCell>
                            {doc.status === "Requested" ? (
                              <FileUploader
                                onFileSelect={(file) => handleRequestedDocUpload(doc.id, file)}
                                acceptedFileTypes=".pdf,.jpg,.png,.doc,.docx"
                                maxFileSize={10 * 1024 * 1024} // 10MB
                              />
                            ) : doc.status === "Uploaded" ? (
                              <span className="flex items-center text-amber-500">
                                <Clock className="mr-2 h-4 w-4" />
                                Under Review
                              </span>
                            ) : (
                              <span className="flex items-center text-green-500">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approved
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No additional documents have been requested at this time.</p>
                  </div>
                )}

                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Promptly uploading any requested documents helps avoid delays in your refinancing process. High
                    priority documents should be uploaded within 48 hours of the request.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-6 w-6 text-blue-500" />
                Communication with Our Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] mb-4">
                {messages.map((message, index) => (
                  <div key={index} className={`mb-4 ${message.sender === "You" ? "text-right" : ""}`}>
                    <div
                      className={`inline-block p-3 rounded-lg ${
                        message.sender === "You" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p>{message.message}</p>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="font-semibold">{message.sender}</span> • {message.timestamp}
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <div className="flex space-x-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-grow"
                />
                <Button onClick={sendMessage}>Send</Button>
              </div>

              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                <p className="text-sm mb-2">If you need immediate assistance, you can also reach us through:</p>
                <ul className="text-sm space-y-1">
                  <li>
                    <span className="font-medium">Phone:</span> 1800-REFII (1800-73344)
                  </li>
                  <li>
                    <span className="font-medium">Email:</span> support@refii.com
                  </li>
                  <li>
                    <span className="font-medium">Hours:</span> Monday-Friday, 9am-5pm AEST
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Floating Pre-Approval Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={handleContinueToPreApproval}
          size="lg"
          className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg rounded-full px-6 py-6 flex items-center"
        >
          <span className="mr-2">Continue to Pre-Approval</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-arrow-right"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
