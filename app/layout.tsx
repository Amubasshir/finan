import { Providers } from "@/lib/redux/provider"
import type { Metadata } from "next"
import type React from "react"
import "./globals.css"



export const metadata: Metadata = {
  title: "finan - Business Loan Refinancing",
  description: "Compare and refinance your business loan with finan",
  generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="min-h-screen flex flex-col">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  )
}
