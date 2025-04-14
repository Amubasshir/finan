"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronRight,
  FileText,
  Upload,
  Download,
  Calendar,
  ArrowRight,
  Info,
  Star,
  ThumbsUp,
  X,
  Search,
  MessageSquare,
  Building,
  FileCheck,
  Home,
} from "lucide-react"
import Link from "next/link"
import { DocumentUploader } from "@/components/DocumentUploader"

interface DocumentRequest {
  id: string
  name: string
  description: string
  lender: string
  required: boolean
  deadline: string
  status: "pending" | "uploaded" | "verified"
}

interface Lender {
  id: string
  name: string
  logoUrl: string
  status: "reviewing" | "approved" | "declined" | "pending" | "more_info"
  applicationDate: string
  applicationId: string
  notes?: string
  additionalDocuments?: DocumentRequest[]
  offer?: LoanOffer
}

interface LoanOffer {
  id: string
  lenderId: string
  amount: number
  interestRate: number
  comparisonRate: number
  term: number
  monthlyRepayment: number
  totalRepayment: number
  features: string[]
  cashback?: number
  establishmentFee?: number
  annualFee?: number
  specialOffers?: string[]
  expiryDate: string
}

export default function PreApprovalContent() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [lenders, setLenders] = useState<Lender[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null)
  const [additionalDocuments, setAdditionalDocuments] = useState<DocumentRequest[]>([])
  const [showAcceptConfirmation, setShowAcceptConfirmation] = useState(false)

  useEffect(() => {
    const fetchLenderData = async () => {
      setLoading(true)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock data for lenders and their application status
      const mockLenders: Lender[] = [
        {
          id: "lender1",
          name: "Commonwealth Bank",
          logoUrl: "/placeholder.svg?height=60&width=120",
          status: "approved",
          applicationDate: "2023-04-15",
          applicationId: "CBA-78945",
          offer: {
            id: "offer1",
            lenderId: "lender1",
            amount: 450000,
            interestRate: 5.29,
            comparisonRate: 5.42,
            term: 30,
            monthlyRepayment: 2495.71,
            totalRepayment: 898456.6,
            features: ["Offset account", "Redraw facility", "Extra repayments"],
            cashback: 3000,
            establishmentFee: 395,
            annualFee: 395,
            specialOffers: ["Rate lock available", "First year annual fee waived"],
            expiryDate: "2023-05-15",
          },
        },
        {
          id: "lender2",
          name: "Westpac",
          logoUrl: "/placeholder.svg?height=60&width=120",
          status: "more_info",
          applicationDate: "2023-04-15",
          applicationId: "WBC-45678",
          notes: "Your application looks promising, but we need a few more documents to finalize our assessment.",
          additionalDocuments: [
            {
              id: "doc1",
              name: "Recent Superannuation Statement",
              description: "Please provide your most recent superannuation statement (last 6 months)",
              lender: "Westpac",
              required: true,
              deadline: "2023-04-25",
              status: "pending",
            },
            {
              id: "doc2",
              name: "Additional Bank Statement",
              description: "Please provide statements for any other bank accounts not already submitted",
              lender: "Westpac",
              required: true,
              deadline: "2023-04-25",
              status: "pending",
            },
          ],
        },
        {
          id: "lender3",
          name: "ANZ",
          logoUrl: "/placeholder.svg?height=60&width=120",
          status: "reviewing",
          applicationDate: "2023-04-15",
          applicationId: "ANZ-23456",
          notes:
            "Your application is currently under review by our credit team. We'll update you within 2-3 business days.",
        },
        {
          id: "lender4",
          name: "NAB",
          logoUrl: "/placeholder.svg?height=60&width=120",
          status: "approved",
          applicationDate: "2023-04-15",
          applicationId: "NAB-34567",
          offer: {
            id: "offer2",
            lenderId: "lender4",
            amount: 450000,
            interestRate: 5.35,
            comparisonRate: 5.48,
            term: 30,
            monthlyRepayment: 2512.69,
            totalRepayment: 904568.4,
            features: ["Offset account", "Redraw facility", "Split loan option"],
            cashback: 4000,
            establishmentFee: 0,
            annualFee: 395,
            specialOffers: ["No establishment fee"],
            expiryDate: "2023-05-20",
          },
        },
        {
          id: "lender5",
          name: "ING",
          logoUrl: "/placeholder.svg?height=60&width=120",
          status: "more_info",
          applicationDate: "2023-04-15",
          applicationId: "ING-56789",
          notes: "We need additional information about your employment history.",
          additionalDocuments: [
            {
              id: "doc3",
              name: "Employment Contract",
              description: "Please provide your current employment contract",
              lender: "ING",
              required: true,
              deadline: "2023-04-28",
              status: "pending",
            },
          ],
        },
      ]

      // Collect all additional documents from lenders
      const allAdditionalDocs = mockLenders
        .filter((lender) => lender.additionalDocuments && lender.additionalDocuments.length > 0)
        .flatMap((lender) => lender.additionalDocuments || [])

      setLenders(mockLenders)
      setAdditionalDocuments(allAdditionalDocs)
      setLoading(false)
    }

    fetchLenderData()
  }, [])

  const getApprovedLenders = () => {
    return lenders.filter((lender) => lender.status === "approved")
  }

  const getLendersRequiringMoreInfo = () => {
    return lenders.filter((lender) => lender.status === "more_info")
  }

  const getReviewingLenders = () => {
    return lenders.filter((lender) => lender.status === "reviewing")
  }

  const getDeclinedLenders = () => {
    return lenders.filter((lender) => lender.status === "declined")
  }

  const getTotalAdditionalDocuments = () => {
    return additionalDocuments.length
  }

  const getPendingAdditionalDocuments = () => {
    return additionalDocuments.filter((doc) => doc.status === "pending").length
  }

  const handleFileUpload = (docId: string, file: File) => {
    console.log(`Uploading file for document ${docId}: ${file.name}`)

    // Update document status
    setAdditionalDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          return { ...doc, status: "uploaded" as const }
        }
        return doc
      }),
    )
  }

  const handleAcceptOffer = (offerId: string) => {
    setSelectedLoanId(offerId)
    setShowAcceptConfirmation(true)
  }

  const confirmAcceptOffer = () => {
    // In a real app, this would make an API call to accept the offer
    console.log(`Accepting offer ${selectedLoanId}`)

    // Navigate to loan acceptance confirmation page
    router.push(`/loan-acceptance-confirmation?loanId=${selectedLoanId}`)
  }

  const cancelAcceptOffer = () => {
    setSelectedLoanId(null)
    setShowAcceptConfirmation(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="text-3xl font-bold text-center mb-8">Processing Your Application</h1>
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 mb-6">We're checking your application status with multiple lenders...</p>
          <Progress value={65} className="w-full max-w-md mx-auto h-3" />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-3">
                <Search className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Checking Status</h3>
                <p className="text-sm text-gray-600">Retrieving your application status</p>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-3">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Lender Updates</h3>
                <p className="text-sm text-gray-600">Getting the latest from lenders</p>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-3">
                <FileCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Document Check</h3>
                <p className="text-sm text-gray-600">Checking document requirements</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Pre-Approval Status</h1>
        <p className="text-gray-600 mb-4">Track your loan applications and respond to lender requests</p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="overview" className="text-base py-3">
            Overview
          </TabsTrigger>
          <TabsTrigger value="approved" className="text-base py-3">
            Approved Loans ({getApprovedLenders().length})
          </TabsTrigger>
          <TabsTrigger value="additional-docs" className="text-base py-3">
            Additional Documents ({getPendingAdditionalDocuments()})
          </TabsTrigger>
          <TabsTrigger value="all-lenders" className="text-base py-3">
            All Lenders ({lenders.length})
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                  Approved Loans
                </CardTitle>
                <CardDescription>Lenders who have approved your application</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {getApprovedLenders().length > 0 ? (
                  <div className="space-y-4">
                    {getApprovedLenders()
                      .slice(0, 2)
                      .map((lender) => (
                        <div key={lender.id} className="flex items-center justify-between border-b pb-4">
                          <div className="flex items-center">
                            <img
                              src={lender.logoUrl || "/placeholder.svg"}
                              alt={`${lender.name} logo`}
                              className="h-10 w-20 object-contain mr-3"
                            />
                            <div>
                              <h3 className="font-medium">{lender.name}</h3>
                              <p className="text-sm text-gray-500">
                                {lender.offer?.interestRate}% | ${lender.offer?.monthlyRepayment.toFixed(2)}/month
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Approved</Badge>
                        </div>
                      ))}

                    {getApprovedLenders().length > 2 && (
                      <div className="text-center mt-4">
                        <Button variant="outline" size="sm" onClick={() => setActiveTab("approved")}>
                          View All {getApprovedLenders().length} Approved Loans
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No approved loans yet</p>
                    <p className="text-sm text-gray-400 mt-1">Lenders are still reviewing your application</p>
                  </div>
                )}
              </CardContent>
              {getApprovedLenders().length > 0 && (
                <CardFooter className="bg-gray-50 border-t">
                  <Button className="w-full" onClick={() => setActiveTab("approved")}>
                    Compare & Accept Offers
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              )}
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100">
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-amber-600" />
                  Additional Documents Needed
                </CardTitle>
                <CardDescription>Documents requested by lenders to complete your application</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {getPendingAdditionalDocuments() > 0 ? (
                  <div className="space-y-4">
                    {additionalDocuments
                      .filter((doc) => doc.status === "pending")
                      .slice(0, 2)
                      .map((doc) => (
                        <div key={doc.id} className="border-b pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{doc.name}</h3>
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">{doc.lender}</Badge>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{doc.description}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-400">
                              Due by: {new Date(doc.deadline).toLocaleDateString()}
                            </p>
                            <Button variant="outline" size="sm" onClick={() => setActiveTab("additional-docs")}>
                              Upload
                              <Upload className="ml-2 h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}

                    {getPendingAdditionalDocuments() > 2 && (
                      <div className="text-center mt-4">
                        <Button variant="outline" size="sm" onClick={() => setActiveTab("additional-docs")}>
                          View All {getPendingAdditionalDocuments()} Required Documents
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No additional documents needed</p>
                    <p className="text-sm text-gray-400 mt-1">All requested documents have been submitted</p>
                  </div>
                )}
              </CardContent>
              {getPendingAdditionalDocuments() > 0 && (
                <CardFooter className="bg-gray-50 border-t">
                  <Button className="w-full" variant="outline" onClick={() => setActiveTab("additional-docs")}>
                    Upload Additional Documents
                    <Upload className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5 text-blue-600" />
                Application Status Summary
              </CardTitle>
              <CardDescription>Overview of your loan applications with all lenders</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-700">{getApprovedLenders().length}</h3>
                  <p className="text-sm text-green-600">Approved</p>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 mb-2">
                    <FileText className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-amber-700">{getLendersRequiringMoreInfo().length}</h3>
                  <p className="text-sm text-amber-600">Need More Info</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-700">{getReviewingLenders().length}</h3>
                  <p className="text-sm text-blue-600">Under Review</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mb-2">
                    <X className="h-5 w-5 text-gray-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700">{getDeclinedLenders().length}</h3>
                  <p className="text-sm text-gray-600">Declined</p>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2">What's Next?</h3>
                <ul className="space-y-2">
                  {getApprovedLenders().length > 0 && (
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                      <span className="text-gray-700">
                        <span className="font-medium">Compare and accept</span> one of your approved loan offers
                      </span>
                    </li>
                  )}

                  {getPendingAdditionalDocuments() > 0 && (
                    <li className="flex items-start">
                      <Upload className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                      <span className="text-gray-700">
                        <span className="font-medium">Upload the additional documents</span> requested by lenders
                      </span>
                    </li>
                  )}

                  {getReviewingLenders().length > 0 && (
                    <li className="flex items-start">
                      <Clock className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <span className="text-gray-700">
                        <span className="font-medium">Wait for responses</span> from lenders still reviewing your
                        application
                      </span>
                    </li>
                  )}

                  <li className="flex items-start">
                    <MessageSquare className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                    <span className="text-gray-700">
                      <span className="font-medium">Contact your loan specialist</span> if you have any questions
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-gray-600 mb-4">Need help with your application?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link href="/contact-specialist">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Contact Loan Specialist
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  <Home className="mr-2 h-5 w-5" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Approved Loans Tab */}
        <TabsContent value="approved">
          <div className="mb-6">
            <Alert className="bg-green-50 border-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Congratulations!</AlertTitle>
              <AlertDescription className="text-green-700">
                You have {getApprovedLenders().length} approved loan offers. Compare them below and select the one that
                best meets your needs.
              </AlertDescription>
            </Alert>
          </div>

          {showAcceptConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <Card className="max-w-md w-full">
                <CardHeader>
                  <CardTitle>Confirm Loan Acceptance</CardTitle>
                  <CardDescription>
                    You're about to accept a loan offer. This will initiate the final approval process.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Are you sure you want to proceed with this loan offer? Once accepted, we'll begin the settlement
                    process with this lender.
                  </p>
                  <p className="text-sm text-gray-500">
                    You can still cancel this process before final settlement if needed.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-4">
                  <Button variant="outline" onClick={cancelAcceptOffer}>
                    Cancel
                  </Button>
                  <Button onClick={confirmAcceptOffer}>Confirm Acceptance</Button>
                </CardFooter>
              </Card>
            </div>
          )}

          <div className="space-y-6">
            {getApprovedLenders().map((lender) => (
              <Card key={lender.id} className="overflow-hidden">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <CardTitle>{lender.name}</CardTitle>
                      <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" /> Approved
                      </Badge>
                    </div>
                    <CardDescription>
                      Application ID: {lender.applicationId} | Approved on:{" "}
                      {new Date(lender.applicationDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex-shrink-0">
                    <img src={lender.logoUrl || "/placeholder.svg"} alt={`${lender.name} logo`} className="h-12" />
                  </div>
                </CardHeader>
                <CardContent>
                  {lender.offer && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                          <p className="text-sm text-gray-500">Loan Amount</p>
                          <p className="text-2xl font-bold">${lender.offer.amount.toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                          <p className="text-sm text-gray-500">Interest Rate</p>
                          <p className="text-2xl font-bold text-blue-600">{lender.offer.interestRate}%</p>
                          <p className="text-xs text-gray-500">Comparison rate: {lender.offer.comparisonRate}%</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                          <p className="text-sm text-gray-500">Monthly Repayment</p>
                          <p className="text-2xl font-bold">${lender.offer.monthlyRepayment.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">Over {lender.offer.term} years</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                          <p className="text-sm text-gray-500">Cashback Offer</p>
                          <p className="text-2xl font-bold text-green-600">
                            {lender.offer.cashback ? `$${lender.offer.cashback.toLocaleString()}` : "None"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Key Features</h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {lender.offer.features.map((feature, index) => (
                              <li key={index} className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Fees & Special Offers</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Establishment Fee:</span>
                              <span className="font-medium">${lender.offer.establishmentFee}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Annual Fee:</span>
                              <span className="font-medium">${lender.offer.annualFee}/year</span>
                            </div>
                            {lender.offer.specialOffers &&
                              lender.offer.specialOffers.map((offer, index) => (
                                <div key={index} className="flex items-center">
                                  <Star className="h-4 w-4 text-amber-500 mr-2" />
                                  <span className="text-sm">{offer}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>

                      <Alert className="bg-blue-50 border-blue-100">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertTitle className="text-blue-800">Offer Expiry</AlertTitle>
                        <AlertDescription className="text-blue-700">
                          This offer is valid until {new Date(lender.offer.expiryDate).toLocaleDateString()}. Accept
                          before this date to secure these terms.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-4 pt-2 pb-6 px-6 bg-gray-50 border-t">
                  <Button
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleAcceptOffer(lender.offer?.id || "")}
                  >
                    <ThumbsUp className="mr-2 h-5 w-5" /> Accept This Offer
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Download className="mr-2 h-5 w-5" /> Download Full Offer
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <MessageSquare className="mr-2 h-5 w-5" /> Ask Questions
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {getApprovedLenders().length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500">No approved loans yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Check back soon as lenders complete their review of your application
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Additional Documents Tab */}
        <TabsContent value="additional-docs">
          <div className="mb-6">
            <Alert className="bg-amber-50 border-amber-100">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Additional Documents Required</AlertTitle>
              <AlertDescription className="text-amber-700">
                Some lenders need additional documents to complete your application. Upload them below to avoid delays.
              </AlertDescription>
            </Alert>
          </div>

          {getLendersRequiringMoreInfo().length > 0 ? (
            <div className="space-y-8">
              {getLendersRequiringMoreInfo().map((lender) => (
                <Card key={lender.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-amber-50 to amber-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <FileText className="mr-2 h-5 w-5 text-amber-600" />
                          {lender.name} - Additional Documents
                        </CardTitle>
                        <CardDescription>Application ID: {lender.applicationId}</CardDescription>
                      </div>
                      <img src={lender.logoUrl || "/placeholder.svg"} alt={`${lender.name} logo`} className="h-10" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {lender.notes && (
                      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-blue-800">{lender.notes}</p>
                      </div>
                    )}

                    <div className="space-y-6">
                      {lender.additionalDocuments?.map((doc) => (
                        <div key={doc.id} className="border-b pb-6">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-lg">{doc.name}</h3>
                            <Badge
                              className={`
                              ${doc.status === "pending" ? "bg-amber-100 text-amber-800" : ""}
                              ${doc.status === "uploaded" ? "bg-blue-100 text-blue-800" : ""}
                              ${doc.status === "verified" ? "bg-green-100 text-green-800" : ""}
                            `}
                            >
                              {doc.status === "pending" && "Pending"}
                              {doc.status === "uploaded" && "Uploaded"}
                              {doc.status === "verified" && "Verified"}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-4">{doc.description}</p>

                          <div className="mb-4">
                            <p className="text-sm text-gray-500 flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                              Due by: {new Date(doc.deadline).toLocaleDateString()}
                            </p>
                          </div>

                          {doc.status === "pending" && (
                            <DocumentUploader
                              document={{
                                id: doc.id,
                                name: doc.name,
                                description: doc.description,
                                required: doc.required,
                                multipleAllowed: false,
                                uploadedFiles: [],
                              }}
                              onFileUpload={handleFileUpload}
                              onFileRemove={() => {}}
                            />
                          )}

                          {doc.status === "uploaded" && (
                            <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                              <p className="text-blue-800 flex items-center">
                                <Info className="h-4 w-4 mr-2 text-blue-600" />
                                Document uploaded and pending verification by {lender.name}
                              </p>
                            </div>
                          )}

                          {doc.status === "verified" && (
                            <div className="bg-green-50 p-3 rounded-md border border-green-100">
                              <p className="text-green-800 flex items-center">
                                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                Document verified by {lender.name}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">All Documents Submitted</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                You've uploaded all requested documents. If lenders require any additional information, they'll appear
                here.
              </p>
            </div>
          )}
        </TabsContent>

        {/* All Lenders Tab */}
        <TabsContent value="all-lenders">
          <div className="space-y-6">
            {lenders.map((lender) => (
              <Card key={lender.id} className="overflow-hidden">
                <CardHeader
                  className={`pb-4 flex flex-row items-center justify-between
                  ${lender.status === "approved" ? "bg-gradient-to-r from-green-50 to-green-100" : ""}
                  ${lender.status === "more_info" ? "bg-gradient-to-r from-amber-50 to-amber-100" : ""}
                  ${lender.status === "reviewing" ? "bg-gradient-to-r from-blue-50 to-blue-100" : ""}
                  ${lender.status === "declined" ? "bg-gradient-to-r from-gray-50 to-gray-100" : ""}
                `}
                >
                  <div>
                    <div className="flex items-center">
                      <CardTitle>{lender.name}</CardTitle>
                      <Badge
                        className={`ml-2
                        ${lender.status === "approved" ? "bg-green-100 text-green-800" : ""}
                        ${lender.status === "more_info" ? "bg-amber-100 text-amber-800" : ""}
                        ${lender.status === "reviewing" ? "bg-blue-100 text-blue-800" : ""}
                        ${lender.status === "declined" ? "bg-gray-100 text-gray-800" : ""}
                      `}
                      >
                        {lender.status === "approved" && (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" /> Approved
                          </>
                        )}
                        {lender.status === "more_info" && (
                          <>
                            <FileText className="h-3 w-3 mr-1" /> Needs Documents
                          </>
                        )}
                        {lender.status === "reviewing" && (
                          <>
                            <Clock className="h-3 w-3 mr-1" /> Under Review
                          </>
                        )}
                        {lender.status === "declined" && (
                          <>
                            <X className="h-3 w-3 mr-1" /> Declined
                          </>
                        )}
                      </Badge>
                    </div>
                    <CardDescription>
                      Application ID: {lender.applicationId} | Submitted on:{" "}
                      {new Date(lender.applicationDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex-shrink-0">
                    <img src={lender.logoUrl || "/placeholder.svg"} alt={`${lender.name} logo`} className="h-12" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {lender.notes && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-blue-800">{lender.notes}</p>
                    </div>
                  )}

                  {lender.status === "approved" && lender.offer && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                        <p className="text-sm text-gray-500">Interest Rate</p>
                        <p className="text-xl font-bold text-blue-600">{lender.offer.interestRate}%</p>
                        <p className="text-xs text-gray-500">Comparison rate: {lender.offer.comparisonRate}%</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                        <p className="text-sm text-gray-500">Monthly Repayment</p>
                        <p className="text-xl font-bold">${lender.offer.monthlyRepayment.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Over {lender.offer.term} years</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                        <p className="text-sm text-gray-500">Cashback Offer</p>
                        <p className="text-xl font-bold text-green-600">
                          {lender.offer.cashback ? `$${lender.offer.cashback.toLocaleString()}` : "None"}
                        </p>
                      </div>
                    </div>
                  )}

                  {lender.status === "more_info" && lender.additionalDocuments && (
                    <div>
                      <h4 className="font-medium mb-2">Required Documents</h4>
                      <ul className="space-y-2">
                        {lender.additionalDocuments.map((doc) => (
                          <li key={doc.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 text-amber-600 mr-2" />
                              <span>{doc.name}</span>
                            </div>
                            <Badge
                              className={`
                              ${doc.status === "pending" ? "bg-amber-100 text-amber-800" : ""}
                              ${doc.status === "uploaded" ? "bg-blue-100 text-blue-800" : ""}
                              ${doc.status === "verified" ? "bg-green-100 text-green-800" : ""}
                            `}
                            >
                              {doc.status === "pending" && "Pending"}
                              {doc.status === "uploaded" && "Uploaded"}
                              {doc.status === "verified" && "Verified"}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {lender.status === "reviewing" && (
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-blue-600 mr-2" />
                      <p>
                        Your application is currently under review. Expected response by{" "}
                        {new Date(
                          new Date(lender.applicationDate).getTime() + 7 * 24 * 60 * 60 * 1000,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {lender.status === "declined" && (
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-gray-600 mr-2" />
                      <p>
                        This lender has declined your application. Contact your loan specialist for more information.
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-4 pt-2 pb-6 px-6 bg-gray-50 border-t">
                  {lender.status === "approved" && (
                    <>
                      <Button
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleAcceptOffer(lender.offer?.id || "")}
                      >
                        <ThumbsUp className="mr-2 h-5 w-5" /> Accept Offer
                      </Button>
                      <Button variant="outline" className="w-full sm:w-auto">
                        <Download className="mr-2 h-5 w-5" /> Download Details
                      </Button>
                    </>
                  )}

                  {lender.status === "more_info" && (
                    <Button className="w-full sm:w-auto" onClick={() => setActiveTab("additional-docs")}>
                      <Upload className="mr-2 h-5 w-5" /> Upload Documents
                    </Button>
                  )}

                  <Button variant="outline" className="w-full sm:w-auto">
                    <MessageSquare className="mr-2 h-5 w-5" /> Contact About Application
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
