import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Info } from "lucide-react"

export function AIRecommendedLoanStructures() {
  const loanStructures = [
    {
      type: "Fixed Rate Home Loan",
      description: "Fixed interest rate for a set period",
      bestFor: "Budget certainty, first-time homebuyers",
      interestRate: "5.15% - 5.75%",
      features: ["Predictable repayments", "Protection from rate rises", "Terms from 1-5 years"],
      recommendation: "high",
    },
    {
      type: "Variable Rate Home Loan",
      description: "Interest rate can change over time",
      bestFor: "Flexibility, potential for lower rates",
      interestRate: "5.35% - 5.95%",
      features: ["Lower rates when market drops", "Additional repayment options", "Redraw facilities"],
      recommendation: "medium",
    },
    {
      type: "Split Home Loan",
      description: "Part fixed, part variable interest rate",
      bestFor: "Balancing certainty with flexibility",
      interestRate: "5.25% - 5.85%",
      features: ["Best of both worlds", "Hedge against rate changes", "Customizable split ratio"],
      recommendation: "medium",
    },
  ]

  const getRecommendationBadge = (level: string) => {
    switch (level) {
      case "high":
        return (
          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" /> Highly Recommended
          </div>
        )
      case "medium":
        return (
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <Info className="h-3 w-3 mr-1" /> Recommended
          </div>
        )
      case "low":
        return (
          <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" /> Consider
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">AI Recommended Home Loan Options</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loanStructures.map((structure, index) => (
            <Card key={index} className="h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{structure.type}</CardTitle>
                  {getRecommendationBadge(structure.recommendation)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">{structure.description}</p>
                <div>
                  <p className="text-sm font-medium">Best for:</p>
                  <p className="text-gray-700">{structure.bestFor}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Typical interest rate:</p>
                  <p className="text-green-600 font-semibold">{structure.interestRate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Key features:</p>
                  <ul className="list-disc pl-5 text-gray-700 text-sm">
                    {structure.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
