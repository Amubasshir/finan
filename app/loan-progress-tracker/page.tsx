import { Suspense } from "react"
import LoanProgressTrackerContent from "./LoanProgressTrackerContent"

export default function LoanProgressTracker() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoanProgressTrackerContent />
    </Suspense>
  )
}
