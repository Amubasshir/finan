import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DetailedSuggestionsProps {
  formData: {
    loanAmount: number
    loanTerm: number
    loanPurpose: string
    interestRate: number
  }
}

export function DetailedSuggestions({ formData }: DetailedSuggestionsProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Detailed Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Based on your loan amount of ${formData.loanAmount.toLocaleString()} over {formData.loanTerm} years at{" "}
          {formData.interestRate}% interest, here are some detailed suggestions for your business loan:
        </p>
        <ul className="list-disc pl-5 mt-4 space-y-2">
          <li>Consider a split loan with part fixed and part variable to balance stability and flexibility</li>
          <li>Look for loans with no early repayment penalties to save on interest if your cash flow improves</li>
          <li>
            For equipment purchases, specialized equipment finance may offer better rates than general business loans
          </li>
          <li>
            If your business has seasonal fluctuations, consider a loan with redraw facilities or interest-only periods
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}
