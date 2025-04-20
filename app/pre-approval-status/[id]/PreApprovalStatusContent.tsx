"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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
  FileText,
  Upload,
  Download,
  Calendar,
  ArrowRight,
  Info,
  Star,
  ThumbsUp,
  X,
  MessageSquare,
  Home,
  DollarSign,
  Percent,
  Shield,
  Search,
  Bell,
  Phone,
  Building,
} from "lucide-react"
import Link from "next/link"

interface Bank {
  id: string
  name: string
  logoUrl: string
  color: string
  status: "reviewing" | "approved" | "declined" | "more_info"
  applicationId: string
  applicationDate: string
  notes?: string
  additionalDocuments?: AdditionalDocument[]
  offer?: LoanOffer
}

interface AdditionalDocument {
  id: string
  name: string
  description: string
  deadline: string
  status: "pending" | "uploaded" | "verified"
}

interface LoanOffer {
  amount: number
  interestRate: number
  comparisonRate: number
  term: number
  monthlyRepayment: number
  totalRepayment: number
  features: string[]
  cashback?: number
  establishmentFee: number
  annualFee: number
  specialOffers?: string[]
  expiryDate: string
}

export default function PreApprovalStatusContent() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [banks, setBanks] = useState<Bank[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null)
  const [showAcceptConfirmation, setShowAcceptConfirmation] = useState(false)
