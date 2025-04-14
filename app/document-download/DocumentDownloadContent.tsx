"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Download, Upload, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface Document {
  name: string
  description: string
  downloadLink?: string
  required: boolean
}

const documents: Document[] = [
  {
    name: "Proof of Identity",
    description: "Valid passport or driver's license",
    required: true,
  },
  {
    name: "Proof of Address",
    description: "Utility bill or bank statement (less than 3 months old)",
    required: true,
  },
  {
    name: "Proof of Income",
    description: "Last 3 months of pay slips",
    required: true,
  },
  {
    name: "Tax Returns",
    description: "Last 2 years of tax returns",
    required: true,
  },
  {
    name: "Bank Statements",
    description: "Last 3 months of bank statements for all accounts",
    required: true,
  },
  {
    name: "Current Mortgage Statement",
    description: "Most recent mortgage statement",
    required: true,
  },
  {
    name: "Property Insurance",
    description: "Current property insurance policy",
    required: true,
  },
  {
    name: "Council Rates Notice",
    description: "Most recent council rates notice",
    required: true,
  },
  {
    name: "Employment Contract",
    description: "Current employment contract (if applicable)",
    required: false,
  },
  {
    name: "Self-Employment Documents",
    description: "Business financials for the last 2 years (if self-employed)",
    required: false,
  },
  {
    name: "Rental Income Proof",
    description: "Lease agreements or rental statements (if applicable)",
    required: false,
  },
  {
    name: "Loan Application Form",
    description: "Completed loan application form",
    downloadLink: "/templates/loan-application-form.pdf",
    required: true,
  },
  {
    name: "Assets and Liabilities Statement",
    description: "Completed assets and liabilities form",
    downloadLink: "/templates/assets-liabilities-form.pdf",
    required: true,
  },
  {
    name: "Credit Card Statements",
    description: "Last 3 months of credit card statements (if applicable)",
    required: false,
  },
  {
    name: "Superannuation Statement",
    description: "Most recent superannuation statement",
    required: true,
  },
]

export default function DocumentDownloadContent() {
  const router = useRouter()
  const [checkedDocuments, setCheckedDocuments] = useState<string[]>([])

  const handleCheckDocument = (documentName: string) => {
    setCheckedDocuments((prev) =>
      prev.includes(documentName) ? prev.filter((name) => name !== documentName) : [...prev, documentName],
    )
  }

  const handleProceed = () => {
    if (checkedDocuments.length === documents.filter((doc) => doc.required).length) {
      router.push("/document-upload")
    } else {
      alert("Please acknowledge all required documents before proceeding.")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Required Documents for Loan Application</h1>
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Please download and prepare all required documents before proceeding to the upload page. Ensuring you have all
          necessary documents ready will streamline your application process.
        </AlertDescription>
      </Alert>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <Card key={doc.name} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">{doc.name}</CardTitle>
              <CardDescription>{doc.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {doc.downloadLink && (
                <Button asChild variant="outline" className="w-full mb-4">
                  <Link href={doc.downloadLink} download>
                    <Download className="mr-2 h-4 w-4" /> Download Template
                  </Link>
                </Button>
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`check-${doc.name}`}
                  checked={checkedDocuments.includes(doc.name)}
                  onCheckedChange={() => handleCheckDocument(doc.name)}
                />
                <label
                  htmlFor={`check-${doc.name}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {doc.required ? "Required" : "If applicable"}
                </label>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Button onClick={handleProceed} size="lg" className="flex items-center">
          <Upload className="mr-2 h-5 w-5" />
          Proceed to Document Upload
        </Button>
      </div>
    </div>
  )
}
