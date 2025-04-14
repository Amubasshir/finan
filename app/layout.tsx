import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "finan - Business Loan Refinancing",
  description: "Compare and refinance your business loan with finan",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <main className="flex-grow">{children}</main>
        <footer className="bg-gray-100 py-4">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>&copy; 2023 finan. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}


import './globals.css'