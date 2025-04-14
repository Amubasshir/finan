"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  FileText,
  CheckCircle,
  Download,
  ArrowLeft,
  Pen,
  InfoIcon as InfoCircle,
  HelpCircle,
  Eye,
  MessageSquare,
  Calendar,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"

export default function SignDocumentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [signing, setSigning] = useState(false)
  const [signed, setSigned] = useState(false)
  const [activeTab, setActiveTab] = useState("document")
  const [signatureProgress, setSignatureProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  // Mock document data
  const document = {
    id: params.id,
    title:
      params.id === "doc1"
        ? "Loan Contract"
        : params.id === "doc2"
          ? "Mortgage Documents"
          : "Direct Debit Authorization",
    description:
      params.id === "doc1"
        ? "Official loan agreement with terms and conditions"
        : params.id === "doc2"
          ? "Legal documents for property security"
          : "Authorization for automatic loan repayments",
    lender: "Commonwealth Bank",
    dateIssued: "2023-11-28",
    dueDate: params.id === "doc1" ? "2023-12-02" : params.id === "doc2" ? "2023-12-03" : "2023-12-05",
    pages: 12,
    signatureLocations: [
      { page: 4, description: "Borrower Signature" },
      { page: 8, description: "Acknowledgment of Terms" },
      { page: 12, description: "Final Acceptance" },
    ],
    status: params.id === "doc1" ? "urgent" : "pending",
  }

  // Signature steps
  const signatureSteps = [
    { title: "Review Document", description: "Review the document carefully before signing" },
    { title: "Create Signature", description: "Create or upload your signature" },
    { title: "Place Signature", description: "Place your signature at the required locations" },
    { title: "Confirm & Submit", description: "Verify and submit your signed document" },
  ]

  useEffect(() => {
    if (signing) {
      const interval = setInterval(() => {
        setSignatureProgress((prev) => {
          const newProgress = prev + 25
          if (newProgress >= 100) {
            clearInterval(interval)
            setSigned(true)
            setSigning(false)
            return 100
          }
          setCurrentStep(Math.floor(newProgress / 25))
          return newProgress
        })
      }, 800)

      return () => clearInterval(interval)
    }
  }, [signing])

  const handleSign = async () => {
    setSigning(true)
    setSignatureProgress(0)
    setCurrentStep(0)
  }

  const handleContinue = () => {
    router.push("/dashboard?tab=sign")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button variant="ghost" className="mb-6 hover:bg-gray-100" asChild>
        <Link href="/dashboard?tab=sign" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Link>
      </Button>

      {signed ? (
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-white shadow-lg">
          <div className="h-2 bg-green-500 rounded-t-lg"></div>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center text-green-800">Document Successfully Signed</CardTitle>
            <CardDescription className="text-center text-green-700">
              Thank you for signing {document.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-6 rounded-lg border border-green-200 mb-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Next Steps</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-green-100 rounded-full p-2 mr-3 mt-0.5">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Document has been submitted</p>
                    <p className="text-sm text-gray-600">
                      Your signed document has been securely submitted to {document.lender}
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 rounded-full p-2 mr-3 mt-0.5">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Confirmation email sent</p>
                    <p className="text-sm text-gray-600">
                      A confirmation email with a copy of the signed document has been sent to your registered email
                      address
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-3 mt-0.5">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Review remaining documents</p>
                    <p className="text-sm text-gray-600">
                      Please sign any remaining documents to continue with your loan application
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                <InfoCircle className="h-5 w-5 mr-2 text-blue-600" />
                What happens next?
              </h3>
              <p className="text-blue-700 text-sm">
                Your signed document will be processed by {document.lender}. You'll receive updates on your loan
                application progress in your dashboard.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 bg-gray-50 border-t">
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <Link href={`/documents/download/${document.id}`} className="flex items-center justify-center">
                <Download className="mr-2 h-4 w-4" />
                Download Signed Document
              </Link>
            </Button>
            <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700" onClick={handleContinue}>
              Continue to Dashboard
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <div className="flex items-center">
                <h1 className="text-3xl font-bold">{document.title}</h1>
                {document.status === "urgent" && <Badge className="ml-3 bg-red-100 text-red-800">Urgent</Badge>}
              </div>
              <p className="text-gray-600 mt-1">{document.description}</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <div className="flex items-center mr-4 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                <Calendar className="h-4 w-4 text-red-600 mr-1" />
                <span className="text-red-600 font-medium">Due: {document.dueDate}</span>
              </div>
              <Button
                disabled={signing}
                onClick={handleSign}
                className={document.status === "urgent" ? "bg-red-600 hover:bg-red-700" : ""}
              >
                {signing ? (
                  <div className="flex items-center">
                    <span className="mr-2">Signing...</span>
                    <span>{signatureProgress}%</span>
                  </div>
                ) : (
                  <>
                    <Pen className="mr-2 h-4 w-4" />
                    Sign Document
                  </>
                )}
              </Button>
            </div>
          </div>

          {signing && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Signature Progress</h3>
                <span className="text-sm font-medium">{signatureProgress}% Complete</span>
              </div>
              <Progress value={signatureProgress} className="h-2" />
              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-2">
                {signatureSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      currentStep === index
                        ? "bg-blue-50 border-blue-200"
                        : currentStep > index
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                          currentStep === index
                            ? "bg-blue-500 text-white"
                            : currentStep > index
                              ? "bg-green-500 text-white"
                              : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {currentStep > index ? <CheckCircle className="h-4 w-4" /> : <span>{index + 1}</span>}
                      </div>
                      <span
                        className={`font-medium ${
                          currentStep === index
                            ? "text-blue-700"
                            : currentStep > index
                              ? "text-green-700"
                              : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 ml-8">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Card className="shadow-lg overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white border-b">
              <Tabs defaultValue="document" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="document" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Document
                  </TabsTrigger>
                  <TabsTrigger value="details" className="flex items-center">
                    <InfoCircle className="mr-2 h-4 w-4" />
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="help" className="flex items-center">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-0">
              <TabsContent value="document" className="m-0">
                <div className="bg-gray-100 p-6">
                  <div className="bg-white shadow-lg w-full max-w-4xl mx-auto h-[600px] rounded-lg overflow-hidden">
                    <div className="bg-gray-50 border-b p-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="font-medium">{document.title}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Previous Page</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <span className="text-sm">Page 1 of {document.pages}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Next Page</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <div className="p-8 flex flex-col items-center justify-center h-[calc(600px-48px)]">
                      <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                          <img
                            src="/placeholder.svg?height=60&width=120"
                            alt={`${document.lender} logo`}
                            className="h-12"
                          />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">{document.title}</h2>
                        <p className="text-gray-500 mb-1">{document.description}</p>
                        <p className="text-sm text-gray-500">
                          Issued by: {document.lender} • Date: {document.dateIssued}
                        </p>
                      </div>

                      <div className="w-full border-t border-gray-200 my-6 pt-6">
                        <p className="text-center text-gray-600 mb-4">
                          This is a preview of the document. Please review carefully before signing.
                        </p>
                        <div className="flex justify-center">
                          <Button variant="outline" size="sm" className="flex items-center" asChild>
                            <Link href={`/documents/preview/${document.id}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              Open Full Document
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200 max-w-4xl mx-auto">
                    <h3 className="font-medium mb-3 flex items-center">
                      <Pen className="h-5 w-5 text-amber-600 mr-2" />
                      Signature Required at:
                    </h3>
                    <div className="space-y-2">
                      {document.signatureLocations.map((location, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 bg-amber-50 border border-amber-200 rounded-md"
                        >
                          <div className="bg-amber-100 rounded-full p-2 mr-3">
                            <Pen className="h-4 w-4 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-medium">Page {location.page}</p>
                            <p className="text-sm text-gray-600">{location.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="m-0">
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-blue-600" />
                        Document Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-500">Document Type</p>
                          <p className="font-medium">{document.title}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-500">Issued By</p>
                          <p className="font-medium">{document.lender}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-500">Date Issued</p>
                          <p className="font-medium">{document.dateIssued}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-500">Due Date</p>
                          <p className="font-medium">{document.dueDate}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-500">Pages</p>
                          <p className="font-medium">{document.pages}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-500">Status</p>
                          <div className="flex items-center">
                            <Badge
                              className={
                                document.status === "urgent" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                              }
                            >
                              {document.status === "urgent" ? "Urgent" : "Pending Signature"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <AlertTriangle className="mr-2 h-5 w-5 text-amber-600" />
                        Legal Information
                      </h3>
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-sm">
                        <p className="mb-3">
                          This document is a legally binding agreement between you and {document.lender}. By signing
                          this document, you acknowledge that:
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
                            <span>You have read and understood all terms and conditions</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
                            <span>You agree to be bound by the terms of this agreement</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
                            <span>The information you have provided is accurate and complete</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
                            <span>Your electronic signature is legally equivalent to your handwritten signature</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                        <InfoCircle className="h-5 w-5 mr-2 text-blue-600" />
                        Document Security
                      </h3>
                      <p className="text-blue-700 text-sm">
                        This document is secured with 256-bit encryption. All signatures are timestamped and a complete
                        audit trail is maintained for legal verification purposes.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="help" className="m-0">
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Pen className="mr-2 h-5 w-5 text-blue-600" />
                        How to Sign
                      </h3>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <ol className="space-y-3">
                          <li className="flex items-start">
                            <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-blue-700 text-sm font-medium">1</span>
                            </div>
                            <div>
                              <p className="font-medium text-blue-800">Review the document carefully</p>
                              <p className="text-sm text-blue-700">
                                Take your time to read and understand all terms and conditions
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-blue-700 text-sm font-medium">2</span>
                            </div>
                            <div>
                              <p className="font-medium text-blue-800">Click the "Sign Document" button</p>
                              <p className="text-sm text-blue-700">This will start the electronic signature process</p>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-blue-700 text-sm font-medium">3</span>
                            </div>
                            <div>
                              <p className="font-medium text-blue-800">Create or upload your signature</p>
                              <p className="text-sm text-blue-700">
                                You can type, draw, or upload an image of your signature
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-blue-700 text-sm font-medium">4</span>
                            </div>
                            <div>
                              <p className="font-medium text-blue-800">
                                Place your signature at the required locations
                              </p>
                              <p className="text-sm text-blue-700">
                                Follow the prompts to place your signature where indicated
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-blue-700 text-sm font-medium">5</span>
                            </div>
                            <div>
                              <p className="font-medium text-blue-800">Submit the signed document</p>
                              <p className="text-sm text-blue-700">Confirm and submit your signed document</p>
                            </div>
                          </li>
                        </ol>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <HelpCircle className="mr-2 h-5 w-5 text-purple-600" />
                        Frequently Asked Questions
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="font-medium">Is electronic signing legally binding?</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Yes, electronic signatures are legally binding under the Electronic Transactions Act in
                            Australia.
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="font-medium">Can I download a copy of the signed document?</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Yes, after signing you will be able to download a copy for your records. A copy will also be
                            emailed to you.
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="font-medium">What if I need to make changes to the document?</p>
                          <p className="text-sm text-gray-600 mt-1">
                            You cannot edit the document. If changes are needed, please contact your loan specialist.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h3 className="font-medium text-purple-800 mb-2 flex items-center">
                        <MessageSquare className="h-5 w-5 mr-2 text-purple-600" />
                        Need Help?
                      </h3>
                      <p className="text-purple-700 text-sm mb-3">
                        If you have any questions or need assistance with signing your documents, our support team is
                        here to help.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white border-purple-200 hover:border-purple-300"
                        asChild
                      >
                        <Link href="/contact-support" className="flex items-center">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Contact Support
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
            <CardFooter className="flex justify-between bg-gray-50 border-t p-4">
              <Button variant="outline" asChild>
                <Link href="/dashboard?tab=sign" className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Cancel
                </Link>
              </Button>
              <Button
                disabled={signing}
                onClick={handleSign}
                className={document.status === "urgent" ? "bg-red-600 hover:bg-red-700" : ""}
              >
                {signing ? (
                  <div className="flex items-center">
                    <span className="mr-2">Signing...</span>
                    <span>{signatureProgress}%</span>
                  </div>
                ) : (
                  <>
                    <Pen className="mr-2 h-4 w-4" />
                    Sign Document
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  )
}
