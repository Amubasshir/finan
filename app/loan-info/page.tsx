"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LoanInfoDefaultPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the first step (property)
    router.push("/loan-info/property")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-3 text-blue-600">Redirecting to property information...</p>
    </div>
  )
}
