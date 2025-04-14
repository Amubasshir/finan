"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ThumbsUp,
  DollarSign,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  TrendingDown,
  TrendingUp,
  HelpCircle,
  BarChart,
  ExternalLink,
} from "lucide-react"

export default function SwitchLoanPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [switching, setSwitching] = useState(false)
  const [switchProgress, setSwitchProgress] = useState(0)
  const [showComparison, setShowComparison] = useState(true)
  const [showImpact, setShowImpact] = useState(true)
  const [activeTab, setActiveTab] = useState("comparison")

  // Mock data for the current loan and the alternative loan
  const currentLoan = {
    id: "loan1",
    lender: "Commonwealth Bank",
    amount: 450000,
    interestRate: 4.25,
    comparisonRate: 4.32,
    monthlyRepayment: 2212.5,
    term: 30,
    features: ["Offset account", "Redraw facility", "Extra repayments"],
    logoUrl: "/placeholder.svg?height=40&width=100",
  }

  const alternativeLoan = {
    id: params.id,
    lender: params.id === "loan2" ? "Westpac" : params.id === "loan3" ? "ANZ" : "NAB",
    amount: 450000,
    interestRate: params.id === "loan2" ? 4.35 : params.id === "loan3" ? 4.29 : 4.32,
    comparisonRate: params.id === "loan2" ? 4.42 : params.id === "loan3" ? 4.38 : 4.4,
    monthlyRepayment: params.id === "loan2" ? 2235.78 : params.id === "loan3" ? 2222.45 : 2228.12,
    term: 30,
    features:
      params.id === "loan2"
        ? ["Offset account", "Redraw facility", "Extra repayments"]
        : params.id === "loan3"
          ? ["Package benefits", "Fixed rate option", "No annual fee"]
          : ["Flexible repayments", "Online banking", "Mobile app"],
    logoUrl: "/placeholder.svg?height=40&width=100",
    highlight: params.id === "loan2" ? "Lowest fees" : params.id === "loan3" ? "Best rate" : "Most flexible",
  }

  useEffect(() => {
    if (switching) {
      const interval = setInterval(() => {
        setSwitchProgress((prev) => {
          const newProgress = prev + 20
          if (newProgress >= 100) {
            clearInterval(interval)
            router.push(`/loan-acceptance-confirmation?loanId=${params.id}`)
            return 100
          }
          return newProgress
        })
      }, 500)

      return () => clearInterval(interval)
    }
  }, [switching, params.id, router])

  const handleSwitchLoan = async () => {
    setSwitching(true)
    setSwitchProgress(0)
  }

  // Calculate differences
  const interestRateDiff = (alternativeLoan.interestRate - currentLoan.interestRate).toFixed(2)
  const monthlyRepaymentDiff = (alternativeLoan.monthlyRepayment - currentLoan.monthlyRepayment).toFixed(2)
  const yearlyRepaymentDiff = ((alternativeLoan.monthlyRepayment - currentLoan.monthlyRepayment) * 12).toFixed(2)

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button variant="ghost" className="mb-6 hover:bg-gray-100" asChild>
        <Link href="/dashboard?tab=alternatives" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Alternative Loans
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Switch Your Loan</h1>
          <p className="text-gray-600">
            Compare your current loan with the selected alternative and confirm your switch
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={handleSwitchLoan} disabled={switching} className="bg-green-600 hover:bg-green-700" size="lg">
            {switching ? (
              <div className="flex items-center">
                <span className="mr-2">Processing...</span>
                <span>{switchProgress}%</span>
              </div>
            ) : (
              <>
                <ThumbsUp className="mr-2 h-5 w-5" />
                Confirm Switch to {alternativeLoan.lender}
              </>
            )}
          </Button>
        </div>
      </div>

      {switching && (
        <Card className="mb-6 overflow-hidden">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-3">Switching Your Loan</h3>
            <Progress value={switchProgress} className="h-2 mb-4" />
            <p className="text-gray-600">
              Please wait while we process your loan switch request. This should only take a moment.
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="comparison" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comparison" className="flex items-center">
            <BarChart className="mr-2 h-4 w-4" />
            Loan Comparison
          </TabsTrigger>
          <TabsTrigger value="impact" className="flex items-center">
            <TrendingDown className="mr-2 h-4 w-4" />
            Financial Impact
          </TabsTrigger>
          <TabsTrigger value="next-steps" className="flex items-center">
            <ArrowRight className="mr-2 h-4 w-4" />
            Next Steps
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="space-y-6 mt-0">
          <Card className="shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <BarChart className="mr-2 h-5 w-5 text-blue-600" />
                  Loan Comparison
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowComparison(!showComparison)}
                  className="h-8 w-8 p-0"
                >
                  {showComparison ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
              <CardDescription>Compare your current loan with the selected alternative</CardDescription>
            </CardHeader>
            {showComparison && (
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg flex items-center">
                        <div className="bg-gray-100 p-2 rounded-full mr-2">
                          <DollarSign className="h-4 w-4 text-gray-600" />
                        </div>
                        Current Loan
                      </h3>
                      <Badge className="bg-blue-100 text-blue-800">Selected</Badge>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center mb-4">
                        <img
                          src={currentLoan.logoUrl || "/placeholder.svg"}
                          alt={`${currentLoan.lender} logo`}
                          className="h-8 mr-3"
                        />
                        <h4 className="font-medium">{currentLoan.lender}</h4>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500">Interest Rate</p>
                          <p className="text-xl font-bold">{currentLoan.interestRate}%</p>
                          <p className="text-xs text-gray-500">Comparison rate: {currentLoan.comparisonRate}%</p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500">Monthly Repayment</p>
                          <p className="text-xl font-bold">${currentLoan.monthlyRepayment.toFixed(2)}</p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500">Loan Amount</p>
                          <p className="font-medium">${currentLoan.amount.toLocaleString()}</p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500">Loan Term</p>
                          <p className="font-medium">{currentLoan.term} years</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium mb-2">Features</h4>
                        <ul className="space-y-1">
                          {currentLoan.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg flex items-center">
                        <div className="bg-green-100 p-2 rounded-full mr-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                        </div>
                        Alternative Loan
                      </h3>
                      <Badge variant="outline" className="border-green-200 bg-green-50">
                        Switch to This
                      </Badge>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                      <div className="flex items-center mb-4">
                        <img
                          src={alternativeLoan.logoUrl || "/placeholder.svg"}
                          alt={`${alternativeLoan.lender} logo`}
                          className="h-8 mr-3"
                        />
                        <div className="flex items-center">
                          <h4 className="font-medium">{alternativeLoan.lender}</h4>
                          {alternativeLoan.highlight && (
                            <Badge className="ml-2 bg-green-100 text-green-800">{alternativeLoan.highlight}</Badge>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                          <p className="text-sm text-gray-500">Interest Rate</p>
                          <div className="flex items-center">
                            <p className="text-xl font-bold text-green-700">{alternativeLoan.interestRate}%</p>
                            <Badge
                              className={`ml-2 ${
                                Number.parseFloat(interestRateDiff) < 0
                                  ? "bg-green-100 text-green-800"
                                  : Number.parseFloat(interestRateDiff) > 0
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {Number.parseFloat(interestRateDiff) < 0
                                ? `${interestRateDiff}%`
                                : Number.parseFloat(interestRateDiff) > 0
                                  ? `+${interestRateDiff}%`
                                  : "Same"}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">Comparison rate: {alternativeLoan.comparisonRate}%</p>
                        </div>

                        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                          <p className="text-sm text-gray-500">Monthly Repayment</p>
                          <div className="flex items-center">
                            <p className="text-xl font-bold text-green-700">
                              ${alternativeLoan.monthlyRepayment.toFixed(2)}
                            </p>
                            <Badge
                              className={`ml-2 ${
                                Number.parseFloat(monthlyRepaymentDiff) < 0
                                  ? "bg-green-100 text-green-800"
                                  : Number.parseFloat(monthlyRepaymentDiff) > 0
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {Number.parseFloat(monthlyRepaymentDiff) < 0
                                ? `$${Math.abs(Number.parseFloat(monthlyRepaymentDiff)).toFixed(2)} less`
                                : Number.parseFloat(monthlyRepaymentDiff) > 0
                                  ? `$${monthlyRepaymentDiff} more`
                                  : "Same"}
                            </Badge>
                          </div>
                        </div>

                        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                          <p className="text-sm text-gray-500">Loan Amount</p>
                          <p className="font-medium">${alternativeLoan.amount.toLocaleString()}</p>
                        </div>

                        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                          <p className="text-sm text-gray-500">Loan Term</p>
                          <p className="font-medium">{alternativeLoan.term} years</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-green-100">
                        <h4 className="font-medium mb-2">Features</h4>
                        <ul className="space-y-1">
                          {alternativeLoan.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="impact" className="space-y-6 mt-0">
          <Card className="shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <TrendingDown className="mr-2 h-5 w-5 text-green-600" />
                  Financial Impact
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowImpact(!showImpact)} className="h-8 w-8 p-0">
                  {showImpact ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
              <CardDescription>How switching will affect your finances over time</CardDescription>
            </CardHeader>
            {showImpact && (
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card
                    className={`border overflow-hidden shadow-sm ${
                      Number.parseFloat(yearlyRepaymentDiff) < 0
                        ? "border-green-200"
                        : Number.parseFloat(yearlyRepaymentDiff) > 0
                          ? "border-red-200"
                          : "border-gray-200"
                    }`}
                  >
                    <div
                      className={`h-1 ${
                        Number.parseFloat(yearlyRepaymentDiff) < 0
                          ? "bg-green-500"
                          : Number.parseFloat(yearlyRepaymentDiff) > 0
                            ? "bg-red-500"
                            : "bg-gray-300"
                      }`}
                    ></div>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-3">
                        {Number.parseFloat(yearlyRepaymentDiff) < 0 ? (
                          <div className="bg-green-100 p-2 rounded-full mr-2">
                            <TrendingDown className="h-5 w-5 text-green-600" />
                          </div>
                        ) : Number.parseFloat(yearlyRepaymentDiff) > 0 ? (
                          <div className="bg-red-100 p-2 rounded-full mr-2">
                            <TrendingUp className="h-5 w-5 text-red-600" />
                          </div>
                        ) : (
                          <div className="bg-gray-100 p-2 rounded-full mr-2">
                            <DollarSign className="h-5 w-5 text-gray-600" />
                          </div>
                        )}
                        <h3 className="font-semibold">Yearly Payment Difference</h3>
                      </div>
                      <p
                        className={`text-2xl font-bold ${
                          Number.parseFloat(yearlyRepaymentDiff) < 0
                            ? "text-green-700"
                            : Number.parseFloat(yearlyRepaymentDiff) > 0
                              ? "text-red-700"
                              : "text-gray-700"
                        }`}
                      >
                        {Number.parseFloat(yearlyRepaymentDiff) < 0
                          ? `-$${Math.abs(Number.parseFloat(yearlyRepaymentDiff)).toFixed(2)}`
                          : Number.parseFloat(yearlyRepaymentDiff) > 0
                            ? `+$${yearlyRepaymentDiff}`
                            : "$0.00"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {Number.parseFloat(yearlyRepaymentDiff) < 0
                          ? "You save this amount yearly"
                          : Number.parseFloat(yearlyRepaymentDiff) > 0
                            ? "Additional cost yearly"
                            : "No change in yearly payments"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm overflow-hidden">
                    <div className="h-1 bg-blue-500"></div>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-3">
                        <div className="bg-blue-100 p-2 rounded-full mr-2">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="font-semibold">5-Year Impact</h3>
                      </div>
                      <p className="text-2xl font-bold text-blue-700">
                        {Number.parseFloat(yearlyRepaymentDiff) < 0
                          ? `-$${(Math.abs(Number.parseFloat(yearlyRepaymentDiff)) * 5).toFixed(2)}`
                          : Number.parseFloat(yearlyRepaymentDiff) > 0
                            ? `+$${(Number.parseFloat(yearlyRepaymentDiff) * 5).toFixed(2)}`
                            : "$0.00"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Estimated impact over 5 years</p>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm overflow-hidden">
                    <div className="h-1 bg-purple-500"></div>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-3">
                        <div className="bg-purple-100 p-2 rounded-full mr-2">
                          <Clock className="h-5 w-5 text-purple-600" />
                        </div>
                        <h3 className="font-semibold">Loan Term Impact</h3>
                      </div>
                      <p className="text-2xl font-bold text-purple-700">
                        {Number.parseFloat(yearlyRepaymentDiff) < 0
                          ? `-$${(Math.abs(Number.parseFloat(yearlyRepaymentDiff)) * 30).toFixed(2)}`
                          : Number.parseFloat(yearlyRepaymentDiff) > 0
                            ? `+$${(Number.parseFloat(yearlyRepaymentDiff) * 30).toFixed(2)}`
                            : "$0.00"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Estimated impact over full loan term</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3 mt-0.5">
                      <HelpCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-800 mb-1">Understanding the Financial Impact</h3>
                      <p className="text-sm text-blue-700">
                        These calculations are based on the current loan amount and term. The actual impact may vary
                        based on changes in interest rates, additional repayments, or other factors. For a more detailed
                        analysis, please speak with a loan specialist.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="next-steps" className="space-y-6 mt-0">
          <Card className="shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-white border-b">
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-amber-600" />
                Important Information
              </CardTitle>
              <CardDescription>What you need to know before switching your loan</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="mb-3">
                    Switching your loan will replace your current application with the selected alternative. This will
                    not affect your pre-approval status, but you will need to review and accept the new loan terms.
                  </p>

                  <div className="flex items-start">
                    <div className="bg-amber-100 p-2 rounded-full mr-3 mt-0.5">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    </div>
                    <p className="text-amber-800 font-medium">
                      Please review all information carefully before confirming your switch.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <ArrowRight className="mr-2 h-5 w-5 text-blue-600" />
                    What Happens Next
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-blue-700 font-medium">1</span>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200 flex-grow">
                        <h4 className="font-medium">Your current loan application will be replaced</h4>
                        <p className="text-sm text-gray-600">
                          We'll automatically switch your application to the selected alternative loan.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-blue-700 font-medium">2</span>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200 flex-grow">
                        <h4 className="font-medium">Review and accept the new loan terms</h4>
                        <p className="text-sm text-gray-600">
                          You'll need to review and accept the terms and conditions of the new loan.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-blue-700 font-medium">3</span>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200 flex-grow">
                        <h4 className="font-medium">Document transfer</h4>
                        <p className="text-sm text-gray-600">
                          Any documents you've already uploaded will be transferred to the new application.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-blue-700 font-medium">4</span>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200 flex-grow">
                        <h4 className="font-medium">Settlement timeline remains unchanged</h4>
                        <p className="text-sm text-gray-600">
                          Your settlement timeline will remain the same, ensuring a smooth transition.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-medium text-green-800 mb-2 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    Benefits of Switching
                  </h3>
                  <ul className="space-y-2">
                    {Number.parseFloat(yearlyRepaymentDiff) < 0 && (
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-green-700">
                          Save ${Math.abs(Number.parseFloat(yearlyRepaymentDiff)).toFixed(2)} per year on repayments
                        </span>
                      </li>
                    )}
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-green-700">
                        {alternativeLoan.highlight} - {alternativeLoan.lender} offers unique benefits
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-green-700">No need to restart your application process</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-green-700">Seamless transition with all your information preserved</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/dashboard?tab=alternatives" className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Cancel
                </Link>
              </Button>
              <Button variant="outline" className="w-full sm:w-auto" asChild>
                <Link href={`/loan-details/${alternativeLoan.id}`} className="flex items-center">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Full Loan Details
                </Link>
              </Button>
              <Button
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                onClick={handleSwitchLoan}
                disabled={switching}
              >
                {switching ? (
                  <div className="flex items-center">
                    <span className="mr-2">Processing...</span>
                    <span>{switchProgress}%</span>
                  </div>
                ) : (
                  <>
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Confirm Switch to {alternativeLoan.lender}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
