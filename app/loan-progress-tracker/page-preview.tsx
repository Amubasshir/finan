"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, AlertTriangle, MessageSquare, Upload, Download, FileSignature } from "lucide-react"

// This is a preview component to show how the page looks when rendered
export default function LoanProgressTrackerPreview() {
  const [activeTab, setActiveTab] = useState("progress")
  const [newMessage, setNewMessage] = useState("")

  // Sample data for the progress stages
  const stages = [
    {
      name: "Application Submitted",
      completed: true,
      description: "Your application and documents have been received and are being prepared for review.",
    },
    {
      name: "Document Verification",
      completed: true,
      description: "Your documents are being verified for accuracy and completeness.",
    },
    {
      name: "Lender Review",
      completed: false,
      description: "The lender is reviewing your application, credit history, and financial situation.",
    },
    {
      name: "Property Valuation",
      completed: false,
      description: "A valuation of your property is being conducted to determine its current market value.",
    },
    {
      name: "Final Approval",
      completed: false,
      description: "Final assessment and approval of your refinance application.",
    },
    {
      name: "Loan Documentation",
      completed: false,
      description: "Preparation and signing of loan documents and contracts.",
    },
    {
      name: "Settlement",
      completed: false,
      description: "Final settlement process where your old loan is paid out and new loan is established.",
    },
  ]

  // Sample documents
  const documents = [
    {
      id: 1,
      name: "Loan Agreement",
      status: "Pending",
      type: "Digital",
      description:
        "The formal contract between you and the lender outlining all terms and conditions of your new loan.",
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
      name: "Mortgage Transfer",
      status: "Pending",
      type: "Download",
      description: "Document authorizing the transfer of your mortgage from your current lender to the new lender.",
    },
  ]

  // Sample messages
  const messages = [
    {
      sender: "Refii Team",
      message:
        "Welcome to your loan progress tracker. We've received your application and documents. Our team is reviewing them, and we'll keep you updated here.",
      timestamp: "3/8/2025, 10:15 AM",
    },
    {
      sender: "Refii Team",
      message:
        "Your documents have been verified. We're now preparing your application for lender review. This typically takes 1-2 business days.",
      timestamp: "3/8/2025, 11:30 AM",
    },
    {
      sender: "You",
      message: "Thank you for the update. When do you expect the property valuation to take place?",
      timestamp: "3/8/2025, 12:45 PM",
    },
    {
      sender: "Refii Team",
      message:
        "The property valuation is typically scheduled within 3-5 business days after the lender review is complete. We'll notify you once it's scheduled.",
      timestamp: "3/8/2025, 1:20 PM",
    },
  ]

  // Calculate progress percentage
  const progressPercentage = Math.round((stages.filter((stage) => stage.completed).length / stages.length) * 100)

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Refinance Application Progress</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="progress">Application Status</TabsTrigger>
          <TabsTrigger value="documents" className="relative">
            Documents to Sign
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
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
                  <Badge>In Progress</Badge>
                </div>
                <Progress value={progressPercentage} className="w-full h-6" />
                <div className="text-center text-sm font-medium">{progressPercentage}% Complete</div>
                <p className="font-semibold text-lg">Current Stage: Lender Review</p>

                <div className="mt-8 space-y-6">
                  {stages.map((stage, index) => (
                    <div key={index} className="flex">
                      <div className="flex-shrink-0 flex flex-col items-center mr-4">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            stage.completed
                              ? "bg-green-100 text-green-600"
                              : index === stages.findIndex((s) => !s.completed)
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {stage.completed ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : index === stages.findIndex((s) => !s.completed) ? (
                            <Clock className="h-6 w-6" />
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </div>
                        {index < stages.length - 1 && (
                          <div className={`w-0.5 h-16 ${stage.completed ? "bg-green-200" : "bg-gray-200"}`}></div>
                        )}
                      </div>
                      <div className="pt-1 pb-8">
                        <h3
                          className={`text-xl font-semibold mb-2 ${
                            stage.completed
                              ? "text-green-700"
                              : index === stages.findIndex((s) => !s.completed)
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
                        {!stage.completed && index === stages.findIndex((s) => !s.completed) && (
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
              <Alert className="mb-6 border-red-300 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <AlertTitle className="text-red-700 font-bold">New Documents Requested</AlertTitle>
                <AlertDescription className="text-red-700">
                  The lender has requested additional documents on 3/8/2025. Please review and upload them as soon as
                  possible to avoid delays in your application.
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2 mt-2 border-red-300 text-red-700 hover:bg-red-100"
                  >
                    Dismiss
                  </Button>
                </AlertDescription>
              </Alert>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Reason Requested</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>{doc.description}</TableCell>
                      <TableCell>
                        <Badge variant={doc.status === "Signed" ? "success" : "default"}>{doc.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {doc.status === "Pending" && (
                          <>
                            {doc.type === "Digital" && (
                              <Button>
                                <FileSignature className="mr-2 h-4 w-4" />
                                Sign Digitally
                              </Button>
                            )}
                            {doc.type === "Upload" && (
                              <Button>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Signed Document
                              </Button>
                            )}
                            {doc.type === "Download" && (
                              <Button>
                                <Download className="mr-2 h-4 w-4" />
                                Download & Sign
                              </Button>
                            )}
                          </>
                        )}
                        {doc.status === "Signed" && (
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

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                  Additional Documents Requested by Lender
                </h3>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Requested On</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Reason Requested</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Bank Statements (Last 6 months)</TableCell>
                      <TableCell>
                        The lender requires additional bank statements to verify your income consistency.
                      </TableCell>
                      <TableCell>3/8/2025</TableCell>
                      <TableCell>
                        <Badge variant="destructive">High</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge>Requested</Badge>
                      </TableCell>
                      <TableCell>
                        <Button>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Document
                        </Button>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        Income verification requires additional documentation due to variable income patterns.
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Employment Verification Letter</TableCell>
                      <TableCell>A letter from your employer confirming your employment status and income.</TableCell>
                      <TableCell>3/8/2025</TableCell>
                      <TableCell>
                        <Badge variant="destructive">High</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge>Requested</Badge>
                      </TableCell>
                      <TableCell>
                        <Button>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Document
                        </Button>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        Standard verification process for all applicants with less than 5 years at current employer.
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Explanation of Credit Inquiry</TableCell>
                      <TableCell>The lender noticed a recent credit inquiry and requires an explanation.</TableCell>
                      <TableCell>3/7/2025</TableCell>
                      <TableCell>
                        <Badge>Medium</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="success">Uploaded</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center text-amber-500">
                          <Clock className="mr-2 h-4 w-4" />
                          Under Review
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        Recent credit inquiry on your report needs clarification to ensure it won't affect your
                        borrowing capacity.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Promptly uploading any requested documents helps avoid delays in your refinancing process. High
                    priority documents should be uploaded within 48 hours of the request.
                  </AlertDescription>
                </Alert>
              </div>

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
              <ScrollArea className="h-[300px] mb-4 border rounded-md p-4">
                {messages.map((message, index) => (
                  <div key={index} className={`mb-4 ${message.sender === "You" ? "text-right" : ""}`}>
                    <div
                      className={`inline-block p-3 rounded-lg max-w-[80%] ${
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
                <Button>Send</Button>
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
    </div>
  )
}
