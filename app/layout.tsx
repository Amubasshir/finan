import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import type React from "react"
import { Providers } from "@/lib/redux/provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "finan - Business Loan Refinancing",
  description: "Compare and refinance your business loan with finan",
  generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  )
}


