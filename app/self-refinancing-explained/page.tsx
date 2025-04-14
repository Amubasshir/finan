import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, DollarSign, Zap, PiggyBank, Minus, Calculator } from "lucide-react"

export default function SelfRefinancingExplained() {
  // Update the content to focus on business loans
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Understanding Business Loan Self-Refinancing</h1>

      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">What is Business Loan Self-Refinancing?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">
            Business loan self-refinancing is the process of refinancing your business loan without the assistance of a
            traditional broker. With Refii, you can use our AI-powered tools to compare business loans, apply, and get
            approved all on your own.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-start space-x-2">
              <DollarSign className="h-6 w-6 text-green-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Save on Broker Fees</h3>
                <p className="text-sm">
                  Keep the commission typically paid to brokers, potentially saving thousands for your business. Get
                  this amount as cashback or off your loan.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Zap className="h-6 w-6 text-blue-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">AI-Powered Comparisons</h3>
                <p className="text-sm">
                  Get unbiased, data-driven recommendations tailored to your business situation.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-6 w-6 text-purple-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Full Control</h3>
                <p className="text-sm">
                  Take charge of your business refinancing journey with our user-friendly platform.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <PiggyBank className="h-6 w-6 text-red-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Potential for Better Rates</h3>
                <p className="text-sm">
                  Access a wide range of business lenders and potentially secure better interest rates.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">How Refii Helps You Self-Refinance Your Business Loan</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Compare business loans from multiple lenders using our AI-powered tool</li>
            <li>Get personalized recommendations based on your business financial situation</li>
            <li>Access educational resources to make informed decisions for your business</li>
            <li>Complete your application entirely online with our user-friendly interface</li>
            <li>Receive support from our AI assistant throughout the process</li>
            <li>Track your application progress in real-time</li>
            <li>Finalize your new business loan and start saving</li>
          </ol>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Get Broker Fees Back for Your Business</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            One of the biggest advantages of self-refinancing with Refii is the potential to get broker fees back for
            your business. Typically, these fees can range from 0.5% to 1.5% of your loan amount. Here's how your
            business can benefit:
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <DollarSign className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Cash Back for Your Business</h3>
                <p className="text-sm">
                  Some lenders offer cashback incentives for refinancing. With Refii, your business can keep this
                  cashback instead of it going to a broker. This could amount to thousands of dollars directly into your
                  business account.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Minus className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Reduced Business Loan Amount</h3>
                <p className="text-sm">
                  Alternatively, you can choose to have the broker fee amount deducted from your business loan
                  principal. This reduces your overall loan amount, potentially saving your business more in interest
                  over the life of your loan.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Calculator className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Potential Business Savings Example</h3>
                <p className="text-sm">
                  On a $500,000 business loan, broker fees could typically be $2,500 to $7,500. By self-refinancing with
                  Refii, your business could potentially save this entire amount, either as cash back or reduced from
                  your loan principal.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-8">
        <p className="text-lg mb-4">Ready to start your business loan self-refinancing journey?</p>
        <Button asChild size="lg">
          <Link href="/loan-comparison">Compare Business Loans Now</Link>
        </Button>
      </div>
    </div>
  )
}
