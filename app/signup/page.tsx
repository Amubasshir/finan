"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, CheckCircle, Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { toast, Toaster } from "sonner"
import api from "@/lib/axios"
import { useAppDispatch } from "@/lib/redux/hooks"
import { signup, setCredentials } from "@/lib/redux/slices/authSlice"

export default function SignUp() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState("")
  const [progressValue, setProgressValue] = useState(0)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    receiveUpdates: false,
  })

  // Update progress value based on step and form completion
  useEffect(() => {
    if (step === 1) {
      // Calculate step 1 progress (0-45%)
      const step1Fields = ['fullName', 'email', 'phone'];
      const filledFields = step1Fields.filter(field => formData[field].trim() !== '').length;
      const step1Progress = Math.floor((filledFields / step1Fields.length) * 45);
      setProgressValue(step1Progress);
    } else {
      // Calculate step 2 progress (45-100%)
      const step2Fields = ['password', 'confirmPassword'];
      const filledFields = step2Fields.filter(field => formData[field] !== '').length;
      const termsChecked = formData.agreeTerms ? 1 : 0;
      const step2Progress = 45 + Math.floor(((filledFields / step2Fields.length) * 45) + (termsChecked * 10));
      setProgressValue(step2Progress);
    }
  }, [formData, step]);

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

  const handleCheckboxChange = (name: string) => (checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))

    // Clear error when user checks
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Updated phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^(?:\+61|0)[4-9]\d{8}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please provide a valid Australian phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else {
      // Enhanced password validation
      const hasUpperCase = /[A-Z]/.test(formData.password)
      const hasLowerCase = /[a-z]/.test(formData.password)
      const hasNumber = /[0-9]/.test(formData.password)
      const hasSpecialChar = /[^A-Za-z0-9]/.test(formData.password)
      const isLongEnough = formData.password.length >= 8

      if (!isLongEnough) {
        newErrors.password = "Password must be at least 8 characters"
      } else if (!hasUpperCase) {
        newErrors.password = "Password must contain at least one uppercase letter"
      } else if (!hasLowerCase) {
        newErrors.password = "Password must contain at least one lowercase letter"
      } else if (!hasNumber) {
        newErrors.password = "Password must contain at least one number"
      } else if (!hasSpecialChar) {
        newErrors.password = "Password must contain at least one special character"
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
      window.scrollTo(0, 0)
    } else if (step === 2 && validateStep2()) {
      handleSubmit()
    }
  }

  // The handleSubmit function with Redux
  const handleSubmit = async () => {
    if (!validateStep2()) {
      return; // Don't proceed if validation fails
    }

    setIsLoading(true)
    setApiError("")
    
    try {
      const resultAction = await dispatch(signup({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone.replace(/\s/g, ""), // Remove spaces before sending
        password: formData.password,
        receiveUpdates: formData.receiveUpdates,
        agreeTerms: formData.agreeTerms,
      })).unwrap();
      
      // Only proceed with success actions if we have a valid response
      if (resultAction?.user) {
        toast.success('Welcome aboard!', {
          description: `Congratulations ${formData.fullName}! Your account has been successfully registered. Let's get started with your loan journey.`,
          duration: 6000,
        });
        
        // Redirect to the loan information form after a short delay
        setTimeout(() => {
          router.push("/loan-info/property");
        }, 1000);
      } else {
        throw new Error('Invalid response from server');
      }
      
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Handle specific error types
      if (error?.data?.message?.includes('phone')) {
        setErrors(prev => ({
          ...prev,
          phone: "Please provide a valid phone number"
        }));
        setStep(1); // Go back to first step if phone number is invalid

      } else if (error.status === 409) {
        setApiError('This email is already registered. Please try logging in instead.');
      } else if (error.status === 400) {
        setApiError('Please check your information and try again.');
      } else if (error.message) {
        setApiError(error.message);
      } else {
        setApiError('Failed to create account. Please try again later.');
      }
      
      // Show error toast
      toast.error('Registration failed', {
        description: error.message || 'Please check your information and try again.',
        duration: 5000,
      });
      
      // Reset form progress if there's a serious error
      if (error.status >= 500) {
        setStep(1);
        window.scrollTo(0, 0);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" }

    let strength = 0
    let requirements = []

    // Length check
    if (password.length >= 8) {
      strength += 1
      requirements.push("length")
    }

    // Character variety checks with specific tracking
    if (/[A-Z]/.test(password)) {
      strength += 1
      requirements.push("uppercase")
    }
    if (/[a-z]/.test(password)) {
      strength += 1
      requirements.push("lowercase")
    }
    if (/[0-9]/.test(password)) {
      strength += 1
      requirements.push("number")
    }
    if (/[^A-Za-z0-9]/.test(password)) {
      strength += 1
      requirements.push("special")
    }

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
      strength: Math.min(100, (strength / 5) * 100),
      label,
      color,
      requirements
    }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  useEffect(() => {
   
    try {
      const token:any = localStorage.getItem('token');

      if (token) {
       
        router.push("/loan-info/property");
      }
    } catch (error) {
      
    }
  }, [])
  // The JSX return with the added top progress bar
  return (
    <div className="min-h-screen bg-gray-50 py-12 pt-16">
      {/* Add the Toaster component */}
      <Toaster position="top-center" richColors />
      
      {/* Fixed top progress bar with improved visibility */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
        <div className="h-1 w-full bg-gray-100">
          <div 
            className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
            style={{ width: `${progressValue}%` }}
          ></div>
        </div>
        <div className="py-2 px-4 text-xs text-gray-500 text-center">
          {progressValue < 45 ? 'Step 1 of 2: Personal Details' : 'Step 2 of 2: Create Password'}
        </div>
      </div>
      
      <div className="container mx-auto px-4 max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center">
              <div className="text-3xl font-bold text-blue-600">Refii</div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold mt-6 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Join thousands saving on their home loans</p>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="pb-2">
            <div className="w-full mb-4">
              <Progress value={step === 1 ? 50 : 100} className="h-2" />
            </div>
            <CardTitle className="text-xl">{step === 1 ? "Your Details" : "Create Password"}</CardTitle>
          </CardHeader>

          <CardContent className="pt-4">
            {apiError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                {apiError}
              </div>
            )}
            
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <User className="h-5 w-5" />
                      </div>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="John Smith"
                      />
                    </div>
                    {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
                  </div>

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
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <Phone className="h-5 w-5" />
                      </div>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="0400 123 456"
                      />
                    </div>
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="password">Create Password</Label>
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

                    {formData.password && (
                      <div className="space-y-1 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Password strength:</span>
                          <span className={`text-xs font-medium ${
                            passwordStrength.label === "Weak" ? "text-red-500" :
                            passwordStrength.label === "Medium" ? "text-yellow-500" :
                            "text-green-500"
                          }`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${passwordStrength.color} transition-all duration-300`}
                            style={{ width: `${passwordStrength.strength}%` }}
                          ></div>
                        </div>
                        <ul className="text-xs text-gray-500 space-y-1 mt-2">
                          <li className={/[A-Z]/.test(formData.password) ? "text-green-500" : ""}>
                            • At least one uppercase letter {/[A-Z]/.test(formData.password) && "✓"}
                          </li>
                          <li className={/[a-z]/.test(formData.password) ? "text-green-500" : ""}>
                            • At least one lowercase letter {/[a-z]/.test(formData.password) && "✓"}
                          </li>
                          <li className={/[0-9]/.test(formData.password) ? "text-green-500" : ""}>
                            • At least one number {/[0-9]/.test(formData.password) && "✓"}
                          </li>
                          <li className={/[^A-Za-z0-9]/.test(formData.password) ? "text-green-500" : ""}>
                            • At least one special character {/[^A-Za-z0-9]/.test(formData.password) && "✓"}
                          </li>
                          <li className={formData.password.length >= 8 ? "text-green-500" : ""}>
                            • Minimum 8 characters {formData.password.length >= 8 && "✓"}
                          </li>
                        </ul>
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
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onCheckedChange={handleCheckboxChange("agreeTerms")}
                      />
                      <div>
                        <Label htmlFor="agreeTerms" className="text-sm cursor-pointer">
                          I agree to the{" "}
                          <Link href="#" className="text-blue-600 hover:underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="#" className="text-blue-600 hover:underline">
                            Privacy Policy
                          </Link>
                        </Label>
                      </div>
                    </div>
                    {errors.agreeTerms && <p className="text-sm text-red-500">{errors.agreeTerms}</p>}

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="receiveUpdates"
                        checked={formData.receiveUpdates}
                        onCheckedChange={handleCheckboxChange("receiveUpdates")}
                      />
                      <Label htmlFor="receiveUpdates" className="text-sm cursor-pointer">
                        I'd like to receive updates about special offers, products and services
                      </Label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="flex justify-between pt-2">
            {step === 1 ? (
              <div></div>
            ) : (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(1)}
                disabled={isLoading}
                className="text-gray-500"
              >
                Back
              </Button>
            )}
            <Button
              type="button"
              onClick={handleNextStep}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
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
                  {step === 1 ? "Next" : "Creating Account..."}
                </div>
              ) : (
                <>
                  {step === 1 ? "Next" : "Create Account"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
