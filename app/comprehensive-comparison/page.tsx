"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AIBrokerChat } from "../components/AIBrokerChat"
import {
  DollarSign,
  Percent,
  ArrowRight,
  MessageSquare,
  BrainCircuit,
  CheckCircle,
  Shield,
  TrendingDown,
  Users,
  Award,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function ComprehensiveComparison() {
  const [showAIChat, setShowAIChat] = useState(false)
  const router = useRouter()

  const handleContinueToPreApproval = () => {
    router.push("/document-upload")
  }

  // Sample data for expected rate and savings
  const expectedRate = 3.25
  const potentialSavings = 15000
  const cashbackAmount = 2500

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Personalized Loan Opportunity</h1>

      {/* Floating action button for mobile */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <Button
          onClick={handleContinueToPreApproval}
          size="lg"
          className="bg-green-600 text-white hover:bg-green-700 rounded-full h-16 w-16 flex items-center justify-center shadow-lg"
        >
          <ArrowRight className="h-8 w-8" />
        </Button>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Expected Rate Card */}
          <Card className="bg-gray-800 border-gray-700 overflow-hidden relative">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-2 rounded-bl-lg font-semibold">
              Personalized Rate
            </div>
            <CardHeader>
              <CardTitle className="flex items-center text-white text-2xl">
                <Percent className="mr-2 h-8 w-8 text-blue-400" />
                Your Expected Rate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="text-7xl font-bold text-blue-400 flex items-baseline">
                  {expectedRate}
                  <span className="text-3xl ml-1">%</span>
                </div>
              </div>
              <p className="text-center text-gray-300">
                This is the rate Refii expects to secure for you based on your profile
              </p>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-white">
                  <span className="font-semibold text-blue-400">Note:</span> Actual rates may vary slightly based on
                  lender bids. We'll secure the best possible rate for your situation.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Potential Savings Card */}
          <Card className="bg-gray-800 border-gray-700 overflow-hidden relative">
            <div className="absolute top-0 right-0 bg-green-600 text-white px-4 py-2 rounded-bl-lg font-semibold">
              Estimated
            </div>
            <CardHeader>
              <CardTitle className="flex items-center text-white text-2xl">
                <DollarSign className="mr-2 h-8 w-8 text-green-400" />
                Your Potential Savings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="text-7xl font-bold text-green-400 flex items-baseline">
                  ${potentialSavings.toLocaleString()}
                </div>
              </div>
              <p className="text-center text-gray-300">
                Estimated savings over the life of your loan compared to your current rate
              </p>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-white">
                  <span className="font-semibold text-green-400">Plus:</span> You may be eligible for $
                  {cashbackAmount.toLocaleString()} cashback when you refinance through Refii
                </p>
              </div>
            </CardContent>
          </Card>

          {/* How Refii Works Card */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white text-2xl">
                <BrainCircuit className="mr-2 h-8 w-8 text-purple-400" />
                How Refii Works For You
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-900/30 p-2 rounded-full">
                    <Users className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-400">Lenders Compete For Your Business</h3>
                    <p className="text-gray-300">
                      Instead of you shopping around, we send your information to multiple lenders who compete to offer
                      you the best rate.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-900/30 p-2 rounded-full">
                    <TrendingDown className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-400">Lower Rates Through Competition</h3>
                    <p className="text-gray-300">
                      When lenders compete for your loan, you get access to rates that are typically lower than what
                      you'd find on your own.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-900/30 p-2 rounded-full">
                    <Shield className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-400">Protect Your Credit Score</h3>
                    <p className="text-gray-300">
                      Apply for multiple loans at once without multiple credit inquiries affecting your score. We bundle
                      all applications into a single credit check.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-900/30 p-2 rounded-full">
                    <Award className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-400">Exclusive Cashback Offers</h3>
                    <p className="text-gray-300">
                      Many of our lending partners provide cashback incentives that are only available through Refii.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps Card */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white text-2xl">
                <ArrowRight className="mr-2 h-8 w-8 text-teal-400" />
                Your Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ol className="space-y-4">
                <li className="flex items-start space-x-4">
                  <div className="bg-teal-900/30 p-2 rounded-full flex-shrink-0">
                    <span className="font-bold text-teal-400">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-teal-400">Continue to Pre-Approval</h3>
                    <p className="text-gray-300">
                      Click the button below to proceed to the document upload page where we'll collect the information
                      needed for lenders to provide pre-approval offers.
                    </p>
                  </div>
                </li>

                <li className="flex items-start space-x-4">
                  <div className="bg-teal-900/30 p-2 rounded-full flex-shrink-0">
                    <span className="font-bold text-teal-400">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-teal-400">Lenders Bid on Your Loan</h3>
                    <p className="text-gray-300">
                      We'll send your information to our network of lenders who will compete to offer you the best rates
                      and terms for your loan.
                    </p>
                  </div>
                </li>

                <li className="flex items-start space-x-4">
                  <div className="bg-teal-900/30 p-2 rounded-full flex-shrink-0">
                    <span className="font-bold text-teal-400">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-teal-400">Review Multiple Pre-Approvals</h3>
                    <p className="text-gray-300">
                      You'll receive multiple pre-approval offers from different lenders. You can apply for multiple
                      loans simultaneously without affecting your credit score.
                    </p>
                  </div>
                </li>

                <li className="flex items-start space-x-4">
                  <div className="bg-teal-900/30 p-2 rounded-full flex-shrink-0">
                    <span className="font-bold text-teal-400">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-teal-400">Choose Your Preferred Loan(s)</h3>
                    <p className="text-gray-300">
                      Select one or more pre-approval offers to proceed with. We encourage applying for multiple loans
                      to ensure you get the best possible outcome.
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Important Information Card */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <CheckCircle className="mr-2 h-6 w-6 text-yellow-400" />
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm text-white">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-400 mb-2">Multiple Applications, Single Credit Check</h3>
                  <p>
                    When you apply through Refii, we bundle all your loan applications into a single credit inquiry.
                    This means you can apply for multiple loans without multiple hits to your credit score.
                  </p>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-400 mb-2">Pre-Approval Timeline</h3>
                  <p>
                    Most lenders will respond with pre-approval offers within 24-48 hours. Some may respond even faster,
                    giving you quick access to competitive rates.
                  </p>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-400 mb-2">No Obligation</h3>
                  <p>
                    Receiving pre-approval offers doesn't obligate you to proceed with any loan. You're free to compare
                    offers and choose the one that best meets your needs, or decline all offers if you prefer.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
            <Button
              onClick={handleContinueToPreApproval}
              size="lg"
              className="bg-green-600 text-white hover:bg-green-700 px-8 py-6 text-lg font-semibold"
            >
              Continue to Pre-Approval
            </Button>
            <Button
              onClick={() => setShowAIChat(true)}
              size="lg"
              variant="outline"
              className="border-blue-500 text-blue-400 hover:bg-blue-900/20 px-8 py-6 text-lg font-semibold"
            >
              Ask Questions
            </Button>
          </div>
        </div>

        {/* AI Chat Assistant */}
        <div className="space-y-8">
          <Card className="bg-gray-800 border-gray-700 sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <MessageSquare className="mr-2 h-6 w-6 text-indigo-400" />
                AI Broker Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="ai-chat-toggle" className="text-white">
                  Enable AI Chat
                </Label>
                <Switch id="ai-chat-toggle" checked={showAIChat} onCheckedChange={setShowAIChat} className="ml-2" />
              </div>
              {showAIChat ? (
                <AIBrokerChat />
              ) : (
                <div className="text-center">
                  <p className="text-white mb-4">
                    Have questions about the pre-approval process or how Refii works? Talk to our AI Broker Assistant.
                  </p>
                  <Button onClick={() => setShowAIChat(true)} className="bg-indigo-500 hover:bg-indigo-600 text-white">
                    Start Chat
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Testimonial */}
          <Card className="bg-gray-800 border-gray-700 hidden lg:block">
            <CardContent className="pt-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="italic text-gray-300 mb-4">
                  "I was skeptical at first, but Refii saved me over $20,000 on my home loan. The lenders really did
                  compete for my business, and I ended up with a rate much lower than I expected."
                </p>
                <p className="text-right text-sm text-white font-semibold">— Sarah T., Refii Customer</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-gray-800 border-gray-700 hidden lg:block">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Average Savings</span>
                <span className="font-bold text-green-400">$12,500</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Average Rate Reduction</span>
                <span className="font-bold text-blue-400">0.75%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Customers Helped</span>
                <span className="font-bold text-purple-400">15,000+</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Lender Partners</span>
                <span className="font-bold text-yellow-400">45+</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom CTA for desktop */}
      <div className="hidden md:flex justify-center mt-12">
        <Button
          onClick={handleContinueToPreApproval}
          size="lg"
          className="bg-green-600 text-white hover:bg-green-700 px-8 py-6 text-lg font-semibold"
        >
          I'm Ready for Pre-Approval
        </Button>
      </div>
    </div>
  )
}
