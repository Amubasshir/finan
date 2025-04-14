import { Suspense } from "react"
import WaitingForApprovalContent from "./WaitingForApprovalContent"

export default function WaitingForApprovalPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WaitingForApprovalContent />
    </Suspense>
  )
}
