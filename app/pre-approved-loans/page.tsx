import { Suspense } from "react"
import PreApprovedLoansContent from "./PreApprovedLoansContent"

export default function PreApprovedLoansPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]">Loading...</div>}>
      <PreApprovedLoansContent />
    </Suspense>
  )
}
