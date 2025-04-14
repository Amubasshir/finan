import { Suspense } from "react"
import LoanInformationFormContent from "./LoanInformationFormContent"

export default function LoanInformationForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoanInformationFormContent />
    </Suspense>
  )
}
