"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()

  useEffect(() => {
    // Check admin authorization
    const user = localStorage.getItem('userData')
    const userData = user ? JSON.parse(user) : null
    
    if (!userData || userData.role !== 'admin') {
      router.push('/login')
      return
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Admin Portal</h1>
              </div>
            </div>
            <div className="flex items-center">
              {/* Add admin navigation items here */}
            </div>
          </div>
        </div>
      </nav>
      
      <main className="py-6 px-8">
        {children}
      </main>
    </div>
  )
}