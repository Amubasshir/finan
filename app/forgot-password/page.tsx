"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Mail, ArrowLeft } from "lucide-react"
import { toast, Toaster } from "sonner"
import api from "@/lib/axios"

export default function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    try {
      await api.post('/auth/forgot-password', { email });
      
      setIsSubmitted(true)
      toast.success('Reset link sent', {
        description: 'If your email is registered, you will receive a password reset link.',
      });
      
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Toaster position="top-center" richColors />
      
      <div className="container mx-auto px-4 max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center">
              <div className="text-3xl font-bold text-blue-600">Refii</div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold mt-6 mb-2">Reset Your Password</h1>
          <p className="text-gray-600">We'll send you a link to reset your password</p>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Forgot Password</CardTitle>
          </CardHeader>

          <CardContent>
            {!isSubmitted ? (
              <>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <Mail className="h-5 w-5" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setError("")
                        }}
                        className="pl-10"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </div>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="mb-4 text-green-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Check your email</h3>
                <p className="text-gray-600 mb-4">
                  We've sent a password reset link to <span className="font-medium">{email}</span>
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  If you don't see it, please check your spam folder
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="mt-2"
                >
                  Try another email
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-center">
            <Link href="/login" className="text-blue-600 hover:underline flex items-center text-sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}