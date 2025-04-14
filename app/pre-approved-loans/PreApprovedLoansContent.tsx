"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronRight,
  ThumbsUp,
  Download,
  Calendar,
  Trophy,
  Zap,
  DollarSign,
  Percent,
  ArrowRight,
  Info,
  Shield,
  Star,
  TrendingDown,
  Sparkles,
  FileText,
} from "lucide-react"
import confetti from "canvas-confetti"

interface PreApprovedLoan {
  id: string
  lender: string
  amount: number
  interestRate: number
  comparisonRate: number
  term: number
  monthlyRepayment: number
  totalRepayment: number
  features: string[]
  status: "conditionally-approved"
  expiryDays: number
  logoUrl: string
  cashback?: number
  estimatedSavings?: number
  specialOffer?: string
  lenderRanking?: number
  processingTime?: string
  uniqueFeature?: string
}

export default function PreApprovedLoansContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const loanId = searchParams.get("loanId")
  const [preApprovedLoans, setPreApprovedLoans] = useState<PreApprovedLoan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLoans, setSelectedLoans] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("loans")
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Simulate fetching pre-approved loans
    const fetchPreApprovedLoans = async () => {
      setLoading(true)
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock data for conditionally approved loans
      const mockLoans: PreApprovedLoan[] = [
        {
          id: "loan1",
          lender: "Commonwealth Bank",
          amount: 250000,
          interestRate: 5.49,
          comparisonRate: 5.65,
          term: 15,
          monthlyRepayment: 2012.45,
          totalRepayment: 362241.0,
          features: ["No early repayment fees", "Offset account", "Redraw facility"],
          status: "conditionally-approved",
          expiryDays: 30,
          logoUrl: "/placeholder.svg?height=60&width=120",
          cashback: 3000,
          estimatedSavings: 15420,
          specialOffer: "Rate match guarantee",
          lenderRanking: 4.5,
          processingTime: "Fast (3-5 days)",
          uniqueFeature: "Free property reports",
        },
        {
          id: "loan2",
          lender: "Westpac",
          amount: 225000,
          interestRate: 5.65,
          comparisonRate: 5.78,
          term: 15,
          monthlyRepayment: 1845.32,
          totalRepayment: 332157.6,
          features: ["Fixed rate option", "Interest-only period available", "No annual fee"],
          status: "conditionally-approved",
          expiryDays: 14,
          logoUrl: "/placeholder.svg?height=60&width=120",
          cashback: 2500,
          estimatedSavings: 12800,
          specialOffer: "First year fee waiver",
          lenderRanking: 4.2,
          processingTime: "Standard (5-7 days)",
          uniqueFeature: "Flexible repayment schedule",
        },
        {
          id: "loan3",
          lender: "ANZ",
          amount: 275000,
          interestRate: 5.35,
          comparisonRate: 5.42,
          term: 15,
          monthlyRepayment: 2198.76,
          totalRepayment: 395776.8,
          features: ["No application fee", "Online account management", "Credit card included"],
          status: "conditionally-approved",
          expiryDays: 21,
          logoUrl: "/placeholder.svg?height=60&width=120",
          cashback: 4000,
          estimatedSavings: 18200,
          specialOffer: "Lowest rate guarantee",
          lenderRanking: 4.7,
          processingTime: "Fast (3-5 days)",
          uniqueFeature: "Free property valuation",
        },
        {
          id: "loan4",
          lender: "NAB",
          amount: 260000,
          interestRate: 5.42,
          comparisonRate: 5.55,
          term: 15,
          monthlyRepayment: 2105.33,
          totalRepayment: 378959.4,
          features: ["Split loan option", "Flexible terms", "Mobile app"],
          status: "conditionally-approved",
          expiryDays: 28,
          logoUrl: "/placeholder.svg?height=60&width=120",
          cashback: 3500,
          estimatedSavings: 16500,
          specialOffer: "Loyalty discount",
          lenderRanking: 4.3,
          processingTime: "Standard (5-7 days)",
          uniqueFeature: "Free financial health check",
        },
        {
          id: "loan5",
          lender: "ING",
          amount: 240000,
          interestRate: 5.29,
          comparisonRate: 5.38,
          term: 15,
          monthlyRepayment: 1925.67,
          totalRepayment: 346620.6,
          features: ["No ongoing fees", "Extra repayments", "Redraw facility"],
          status: "conditionally-approved",
          expiryDays: 25,
          logoUrl: "/placeholder.svg?height=60&width=120",
          cashback: 2000,
          estimatedSavings: 19800,
          specialOffer: "Orange Advantage package",
          lenderRanking: 4.6,
          processingTime: "Fast (3-5 days)",
          uniqueFeature: "Sustainability discount",
        },
      ]

      setPreApprovedLoans(mockLoans)
      setLoading(false)

      // Show confetti after a short delay
      setTimeout(() => {
        setShowConfetti(true)
      }, 500)
    }

    fetchPreApprovedLoans()
  }, [])

  useEffect(() => {
    if (showConfetti) {
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      }, 250)

      return () => clearInterval(interval)
    }
  }, [showConfetti])

  const toggleLoanSelection = (loanId: string) => {
    setSelectedLoans((prev) => (prev.includes(loanId) ? prev.filter((id) => id !== loanId) : [...prev, loanId]))
  }

  const handleApplyForSelected = async () => {
    if (selectedLoans.length === 0) {
      alert("Please select at least one loan to apply for")
      return
    }

    // Simulate applying for loans
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Navigate to document collection page with selected loan IDs
    const queryString = selectedLoans.map((id) => `id=${id}`).join("&")
    router.push(`/document-collection?${queryString}`)
  }

  const getBestLoan = () => {
    if (preApprovedLoans.length === 0) return null

    // Find the loan with the lowest interest rate
    return preApprovedLoans.reduce((best, current) => (current.interestRate < best.interestRate ? current : best))
  }

  const getTotalSavings = () => {
    if (selectedLoans.length === 0) return 0

    return selectedLoans.reduce((total, loanId) => {
      const loan = preApprovedLoans.find((l) => l.id === loanId)
      return total + (loan?.estimatedSavings || 0)
    }, 0)
  }

  const getTotalCashback = () => {
    if (selectedLoans.length === 0) return 0

    return selectedLoans.reduce((total, loanId) => {
      const loan = preApprovedLoans.find((l) => l.id === loanId)
      return total + (loan?.cashback || 0)
    }, 0)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="text-3xl font-bold text-center mb-8">Finding Your Best Loan Options</h1>
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 mb-6">
            We're analyzing your application and finding the best loan offers for you...
          </p>
          <Progress value={65} className="w-full max-w-md mx-auto h-3" />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-3">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Checking Rates</h3>
                <p className="text-sm text-gray-600">Finding the best interest rates</p>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-3">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Calculating Savings</h3>
                <p className="text-sm text-gray-600">Estimating your potential savings</p>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-3">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Verifying Eligibility</h3>
                <p className="text-sm text-gray-600">Confirming your loan eligibility</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const bestLoan = getBestLoan()

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
          <Trophy className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Congratulations! You're Pre-Qualified</h1>
        <p className="text-xl text-gray-600 mb-2">
          Based on your information, you've been conditionally approved for multiple loan options
        </p>
        <p className="text-lg text-green-600 font-medium">
          Apply for multiple loans to create competition and secure your best rate!
        </p>
      </div>

      <Tabs defaultValue="loans" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="loans" className="text-base py-3">
            Loan Options ({preApprovedLoans.length})
          </TabsTrigger>
          <TabsTrigger value="strategy" className="text-base py-3">
            Application Strategy
          </TabsTrigger>
          <TabsTrigger value="next" className="text-base py-3">
            Next Steps
          </TabsTrigger>
        </TabsList>

        <TabsContent value="loans">
          {/* Best Rate Highlight */}
          {bestLoan && (
            <Card className="mb-8 border-green-300 bg-gradient-to-r from-green-50 to-white shadow-md overflow-hidden">
              <div className="absolute top-0 right-0">
                <Badge className="m-4 bg-green-600 text-white hover:bg-green-700">
                  <Star className="h-3 w-3 mr-1 fill-current" /> Best Rate
                </Badge>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-green-800">
                  <Percent className="mr-2 h-5 w-5 text-green-600" />
                  Lowest Rate Available: {bestLoan.interestRate}%
                </CardTitle>
                <CardDescription className="text-green-700">
                  This is {(5.99 - bestLoan.interestRate).toFixed(2)}% lower than the average market rate of 5.99%
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm">
                    <p className="text-sm text-gray-500">Potential Yearly Savings</p>
                    <p className="text-2xl font-bold text-green-600">${bestLoan.estimatedSavings?.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Compared to your current loan</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm">
                    <p className="text-sm text-gray-500">Available Cashback</p>
                    <p className="text-2xl font-bold text-green-600">${bestLoan.cashback?.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">When you refinance</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm">
                    <p className="text-sm text-gray-500">Monthly Repayment</p>
                    <p className="text-2xl font-bold">${bestLoan.monthlyRepayment.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Over {bestLoan.term} years</p>
                  </div>
                </div>
                <Alert className="bg-blue-50 border-blue-100">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">Pro Tip</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    Apply for multiple loans to create competition among lenders. This can help you negotiate even
                    better terms!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Selection Summary */}
          {selectedLoans.length > 0 && (
            <div className="sticky top-0 z-10 bg-white p-4 rounded-lg border border-blue-200 shadow-md mb-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {selectedLoans.length} {selectedLoans.length === 1 ? "Loan" : "Loans"} Selected
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-3 md:mb-0">
                    <span className="flex items-center mr-4">
                      <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                      Total Cashback: ${getTotalCashback().toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
                      Potential Savings: ${getTotalSavings().toLocaleString()}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={handleApplyForSelected}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Apply for Selected Loans
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 mb-8">
            {preApprovedLoans.map((loan) => (
              <Card
                key={loan.id}
                className={`overflow-hidden transition-all duration-200 ${
                  selectedLoans.includes(loan.id)
                    ? "border-blue-300 shadow-md bg-blue-50"
                    : "hover:border-gray-300 hover:shadow-md"
                }`}
              >
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div className="flex items-center">
                    <Checkbox
                      id={`select-${loan.id}`}
                      checked={selectedLoans.includes(loan.id)}
                      onCheckedChange={() => toggleLoanSelection(loan.id)}
                      className="mr-3 h-5 w-5"
                    />
                    <div>
                      <div className="flex items-center">
                        <CardTitle>{loan.lender}</CardTitle>
                        <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                          <Clock className="h-3 w-3 mr-1" /> Conditionally Approved
                        </Badge>
                        {loan.interestRate === bestLoan?.interestRate && (
                          <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200">
                            <Star className="h-3 w-3 mr-1" /> Best Rate
                          </Badge>
                        )}
                      </div>
                      <CardDescription>
                        Home Loan - ${loan.amount.toLocaleString()} over {loan.term} years
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <img src={loan.logoUrl || "/placeholder.svg"} alt={`${loan.lender} logo`} className="h-12" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                      <p className="text-sm text-gray-500">Interest Rate</p>
                      <p className="text-2xl font-bold text-blue-600">{loan.interestRate}%</p>
                      <p className="text-xs text-gray-500">Comparison rate: {loan.comparisonRate}%</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                      <p className="text-sm text-gray-500">Monthly Repayment</p>
                      <p className="text-2xl font-bold">${loan.monthlyRepayment.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Total: ${loan.totalRepayment.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                      <p className="text-sm text-gray-500">Cashback Offer</p>
                      <p className="text-2xl font-bold text-green-600">${loan.cashback?.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">When you refinance</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                      <p className="text-sm text-gray-500">Yearly Savings</p>
                      <p className="text-2xl font-bold text-green-600">${loan.estimatedSavings?.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Compared to current loan</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium mb-2">Key Features</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {loan.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Additional Benefits</h4>
                      <div className="space-y-2">
                        {loan.specialOffer && (
                          <div className="flex items-center">
                            <Sparkles className="h-4 w-4 text-amber-500 mr-2" />
                            <span className="text-sm">
                              <span className="font-medium">Special Offer:</span> {loan.specialOffer}
                            </span>
                          </div>
                        )}
                        {loan.processingTime && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-blue-500 mr-2" />
                            <span className="text-sm">
                              <span className="font-medium">Processing Time:</span> {loan.processingTime}
                            </span>
                          </div>
                        )}
                        {loan.uniqueFeature && (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-purple-500 mr-2" />
                            <span className="text-sm">
                              <span className="font-medium">Unique Feature:</span> {loan.uniqueFeature}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {loan.status === "conditionally-approved" && (
                    <Alert className="mb-4 bg-blue-50 border-blue-200">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertTitle className="text-blue-800">Conditional Approval</AlertTitle>
                      <AlertDescription className="text-blue-700">
                        This loan is conditionally approved based on the information you've provided. Final approval
                        will be subject to verification of your documents.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-4 pt-2 pb-6 px-6 bg-gray-50 border-t">
                  <Button
                    variant={selectedLoans.includes(loan.id) ? "default" : "outline"}
                    size="lg"
                    onClick={() => toggleLoanSelection(loan.id)}
                    className={selectedLoans.includes(loan.id) ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
                  >
                    {selectedLoans.includes(loan.id) ? (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" /> Selected for Application
                      </>
                    ) : (
                      <>
                        <ThumbsUp className="mr-2 h-5 w-5" /> Select This Loan
                      </>
                    )}
                  </Button>

                  <Button variant="outline" size="lg" onClick={() => router.push(`/loan-details/${loan.id}`)}>
                    View Full Details <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>

                  <Button variant="outline" size="lg" onClick={() => {}}>
                    <Download className="mr-2 h-5 w-5" /> Download Offer
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleApplyForSelected}
              disabled={selectedLoans.length === 0}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
            >
              Apply for {selectedLoans.length} Selected {selectedLoans.length === 1 ? "Loan" : "Loans"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="strategy">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-5 w-5 text-amber-600" />
                How to Get Your Best Rate
              </CardTitle>
              <CardDescription>
                Strategic tips to maximize your chances of securing the best possible loan terms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h3 className="text-xl font-semibold mb-4 text-blue-800">Why Apply for Multiple Loans?</h3>
                <p className="text-blue-700 mb-4">
                  Applying for multiple loans creates competition among lenders, which can lead to better rates and
                  terms. Refii will help you manage these applications and negotiate on your behalf.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-100 p-2 rounded-full mr-2">
                        <Zap className="h-4 w-4 text-blue-600" />
                      </div>
                      <h4 className="font-medium">Competitive Pressure</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Lenders will compete for your business, often leading to better offers than advertised rates.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-100 p-2 rounded-full mr-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                      </div>
                      <h4 className="font-medium">Backup Options</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      If one application faces issues, you'll have alternatives ready without starting over.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-100 p-2 rounded-full mr-2">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                      </div>
                      <h4 className="font-medium">Negotiation Power</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Having multiple approvals gives you leverage to negotiate better rates, cashback offers, and
                      features.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                  <h3 className="text-lg font-semibold mb-3 text-green-800 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    Refii's Negotiation Process
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Once you apply for multiple loans, here's how we'll help you secure the best deal:
                  </p>
                  <ol className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 text-green-800 font-medium text-sm">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Submit Applications</p>
                        <p className="text-sm text-gray-600">
                          We'll submit your applications to all selected lenders simultaneously.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 text-green-800 font-medium text-sm">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Collect Initial Offers</p>
                        <p className="text-sm text-gray-600">
                          As offers come in, we'll organize them for easy comparison.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 text-green-800 font-medium text-sm">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Negotiate Better Terms</p>
                        <p className="text-sm text-gray-600">
                          We'll use competing offers to negotiate improved rates and terms.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 text-green-800 font-medium text-sm">
                        4
                      </div>
                      <div>
                        <p className="font-medium">Present Final Options</p>
                        <p className="text-sm text-gray-600">
                          You'll receive the final negotiated offers to make your choice.
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                  <h3 className="text-lg font-semibold mb-3 text-purple-800 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-purple-600" />
                    Tips for Success
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Apply for at least 3 loans</p>
                        <p className="text-sm text-gray-600">
                          This creates optimal competition without overwhelming the process.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Include different types of lenders</p>
                        <p className="text-sm text-gray-600">
                          Mix of big banks and smaller lenders often yields the best results.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Prepare all documents in advance</p>
                        <p className="text-sm text-gray-600">
                          Having documents ready speeds up the process significantly.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Be responsive to requests</p>
                        <p className="text-sm text-gray-600">
                          Quick responses to lender queries keeps your applications moving forward.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Let Refii handle the negotiations</p>
                        <p className="text-sm text-gray-600">
                          Our experts know how to leverage competing offers effectively.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">Important Note About Credit Inquiries</AlertTitle>
                <AlertDescription className="text-amber-700">
                  Multiple loan applications made within a 14-day period are typically counted as a single inquiry for
                  credit score purposes. Refii ensures all your applications are submitted within this window to
                  minimize impact on your credit score.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-6">
              <Button size="lg" onClick={() => setActiveTab("loans")} className="bg-blue-600 hover:bg-blue-700">
                Back to Loan Selection
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="next">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowRight className="mr-2 h-5 w-5 text-blue-600" />
                Your Application Journey
              </CardTitle>
              <CardDescription>Here's what happens after you select your loans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-blue-100"></div>

                <div className="relative z-10 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4 shadow-md">
                      Step 1
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex-grow">
                      <h3 className="font-semibold text-lg mb-2">Select & Apply</h3>
                      <p className="text-gray-600 mb-3">
                        Choose which conditionally approved loans you want to formally apply for. We recommend selecting
                        multiple options to create competition.
                      </p>
                      <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                        <p className="text-sm text-blue-700 flex items-center">
                          <Info className="h-4 w-4 mr-2 text-blue-600" />
                          You are here! Select your loans and click "Apply for Selected Loans" to proceed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-gray-400 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4 shadow-md">
                      Step 2
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex-grow">
                      <h3 className="font-semibold text-lg mb-2">Document Collection</h3>
                      <p className="text-gray-600 mb-3">
                        Upload the required documents for your selected loans. Our system will help you identify which
                        documents are needed for each lender.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                        <div className="bg-gray-50 p-3 rounded-md flex items-center">
                          <FileText className="h-5 w-5 text-gray-500 mr-2" />
                          <span className="text-sm">ID Verification</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md flex items-center">
                          <FileText className="h-5 w-5 text-gray-500 mr-2" />
                          <span className="text-sm">Income Documents</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md flex items-center">
                          <FileText className="h-5 w-5 text-gray-500 mr-2" />
                          <span className="text-sm">Property Information</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-gray-400 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4 shadow-md">
                      Step 3
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex-grow">
                      <h3 className="font-semibold text-lg mb-2">Application Processing</h3>
                      <p className="text-gray-600 mb-3">
                        Refii submits your applications to the selected lenders and begins the negotiation process. You
                        can track progress in your dashboard.
                      </p>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-600 flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          Typical processing time: 3-7 business days
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-gray-400 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4 shadow-md">
                      Step 4
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex-grow">
                      <h3 className="font-semibold text-lg mb-2">Final Approval & Selection</h3>
                      <p className="text-gray-600 mb-3">
                        Review your final approved loan offers and select the one that best meets your needs. Our team
                        will help you compare the options.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                        <div className="bg-gray-50 p-3 rounded-md flex items-center">
                          <CheckCircle className="h-5 w-5 text-gray-500 mr-2" />
                          <span className="text-sm">Compare final rates and terms</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md flex items-center">
                          <CheckCircle className="h-5 w-5 text-gray-500 mr-2" />
                          <span className="text-sm">Select your preferred loan</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-gray-400 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4 shadow-md">
                      Step 5
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex-grow">
                      <h3 className="font-semibold text-lg mb-2">Settlement & Completion</h3>
                      <p className="text-gray-600 mb-3">
                        Sign the final loan documents and complete the settlement process. Your new loan will be
                        established and your old loan paid out.
                      </p>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-600 flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          Typical settlement time: 2-4 weeks after approval
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-6">
              <Button
                onClick={() => {
                  if (selectedLoans.length > 0) {
                    handleApplyForSelected()
                  } else {
                    setActiveTab("loans")
                  }
                }}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {selectedLoans.length > 0 ? <>Apply for Selected Loans</> : <>Select Loans to Apply</>}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center">
        <p className="text-gray-600 mb-4">Need help deciding? Our loan specialists are ready to assist you.</p>
        <Button variant="outline" size="lg" onClick={() => router.push("/contact-specialist")}>
          Speak to a Loan Specialist
        </Button>
      </div>
    </div>
  )
}
