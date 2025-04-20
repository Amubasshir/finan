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
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
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
  loanInfoId: string
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
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  // Find the loan with the lowest interest rate
  const bestLoan = preApprovedLoans.length > 0
    ? preApprovedLoans.reduce((prev, current) => 
        prev.interestRate < current.interestRate ? prev : current
      )
    : null

  // Toggle loan selection
  const toggleLoanSelection = (loanId: string) => {
    setSelectedLoans(prev => 
      prev.includes(loanId)
        ? prev.filter(id => id !== loanId)
        : [...prev, loanId]
    )
  }

  // Calculate total cashback from selected loans
  const getTotalCashback = () => {
    return preApprovedLoans
      .filter(loan => selectedLoans.includes(loan.id))
      .reduce((total, loan) => total + (loan.cashback || 0), 0)
  }

  // Calculate total potential savings from selected loans
  const getTotalSavings = () => {
    return preApprovedLoans
      .filter(loan => selectedLoans.includes(loan.id))
      .reduce((total, loan) => total + (loan.estimatedSavings || 0), 0)
  }

  useEffect(() => {
    const fetchPreApprovedLoans = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Construct URL with query parameter if loanId exists
        const url = loanId ? `/api/pre-approved-loans?loanId=${loanId}` : '/api/pre-approved-loans'
        
        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
          }
        })
        
        if (response.data.success) {
          setPreApprovedLoans(response.data.preApprovedLoans)
          
          // Show confetti after a short delay if we have loans
          if (response.data.preApprovedLoans.length > 0) {
            setTimeout(() => {
              setShowConfetti(true)
            }, 500)
          }
        } else {
          setError(response.data.message || 'Failed to fetch loan options')
        }
      } catch (err: any) {
        console.error('Error fetching pre-approved loans:', err)
        setError(err.response?.data?.message || 'Failed to load loan options. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchPreApprovedLoans()
  }, [loanId])

  // Trigger confetti animation when showConfetti changes to true
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

  // Handle applying for selected loans
  const handleApplyForSelected = async () => {
    if (selectedLoans.length === 0) {
      toast({
        title: "No loans selected",
        description: "Please select at least one loan to apply for",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    
    try {
      // Get the loanInfoId from the first selected loan
      // All selected loans should have the same loanInfoId
      const firstLoan = preApprovedLoans.find(loan => loan.id === selectedLoans[0])
      const loanInfoId = firstLoan?.loanInfoId
      
      if (!loanInfoId) {
        throw new Error('Loan information not found')
      }
      
      const response = await axios.post('/api/pre-approved-loans/select', {
        selectedLoans,
        loanInfoId
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (response.data.success) {
        toast({
          title: "Success!",
          description: "Your loan selections have been saved. Proceeding to document collection.",
          variant: "default",
        })
        
        // Navigate to document collection page with the loan info ID
        router.push(response.data.redirectUrl || `/document-collection?id=${loanInfoId}`)
      } else {
        throw new Error(response.data.message || 'Failed to save loan selections')
      }
    } catch (err: any) {
      console.error('Error applying for loans:', err)
      toast({
        title: "Error",
        description: err.response?.data?.message || err.message || "Failed to apply for selected loans. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Loading Your Pre-Approved Loans</h2>
        <p className="text-gray-500 text-center max-w-md">
          We're retrieving your personalized loan options. This should only take a moment...
        </p>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="bg-red-100 p-4 rounded-full mb-4">
          <AlertTriangle className="h-10 w-10 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Unable to Load Loan Options</h2>
        <p className="text-gray-500 text-center max-w-md mb-4">
          {error}
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  // Show empty state if no loans are available
  if (preApprovedLoans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="bg-yellow-100 p-4 rounded-full mb-4">
          <Info className="h-10 w-10 text-yellow-600" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No Pre-Approved Loans Available</h2>
        <p className="text-gray-500 text-center max-w-md mb-4">
          We don't have any pre-approved loan options for you at this time. This could be because your application is still being processed or requires additional information.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => router.push('/dashboard')} variant="outline">
            Return to Dashboard
          </Button>
          <Button onClick={() => router.push('/loan-application')}>
            Start New Application
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
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
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Apply for Selected Loans
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
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
                      </div>
                      <CardDescription>
                        Expires in {loan.expiryDays} days • {loan.processingTime}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <img src={loan.logoUrl} alt={loan.lender} className="h-12" />
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Loan Amount</p>
                      <p className="text-xl font-bold">${loan.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Interest Rate</p>
                      <div className="flex items-center">
                        <p className="text-xl font-bold text-blue-700">{loan.interestRate}%</p>
                        <span className="text-xs text-gray-500 ml-1">(Comparison: {loan.comparisonRate}%)</span>
                    </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Monthly Repayment</p>
                      <p className="text-xl font-bold">${loan.monthlyRepayment.toFixed(2)}</p>
                    </div>
                  </div>

                  {loan.specialOffer && (
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mb-4 flex items-center">
                      <Sparkles className="h-5 w-5 text-yellow-600 mr-2" />
                      <div>
                        <p className="font-medium text-yellow-800">Special Offer: {loan.specialOffer}</p>
                        <p className="text-sm text-yellow-700">Limited time promotion</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {loan.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="bg-white">
                        <CheckCircle className="h-3 w-3 text-green-600 mr-1" /> {feature}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-2">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Cashback</p>
                        <p className="text-lg font-bold text-green-600">${loan.cashback?.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-2">
                        <TrendingDown className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Potential Savings</p>
                        <p className="text-lg font-bold text-green-600">${loan.estimatedSavings?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-medium">{loan.lenderRanking}</span>
                    <span className="text-gray-500 text-sm ml-1">/5 Rating</span>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => window.open(`/loan-details/${loan.id}`, '_blank')}
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        if (!selectedLoans.includes(loan.id)) {
                          toggleLoanSelection(loan.id)
                        }
                      }}
                      className={selectedLoans.includes(loan.id) ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {selectedLoans.includes(loan.id) ? "Selected" : "Select"}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="strategy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-5 w-5 text-blue-600" />
                Maximize Your Approval Chances
              </CardTitle>
              <CardDescription>
                Strategic tips to help you secure the best loan terms possible
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Why Apply for Multiple Loans?</h3>
                <p className="text-blue-700 mb-4">
                  Applying for multiple loans creates competition among lenders, which can lead to better terms and rates.
                  It also increases your chances of approval.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-blue-600" />
                      Negotiation Power
                    </h4>
                    <p className="text-sm text-gray-600">
                      Having multiple approvals gives you leverage to negotiate better rates and terms with your preferred lender.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                      <Shield className="h-4 w-4 mr-1 text-blue-600" />
                      Backup Options
                    </h4>
                    <p className="text-sm text-gray-600">
                      If one lender changes their mind or adds conditions, you'll have alternatives ready to go.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Application Timeline Strategy</h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200"></div>
                  <div className="space-y-6 relative">
                    <div className="flex">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center z-10 mr-4">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex-grow">
                        <h4 className="font-medium mb-1">Apply for Multiple Loans (Today)</h4>
                        <p className="text-sm text-gray-600">
                          Select and apply for 2-3 loans with different lenders to maximize your options.
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center z-10 mr-4">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex-grow">
                        <h4 className="font-medium mb-1">Submit Required Documents (1-2 Days)</h4>
                        <p className="text-sm text-gray-600">
                          Promptly provide all requested documentation to keep the process moving quickly.
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center z-10 mr-4">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex-grow">
                        <h4 className="font-medium mb-1">Review Formal Approvals (3-7 Days)</h4>
                        <p className="text-sm text-gray-600">
                          Compare the final offers and conditions from each lender.
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center z-10 mr-4">
                        <span className="text-white font-bold">4</span>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex-grow">
                        <h4 className="font-medium mb-1">Negotiate & Select (1-2 Days)</h4>
                        <p className="text-sm text-gray-600">
                          Use competing offers to negotiate better terms with your preferred lender.
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-600 flex items-center justify-center z-10 mr-4">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex-grow">
                        <h4 className="font-medium mb-1">Finalize Your Loan (7-14 Days)</h4>
                        <p className="text-sm text-gray-600">
                          Complete the final paperwork and close on your new loan.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Alert className="bg-yellow-50 border-yellow-100">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800">Important Note</AlertTitle>
                <AlertDescription className="text-yellow-700">
                  Multiple loan applications may result in multiple credit inquiries. However, inquiries for the same purpose
                  within a short period (usually 14-45 days) are typically counted as a single inquiry by credit scoring models.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="next">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ChevronRight className="mr-2 h-5 w-5 text-blue-600" />
                Next Steps in Your Loan Journey
              </CardTitle>
              <CardDescription>
                What to expect after selecting your preferred loan options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Document Collection</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    After selecting your loans, you'll need to provide supporting documentation to verify your application details.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Identity verification</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Income & employment proof</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Asset & liability statements</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Lender Review</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Lenders will review your complete application and may request additional information.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Credit assessment</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Property valuation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Serviceability calculation</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <ThumbsUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Final Approval</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Once your application is fully approved, you'll receive formal loan offers to compare.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Loan contract review</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Final negotiation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Settlement scheduling</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 p-5 rounded-lg border border-green-100">
                <h3 className="font-semibold text-lg text-green-800 mb-3 flex items-center">
                  <Download className="h-5 w-5 mr-2 text-green-600" />
                  Resources to Help You Prepare
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-green-100 flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <FileText className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Document Checklist</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        A comprehensive list of all documents you'll need to provide.
                      </p>
                      <Button variant="outline" size="sm" className="text-green-600 border-green-200">
                        Download PDF
                      </Button>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-100 flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <Info className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Loan Process Guide</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Detailed explanation of each step in the loan approval process.
                      </p>
                      <Button variant="outline" size="sm" className="text-green-600 border-green-200">
                        View Guide
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4">
                <Button
                  onClick={handleApplyForSelected}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={selectedLoans.length === 0 || submitting}
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue with Selected Loans
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  {selectedLoans.length === 0
                    ? "Please select at least one loan to continue"
                    : `You've selected ${selectedLoans.length} loan${selectedLoans.length > 1 ? "s" : ""}`}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}