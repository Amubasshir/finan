import { Suspense } from "react"
import LoanComparisonContent from "./LoanComparisonContent"

export default function LoanComparisonPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoanComparisonContent />
    </Suspense>
  )
}
