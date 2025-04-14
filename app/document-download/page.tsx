import { Suspense } from "react"
import DocumentDownloadContent from "./DocumentDownloadContent"

export default function DocumentDownload() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DocumentDownloadContent />
    </Suspense>
  )
}
