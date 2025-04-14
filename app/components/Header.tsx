"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          finan
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/self-refinancing-explained" className="text-gray-600 hover:text-gray-900">
            What is Self-Refinancing?
          </Link>
          <Link href="/signup" className="text-gray-600 hover:text-gray-900">
            Compare Home Loans
          </Link>
          <Link href="/document-upload" className="text-gray-600 hover:text-gray-900">
            Document Upload
          </Link>
          <Link href="/settings" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Settings
          </Link>
          <Button variant="outline" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
