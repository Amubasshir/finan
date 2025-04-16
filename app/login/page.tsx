"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { toast, Toaster } from "sonner"
import api from "@/lib/axios"
import { useAppDispatch } from "@/lib/redux/hooks"
import { login } from "@/lib/redux/slices/authSlice"

export default function Login() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState("")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
    
    // Clear API error when user makes changes
    if (apiError) {
      setApiError("")
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // The handleSubmit function with Redux
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setApiError("")
    
    try {
      // Use Redux thunk for login
      const resultAction = await dispatch(login({
        email: formData.email,
        password: formData.password,
      })).unwrap();
      
      // Show success toast
      toast.success('Login successful!', {
        description: `Welcome back, ${resultAction.user.fullName}! You've been logged in successfully.`,
        duration: 3000,
      });
      
      // Store rememberMe preference
      if (formData.rememberMe && typeof window !== "undefined") {
        localStorage.setItem('rememberMe', 'true');
      }
      
      // Redirect to loan information form after a short delay
      setTimeout(() => {
        router.push("/loan-info/new/property");
      }, 1000);
      
    } catch (error) {
      console.error('Login error:', error);
      setApiError(error?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Add the Toaster component */}
      <Toaster position="top-center" richColors />
      
      <div className="container mx-auto px-4 max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center">
              <div className="text-3xl font-bold text-blue-600">Refii</div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold mt-6 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Log in to continue your refinancing journey</p>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Log In</CardTitle>
          </CardHeader>

          <CardContent>
            {apiError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                {apiError}
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
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    placeholder="your.email@example.com"
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="rememberMe" checked={formData.rememberMe} onCheckedChange={handleCheckboxChange} />
                <Label htmlFor="rememberMe" className="text-sm cursor-pointer">
                  Remember me for 30 days
                </Label>
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
                    Logging in...
                  </div>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By logging in, you agree to our{" "}
            <Link href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