const {id}=useParams()
  useEffect(() => {
    const fetchBankData = async () => {
      setLoading(true)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock data for the Big 4 Australian banks
      const mockBanks: Bank[] = [
        {
          id: "cba",
          name: "Commonwealth Bank",
          logoUrl: "/placeholder.svg?height=60&width=120",
          color: "#FFCC00",
          status: "approved",
          applicationId: "CBA-78945",
          applicationDate: "2023-04-15",
          offer: {
            amount: 450000,
            interestRate: 5.29,
            comparisonRate: 5.42,
            term: 30,
            monthlyRepayment: 2495.71,
            totalRepayment: 898456.6,
            features: ["Offset account", "Redraw facility", "Extra repayments", "Split loan option"],
            cashback: 3000,
            establishmentFee: 395,
            annualFee: 395,
            specialOffers: ["Rate lock available", "First year annual fee waived"],
            expiryDate: "2023-05-15",
          },
        },
        {
          id: "westpac",
          name: "Westpac",
          logoUrl: "/placeholder.svg?height=60&width=120",
          color: "#D5002B",
          status: "more_info",
          applicationId: "WBC-45678",
          applicationDate: "2023-04-15",
          notes: "Your application looks promising, but we need a few more documents to finalize our assessment.",
          additionalDocuments: [
            {
              id: "doc1",
              name: "Recent Superannuation Statement",
              description: "Please provide your most recent superannuation statement (last 6 months)",
              deadline: "2023-04-25",
              status: "pending",
            },
            {
              id: "doc2",
              name: "Additional Bank Statement",
              description: "Please provide statements for any other bank accounts not already submitted",
              deadline: "2023-04-25",
              status: "pending",
            },
          ],
        },
        {
          id: "anz",
          name: "ANZ",
          logoUrl: "/placeholder.svg?height=60&width=120",
          color: "#0072AC",
          status: "reviewing",
          applicationId: "ANZ-23456",
          applicationDate: "2023-04-15",
          notes:
            "Your application is currently under review by our credit team. We'll update you within 2-3 business days.",
        },
        {
          id: "nab",
          name: "NAB",
          logoUrl: "/placeholder.svg?height=60&width=120",
          color: "#E50000",
          status: "approved",
          applicationId: "NAB-34567",
          applicationDate: "2023-04-15",
          offer: {
            amount: 450000,
            interestRate: 5.35,
            comparisonRate: 5.48,
            term: 30,
            monthlyRepayment: 2512.69,
            totalRepayment: 904568.4,
            features: ["Offset account", "Redraw facility", "Split loan option", "Interest only option"],
            cashback: 4000,
            establishmentFee: 0,
            annualFee: 395,
            specialOffers: ["No establishment fee", "Free property valuation"],
            expiryDate: "2023-05-20",
          },
        },
      ]

      setBanks(mockBanks)
      setLoading(false)
    }

    fetchBankData()
  }, [])

  const getApprovedBanks = () => {
    return banks.filter((bank) => bank.status === "approved")
  }

  const getBanksRequiringMoreInfo = () => {
    return banks.filter((bank) => bank.status === "more_info")
  }

  const getReviewingBanks = () => {
    return banks.filter((bank) => bank.status === "reviewing")
  }

  const getDeclinedBanks = () => {
    return banks.filter((bank) => bank.status === "declined")
  }

  const getTotalAdditionalDocuments = () => {
    return banks
      .filter((bank) => bank.additionalDocuments && bank.additionalDocuments.length > 0)
      .flatMap((bank) => bank.additionalDocuments || [])
      .filter((doc) => doc.status === "pending").length
  }

  const handleAcceptOffer = (bankId: string) => {
    setSelectedBankId(bankId)
    setShowAcceptConfirmation(true)
  }

  const confirmAcceptOffer = () => {
    // In a real app, this would make an API call to accept the offer
    console.log(`Accepting offer from bank ${selectedBankId}`)

    // Navigate to loan acceptance confirmation page
    router.push(`/loan-acceptance-confirmation?bankId=${selectedBankId}`)
  }

  const cancelAcceptOffer = () => {
    setSelectedBankId(null)
    setShowAcceptConfirmation(false)
  }

  const handleUploadDocument = (bankId: string, docId: string) => {
    // In a real app, this would open a file picker and handle the upload
    console.log(`Uploading document ${docId} for bank ${bankId}`)

    // For demo purposes, we'll just update the document status
    setBanks((prev) =>
      prev.map((bank) => {
        if (bank.id === bankId && bank.additionalDocuments) {
          return {
            ...bank,
            additionalDocuments: bank.additionalDocuments.map((doc) => {
              if (doc.id === docId) {
                return { ...doc, status: "uploaded" as const }
              }
              return doc
            }),
          }
        }
        return bank
      }),
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="text-3xl font-bold text-center mb-8">Checking Your Pre-Approval Status</h1>
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 mb-6">
            We're retrieving your application status from Australia's major banks...
          </p>
          <Progress value={65} className="w-full max-w-md mx-auto h-3" />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {["Commonwealth Bank", "Westpac", "ANZ", "NAB"].map((bank, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col items-center">
                <div className="bg-white p-3 rounded-lg border border-gray-200 w-24 h-16 flex items-center justify-center mb-3">
                  <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
                </div>
                <div className="w-20 h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="w-16 h-4 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Pre-Approval Status</h1>
        <p className="text-gray-600 mb-4">
          Track your loan application progress from conditional approval to pre-approval
        </p>
      </div>

      {/* New section explaining Refii's ongoing work */}
      <Card className="mb-8">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardTitle className="flex items-center">
            <Info className="mr-2 h-5 w-5 text-blue-600" />
            Moving from Conditional Approval to Pre-Approval
          </CardTitle>
          <CardDescription>
            We're verifying your information to convert your conditional approvals into formal pre-approvals
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Search className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Finding Your Best Loan Options</h3>
                <p className="text-gray-600">
                  Our team is currently verifying your documents and financial information to convert your conditional
                  approvals into formal pre-approvals. We're also negotiating with lenders to secure the most
                  competitive terms that align with your specific requirements.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Stay Updated</h3>
                <p className="text-gray-600">
                  Please check this page regularly for the latest updates on your application status. We'll also send
                  you timely email notifications whenever there are significant developments or new offers available for
                  your consideration.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Personal Assistance</h3>
                <p className="text-gray-600">
                  A dedicated Refii loan specialist will contact you by phone within the next 24-48 hours to discuss
                  your pre-approved offers. They'll provide expert guidance to help you select the loan option that best
                  suits your financial goals and circumstances.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="overview" className="text-base py-3">
            Overview
          </TabsTrigger>
          <TabsTrigger value="approved" className="text-base py-3">
            Approved Loans ({getApprovedBanks().length})
          </TabsTrigger>
          <TabsTrigger value="additional-docs" className="text-base py-3">
            Required Documents ({getTotalAdditionalDocuments()})
          </TabsTrigger>
          <TabsTrigger value="other-lenders" className="text-base py-3">
            Other Lenders
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
                <CardDescription>Banks that have approved your application</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {getApprovedBanks().length > 0 ? (
                  <div className="space-y-4">
                    {getApprovedBanks().map((bank) => (
                      <div key={bank.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center">
                          <div className="w-16 h-12 bg-white rounded-md border border-gray-200 flex items-center justify-center mr-3">
                            <img
                              src={bank.logoUrl || "/placeholder.svg"}
                              alt={`${bank.name} logo`}
                              className="h-8 object-contain"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{bank.name}</h3>
                            <p className="text-sm text-gray-500">
                              {bank.offer?.interestRate}% | ${bank.offer?.monthlyRepayment.toFixed(2)}/month
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Pre-Approved</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No approved loans yet</p>
                    <p className="text-sm text-gray-400 mt-1">Banks are still reviewing your application</p>
                  </div>
                )}
              </CardContent>
              {getApprovedBanks().length > 0 && (
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
                <CardDescription>Documents requested by banks to complete your application</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {getTotalAdditionalDocuments() > 0 ? (
                  <div className="space-y-4">
                    {getBanksRequiringMoreInfo().map((bank) =>
                      bank.additionalDocuments?.map((doc, index) => (
                        <div key={`${bank.id}-${doc.id}`} className="border-b pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-white rounded-md border border-gray-200 flex items-center justify-center mr-2">
                                <img
                                  src={bank.logoUrl || "/placeholder.svg"}
                                  alt={`${bank.name} logo`}
                                  className="h-5 object-contain"
                                />
                              </div>
                              <h3 className="font-medium">{doc.name}</h3>
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
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{doc.description}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-400">
                              Due by: {new Date(doc.deadline).toLocaleDateString()}
                            </p>
                            {doc.status === "pending" && (
                              <Button variant="outline" size="sm" onClick={() => handleUploadDocument(bank.id, doc.id)}>
                                Upload
                                <Upload className="ml-2 h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      )),
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No additional documents needed</p>
                    <p className="text-sm text-gray-400 mt-1">All requested documents have been submitted</p>
                  </div>
                )}
              </CardContent>
              {getTotalAdditionalDocuments() > 0 && (
                <CardFooter className="bg-gray-50 border-t">
                  <Button className="w-full" variant="outline" onClick={() => setActiveTab("additional-docs")}>
                    View All Required Documents
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5 text-blue-600" />
                Application Status with Major Banks
              </CardTitle>
              <CardDescription>Overview of your loan applications with Australia's Big 4 banks</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {banks.map((bank) => (
                  <div key={bank.id} className="border rounded-lg overflow-hidden">
                    <div className="p-4 flex flex-col items-center">
                      <div className="w-16 h-12 bg-white rounded-md border border-gray-200 flex items-center justify-center mb-3">
                        <img
                          src={bank.logoUrl || "/placeholder.svg"}
                          alt={`${bank.name} logo`}
                          className="h-8 object-contain"
                        />
                      </div>
                      <h3 className="font-medium text-center">{bank.name}</h3>
                      <Badge
                        className={`mt-2
                        ${bank.status === "approved" ? "bg-green-100 text-green-800" : ""}
                        ${bank.status === "more_info" ? "bg-amber-100 text-amber-800" : ""}
                        ${bank.status === "reviewing" ? "bg-blue-100 text-blue-800" : ""}
                        ${bank.status === "declined" ? "bg-gray-100 text-gray-800" : ""}
                      `}
                      >
                        {bank.status === "approved" && (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" /> Pre-Approved
                          </>
                        )}
                        {bank.status === "more_info" && (
                          <>
                            <FileText className="h-3 w-3 mr-1" /> Needs Docs
                          </>
                        )}
                        {bank.status === "reviewing" && (
                          <>
                            <Clock className="h-3 w-3 mr-1" /> Reviewing
                          </>
                        )}
                        {bank.status === "declined" && (
                          <>
                            <X className="h-3 w-3 mr-1" /> Declined
                          </>
                        )}
                      </Badge>
                    </div>
                    <div className="bg-gray-50 p-3 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">App ID: {bank.applicationId}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => {
                            if (bank.status === "approved") {
                              setActiveTab("approved")
                            } else if (bank.status === "more_info") {
                              setActiveTab("additional-docs")
                            }
                          }}
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2">What's Next?</h3>
                <ul className="space-y-2">
                  {getApprovedBanks().length > 0 && (
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                      <span className="text-gray-700">
                        <span className="font-medium">Compare and accept</span> one of your approved loan offers
                      </span>
                    </li>
                  )}

                  {getTotalAdditionalDocuments() > 0 && (
                    <li className="flex items-start">
                      <Upload className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                      <span className="text-gray-700">
                        <span className="font-medium">Upload the additional documents</span> requested by banks
                      </span>
                    </li>
                  )}

                  {getReviewingBanks().length > 0 && (
                    <li className="flex items-start">
                      <Clock className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <span className="text-gray-700">
                        <span className="font-medium">Wait for responses</span> from banks still reviewing your
                        application
                      </span>
                    </li>
                  )}
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
                    process with this bank.
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

          <div className="mb-6">
            <Alert className="bg-green-50 border-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Congratulations!</AlertTitle>
              <AlertDescription className="text-green-700">
                You have {getApprovedBanks().length} pre-approved loan offers. Compare them below and select the one
                that best meets your needs to move to final approval.
              </AlertDescription>
            </Alert>
          </div>

          <div className="space-y-8">
            {getApprovedBanks().map((bank) => (
              <Card key={bank.id} className="overflow-hidden">
                <CardHeader className={`pb-4 border-b`} style={{ backgroundColor: `${bank.color}10` }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <CardTitle>{bank.name}</CardTitle>
                        <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" /> Pre-Approved
                        </Badge>
                      </div>
                      <CardDescription>
                        Application ID: {bank.applicationId} | Approved on:{" "}
                        {new Date(bank.applicationDate).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="w-24 h-16 bg-white rounded-md border border-gray-200 flex items-center justify-center">
                      <img
                        src={bank.logoUrl || "/placeholder.svg"}
                        alt={`${bank.name} logo`}
                        className="h-10 object-contain"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {bank.offer && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex items-center text-gray-500 mb-1">
                            <DollarSign className="h-4 w-4 mr-1" />
                            <p className="text-sm">Loan Amount</p>
                          </div>
                          <p className="text-2xl font-bold">${bank.offer.amount.toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex items-center text-gray-500 mb-1">
                            <Percent className="h-4 w-4 mr-1" />
                            <p className="text-sm">Interest Rate</p>
                          </div>
                          <p className="text-2xl font-bold text-blue-600">{bank.offer.interestRate}%</p>
                          <p className="text-xs text-gray-500">Comparison rate: {bank.offer.comparisonRate}%</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex items-center text-gray-500 mb-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            <p className="text-sm">Monthly Repayment</p>
                          </div>
                          <p className="text-2xl font-bold">${bank.offer.monthlyRepayment.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">Over {bank.offer.term} years</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex items-center text-gray-500 mb-1">
                            <DollarSign className="h-4 w-4 mr-1" />
                            <p className="text-sm">Cashback Offer</p>
                          </div>
                          <p className="text-2xl font-bold text-green-600">
                            {bank.offer.cashback ? `$${bank.offer.cashback.toLocaleString()}` : "None"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3 flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-blue-600" />
                            Key Features
                          </h4>
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {bank.offer.features.map((feature, index) => (
                                <li key={index} className="flex items-center">
                                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                                  <span className="text-sm">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3 flex items-center">
                            <Info className="h-4 w-4 mr-2 text-blue-600" />
                            Fees & Special Offers
                          </h4>
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Establishment Fee:</span>
                                <span className="font-medium">${bank.offer.establishmentFee}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Annual Fee:</span>
                                <span className="font-medium">${bank.offer.annualFee}/year</span>
                              </div>
                              {bank.offer.specialOffers &&
                                bank.offer.specialOffers.map((offer, index) => (
                                  <div key={index} className="flex items-center">
                                    <Star className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                                    <span className="text-sm">{offer}</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Alert className="bg-blue-50 border-blue-100">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertTitle className="text-blue-800">Offer Expiry</AlertTitle>
                        <AlertDescription className="text-blue-700">
                          This offer is valid until {new Date(bank.offer.expiryDate).toLocaleDateString()}. Accept
                          before this date to secure these terms.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-4 pt-4 pb-6 px-6 bg-gray-50 border-t">
                  <Button
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleAcceptOffer(bank.id)}
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

            {getApprovedBanks().length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500">No approved loans yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Check back soon as banks complete their review of your application
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
                Some banks need additional documents to complete your application. Upload them below to avoid delays.
              </AlertDescription>
            </Alert>
          </div>

          {getBanksRequiringMoreInfo().length > 0 ? (
            <div className="space-y-8">
              {getBanksRequiringMoreInfo().map((bank) => (
                <Card key={bank.id} className="overflow-hidden">
                  <CardHeader className={`border-b`} style={{ backgroundColor: `${bank.color}10` }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <FileText className="mr-2 h-5 w-5 text-amber-600" />
                          {bank.name} - Additional Documents
                        </CardTitle>
                        <CardDescription>Application ID: {bank.applicationId}</CardDescription>
                      </div>
                      <div className="w-24 h-16 bg-white rounded-md border border-gray-200 flex items-center justify-center">
                        <img
                          src={bank.logoUrl || "/placeholder.svg"}
                          alt={`${bank.name} logo`}
                          className="h-10 object-contain"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {bank.notes && (
                      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-blue-800">{bank.notes}</p>
                      </div>
                    )}

                    <div className="space-y-6">
                      {bank.additionalDocuments?.map((doc) => (
                        <div key={doc.id} className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
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

                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500 flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                              Due by: {new Date(doc.deadline).toLocaleDateString()}
                            </p>

                            {doc.status === "pending" && (
                              <Button
                                onClick={() => handleUploadDocument(bank.id, doc.id)}
                                className="bg-amber-600 hover:bg-amber-700 text-white"
                              >
                                Upload Document
                                <Upload className="ml-2 h-4 w-4" />
                              </Button>
                            )}

                            {doc.status === "uploaded" && (
                              <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                                <p className="text-blue-800 flex items-center">
                                  <Info className="h-4 w-4 mr-2 text-blue-600" />
                                  Document uploaded and pending verification
                                </p>
                              </div>
                            )}

                            {doc.status === "verified" && (
                              <div className="bg-green-50 p-3 rounded-md border border-green-100">
                                <p className="text-green-800 flex items-center">
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                  Document verified by {bank.name}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-4 pb-6 px-6 bg-gray-50 border-t">
                    <Button variant="outline" onClick={() => setActiveTab("overview")}>
                      Back to Overview
                    </Button>
                    <Button variant="outline">
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Contact {bank.name}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">All Documents Submitted</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                You've uploaded all requested documents. If banks require any additional information, they'll appear
                here.
              </p>
            </div>
          )}
        </TabsContent>

        {/* Add this after the closing tag of the "additional-docs" TabsContent */}
        <TabsContent value="other-lenders">
          <div className="mb-6">
            <Alert className="bg-blue-50 border-blue-100">
              <Building className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Alternative Lender Options</AlertTitle>
              <AlertDescription className="text-blue-700">
                In addition to major banks, we're also exploring competitive offers from specialized lenders who may
                provide more flexible terms or better rates for your specific situation.
              </AlertDescription>
            </Alert>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Specialized Lenders Review</CardTitle>
              <CardDescription>
                These lenders are currently assessing your application and may provide competitive alternatives to major
                banks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-amber-50 p-6 rounded-lg border border-amber-100">
                  <h3 className="font-medium text-lg mb-4 text-amber-800 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-amber-600" />
                    Applications In Progress
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <Building className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Athena Home Loans</h4>
                          <Badge className="bg-blue-100 text-blue-800">Reviewing</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Known for competitive rates and no fees</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <Building className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Macquarie Bank</h4>
                          <Badge className="bg-blue-100 text-blue-800">Reviewing</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Flexible options with competitive packages</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                          <Building className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">ING</h4>
                          <Badge className="bg-blue-100 text-blue-800">Reviewing</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Low rates with offset account options</p>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-amber-700">
                      These lenders are currently reviewing your application. Results expected within 3-5 business days.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-lg mb-2 text-blue-800">Why Consider Alternative Lenders?</h3>
                  <p className="text-blue-700 mb-4">
                    Alternative lenders often provide benefits that major banks may not offer:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">More flexible lending criteria for self-employed borrowers</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">Specialized products for unique property types</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">Potentially lower interest rates and fewer fees</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">Innovative features not available with traditional banks</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Your Refii loan specialist will discuss these options with you during your consultation call.
            </p>
            <Button variant="outline" asChild>
              <Link href="/contact-specialist">
                <Phone className="mr-2 h-5 w-5" />
                Schedule Consultation Call
              </Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
