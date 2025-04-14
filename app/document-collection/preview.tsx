"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ClipboardCheck, Home, CheckCircle, RefreshCw, DollarSign, FileText, Clock, FileSignature } from "lucide-react"

// This is a simplified preview component to show how the page looks
export default function DocumentCollectionPreview() {
  const [activeTab, setActiveTab] = useState("documents")

  // Sample data for the refinance steps
  const refinanceSteps = [
    {
      title: "Lender Review & Verification",
      description:
        "The lender reviews your submitted documents (ID, income, assets, liabilities). They check your credit score, employment details, and repayment history. If anything is missing, they may request additional information.",
      icon: <ClipboardCheck className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Property Valuation",
      description:
        "The lender may order a property valuation to confirm the home's current market value. Some loans allow desktop or automated valuations, while others may require a full inspection.",
      icon: <Home className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Final Loan Approval",
      description:
        "Once everything checks out, the lender issues formal approval. You'll receive a loan offer document to review and sign.",
      icon: <CheckCircle className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Loan Settlement Process",
      description:
        "Your new lender contacts your old lender to arrange the loan payout. They handle the transition of your home loan to the new terms.",
      icon: <RefreshCw className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Funds Disbursed & Loan Activated",
      description:
        "The old loan is paid off, and your new home loan officially starts. Any cashback or savings (e.g., broker fee refunds) are transferred to your account.",
      icon: <DollarSign className="h-6 w-6 text-blue-600" />,
    },
  ]

  // Sample data for documents to sign
  const documentsToSign = [
    {
      name: "Loan Application Form",
      description:
        "This confirms your request to refinance with the chosen lender. Refii pre-fills most of this form for you—just review and sign digitally.",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Loan Offer & Contract",
      description:
        "Once approved, the lender sends a formal loan offer. This outlines your new interest rate, loan term, repayments, and conditions. You sign digitally to accept the new loan.",
      icon: <FileSignature className="h-5 w-5" />,
    },
    {
      name: "Discharge Authority Form",
      description:
        "This authorises your current lender to close your existing loan. Required for refinancing from one bank to another. Refii helps you generate and submit this with one click.",
      icon: <RefreshCw className="h-5 w-5" />,
    },
    {
      name: "Direct Debit Authorisation",
      description:
        "Allows your new lender to automatically withdraw mortgage payments from your account. A simple digital signature is required.",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      name: "Government Forms (If Applicable)",
      description:
        "If your refinance involves stamp duty exemptions or special government incentives, some additional forms may be required. Refii's system automatically fills these out and prompts you if needed.",
      icon: <FileText className="h-5 w-5" />,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Refinance Document Collection</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents">Required Documents</TabsTrigger>
          <TabsTrigger value="process">Refinance Process</TabsTrigger>
          <TabsTrigger value="signing">Documents to Sign</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <div className="text-center p-8 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold">Required Documents Tab</h2>
            <p className="mt-2">This tab shows a grid of cards with all required documents.</p>
            <p className="mt-1">Each card has a checkbox to acknowledge the document.</p>
          </div>
        </TabsContent>

        <TabsContent value="process">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="mr-2 h-5 w-5" />
                Refinance Process Timeline
              </CardTitle>
              <CardDescription className="flex items-center mt-2">
                <Clock className="mr-2 h-4 w-4" />
                <span>Standard refinance process: 1–4 weeks</span>
                <span className="mx-2">|</span>
                <span>Fast-track approvals (if documents are complete): as little as 5–10 days</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {refinanceSteps.map((step, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 flex flex-col items-center mr-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
                        {index + 1}
                      </div>
                      {index < refinanceSteps.length - 1 && <div className="w-0.5 h-full bg-blue-200 mt-2"></div>}
                    </div>
                    <div className="pt-1 pb-8">
                      <div className="flex items-center mb-2">
                        {step.icon}
                        <h3 className="text-xl font-semibold ml-2">{step.title}</h3>
                      </div>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileSignature className="mr-2 h-5 w-5" />
                Documents You May Need to Sign
              </CardTitle>
              <CardDescription>
                During the refinance process, you'll need to sign several documents. Here's what to expect:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {documentsToSign.map((doc, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center mb-2">
                      {doc.icon}
                      <h3 className="text-lg font-semibold ml-2">{doc.name}</h3>
                    </div>
                    <p className="text-gray-600">{doc.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center mt-8">
        <Button size="lg">Proceed to Document Upload</Button>
      </div>
    </div>
  )
}
