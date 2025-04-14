import { Suspense } from "react"
import { ComparePageContent } from "./ComparePageContent"

export default function CompareLoansPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ComparePageContent />
    </Suspense>
  )
}
