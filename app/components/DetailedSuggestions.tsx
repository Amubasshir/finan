import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface DetailedSuggestionsProps {
  formData: any // You might want to type this properly based on your form data structure
}

export function DetailedSuggestions({ formData }: DetailedSuggestionsProps) {
  // In a real application, you'd use the formData to generate personalized suggestions
  // For this example, we'll provide some generic suggestions

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personalized Loan Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Based on your income and credit score, you may qualify for more competitive interest rates. Consider
              negotiating with lenders or exploring online-only banks for better offers.
            </li>
            <li>
              Your desired loan term of {formData.loanRequirements.loanTerm} years aligns well with your age and
              financial goals. However, you might want to consider a slightly shorter term to save on interest over the
              life of the loan.
            </li>
            <li>
              Given your stable employment history, you're in a strong position to negotiate better terms or additional
              features like offset accounts or redraw facilities.
            </li>
            <li>
              Your current debts are relatively low compared to your income. This puts you in a good position for
              refinancing and potentially increasing your borrowing capacity.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Loan Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>Offset Account: This could help you save on interest while maintaining financial flexibility.</li>
            <li>
              Redraw Facility: Given your stable income, this feature could provide peace of mind for unexpected
              expenses.
            </li>
            <li>Extra Repayments: Look for loans that allow unlimited extra repayments without penalties.</li>
            <li>
              Split Loan: Consider splitting your loan between fixed and variable rates to balance stability and
              flexibility.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Alert>
        <AlertTitle>Next Steps</AlertTitle>
        <AlertDescription>
          1. Compare the suggested loans in detail, paying attention to both interest rates and features. 2. Use the AI
          Chat Assistant to ask any specific questions about the loans or refinancing process. 3. Once you've selected a
          loan, click on "Apply" to start the application process. 4. Consider speaking with a Refii loan specialist for
          personalized advice tailored to your unique situation.
        </AlertDescription>
      </Alert>
    </div>
  )
}
