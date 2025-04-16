"use client"

import { useLoanInfo } from "../../LoanInfoContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Summary() {
  const { formData } = useLoanInfo()

  const renderSection = (title: string, data: any) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">{key.replace(/([A-Z])/g, " $1").trim()}</dt>
              <dd className="mt-1 text-sm text-gray-900">{value?.toString() || "N/A"}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Loan Information Summary</h2>
      {renderSection("Employment Information", formData.employment)}
      {renderSection("Financial Information", formData.financial)}
      {renderSection("Loan Requirements", formData.loanRequirements)}
      {renderSection("Property Information", formData.property)}
      {renderSection("Additional Features", formData.additionalFeatures)}
      <p className="mt-6 text-center text-lg font-semibold">
        Please review your information carefully. When you're ready, click "Submit and View Comprehensive Comparison" to
        see your personalized loan options and AI-powered recommendations.
      </p>
      <div className="mt-6 text-center">
        <Button asChild size="lg">
          <Link href="/comprehensive-comparison">Submit and View Comprehensive Comparison</Link>
        </Button>
      </div>
    </div>
  )
}
