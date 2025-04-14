"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowRight, CheckCircle, Info } from "lucide-react"

export default function RefinanceProcess() {
  const router = useRouter()
  const [agreed, setAgreed] = useState(false)
  const [additionalInfo, setAdditionalInfo] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would submit the form data to your backend here
    console.log("Form submitted", { agreed, additionalInfo })
    router.push("/loan-progress-tracker")
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Start Your Refinance Process</h1>

      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="mr-2 h-6 w-6 text-blue-500" />
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">You're about to begin the refinance process. Here's what you need to know:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>The process typically takes 2-4 weeks to complete.</li>
            <li>You may be required to provide additional documentation during the process.</li>
            <li>Our team will guide you through each step and keep you updated on the progress.</li>
            <li>You can track your application status on the next page.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
            Review Your Application
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Please review the information you've provided so far. If you need to make any changes, you can go back to
            the previous pages.
          </p>
          {/* In a real application, you would display a summary of the user's application here */}
          <Alert>
            <AlertTitle>Application Summary</AlertTitle>
            <AlertDescription>
              Loan Amount: $300,000
              <br />
              Loan Term: 30 years
              <br />
              Interest Rate: 3.25%
              <br />
              Lender: Refii Bank
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Is there anything else you'd like us to know about your refinancing needs?"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle>Terms and Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
              <Label htmlFor="terms">
                I agree to the terms and conditions and consent to Refii processing my application.
              </Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button type="submit" size="lg" disabled={!agreed} className="bg-blue-500 hover:bg-blue-600">
            Submit Application and Track Progress <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}
