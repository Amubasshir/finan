import { Suspense } from "react"
import LoanAcceptanceConfirmationContent from "./LoanAcceptanceConfirmationContent"

export default function LoanAcceptanceConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]">Loading...</div>}>
      <LoanAcceptanceConfirmationContent />
    </Suspense>
  )
}
