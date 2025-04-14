import { Suspense } from "react"
import DocumentCollectionContent from "./DocumentCollectionContent"

export default function DocumentCollection() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DocumentCollectionContent />
    </Suspense>
  )
}
