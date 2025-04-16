"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react"
import { toast, Toaster } from "sonner"
import api from "@/lib/axios"

export default function ResetPassword({ params }: { params: { token: string } }) {
  const router = useRouter()
  const { token } = params
  
  const [isLoading, setIsLoading] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        // You could create a separate endpoint to validate tokens
        // For now, we'll just check during reset
      } catch (error) {
        setIsTokenValid(false)
      }
    }
    
    validateToken()
  }, [token])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const validateForm = () => {
    if (!formData.password) {
      setError("Password is required")
      return false
    }
    
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return false
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    setError("")
    
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        password: formData.password,
      })
      
      setIsSuccess(true)
      toast.success('Password reset successful', {
        description: 'Your password has been reset. You can now log in with your new password.',
      })
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
      
    } catch (error) {
      console.error('Reset password error:', error)
      const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.'
      setError(errorMessage)
      
      if (error.response?.status === 400) {
        setIsTokenValid(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "" }

    let strength = 0

    // Length check
    if (password.length >= 8) strength += 1
    if (password.length >= 12) strength += 1

    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    let label = ""
    let color = ""

    if (strength <= 2) {
      label = "Weak"
      color = "bg-red-500"
    } else if (strength <= 4) {
      label = "Medium"
      color = "bg-yellow-500"
    } else {
      label = "Strong"
      color = "bg-green-500"
    }

    return {
      strength: Math.min(100, (strength / 6) * 100),
      label,
      color,
    }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  if (!isTokenValid) {
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
          </div>

          <Card className="border-none shadow-lg">
            <CardContent className="pt-6 pb-6">
              <div className="text-center py-4">
                <div className="mb-4 text-red-500">
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
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Invalid or Expired Link</h3>
                <p className="text-gray-600 mb-4">
                  This password reset link is invalid or has expired.
                </p>
                <Button
                  onClick={() => router.push('/forgot-password')}
                  className="mt-2 bg-blue-600 hover:bg-blue-700"
                >
                  Request New Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isSuccess) {
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
          </div>

          <Card className="border-none shadow-lg">
            <CardContent className="pt-6 pb-6">
              <div className="text-center py-4">
                <div className="mb-4 text-green-500">
                  <CheckCircle className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium mb-2">Password Reset Successful</h3>
                <p className="text-gray-600 mb-4">
                  Your password has been reset successfully.
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  You will be redirected to the login page in a few seconds.
                </p>
                <Button
                  onClick={() => router.push('/login')}
                  className="mt-2 bg-blue-600 hover:bg-blue-700"
                >
                  Go to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
          <h1 className="text-2xl font-bold mt-6 mb-2">Create New Password</h1>
          <p className="text-gray-600">Enter your new password below</p>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Reset Password</CardTitle>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs">Password Strength</span>
                      <span className="text-xs font-medium">{passwordStrength.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
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
                    Resetting...
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}