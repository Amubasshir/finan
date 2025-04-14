import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AIDetailedSuggestionsProps {
  formData: any // You might want to type this properly based on your form data structure
}

export function AIDetailedSuggestions({ formData }: AIDetailedSuggestionsProps) {
  // In a real application, you'd use the formData to generate personalized AI suggestions
  // For this example, we'll provide some AI-focused suggestions

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Loan Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Our AI analysis suggests that based on your income of ${formData.employment.annualIncome} and credit score
              range, you may qualify for our premium AI-optimized variable rate loan, potentially saving you up to 0.5%
              on your interest rate.
            </li>
            <li>
              The AI predicts that with your current savings rate and income growth trajectory, you could comfortably
              manage a loan term of {Math.max(formData.loanRequirements.loanTerm - 3, 15)} years, potentially saving you
              thousands in interest.
            </li>
            <li>
              Based on market trends and your risk profile, our AI recommends a 70-30 split between variable and fixed
              rates to optimize your loan structure.
            </li>
            <li>
              The AI has identified that your spending patterns make you an ideal candidate for our smart offset
              account, which could save you an estimated $20,000 over the life of your loan.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI-Recommended Loan Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Predictive Rate Adjustment: Our AI continuously monitors market conditions to adjust your rate,
              potentially saving you money.
            </li>
            <li>
              Smart Redraw Facility: AI-powered advice on when and how much to redraw based on your financial goals and
              market conditions.
            </li>
            <li>
              AI Financial Coach: Personalized financial advice and loan management tips powered by machine learning
              algorithms.
            </li>
            <li>
              Quantum-Optimized Repayments: Leveraging quantum computing to calculate the most efficient repayment
              strategy for your unique financial situation.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Alert>
        <AlertTitle>AI-Driven Next Steps</AlertTitle>
        <AlertDescription>
          1. Engage with our AI chatbot to fine-tune your loan preferences and receive real-time market insights. 2.
          Allow our AI to analyze your bank statements (with your permission) for a more accurate assessment of your
          borrowing capacity and optimal loan structure. 3. Use our AI-powered loan simulator to see how different
          scenarios could affect your financial future. 4. Schedule a video call with our AI-assisted loan specialist
          for a personalized walkthrough of your options.
        </AlertDescription>
      </Alert>
    </div>
  )
}
