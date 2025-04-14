"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ArrowRight, Phone, Mail, Lock } from "lucide-react"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function PhoneVerification({ onVerificationComplete }: { onVerificationComplete: () => void }) {
  const router = useRouter()
  const [step, setStep] = useState<"login" | "verify">("login")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [pin, setPin] = useState(["", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const pinRefs = useRef<(HTMLInputElement | null)[]>([])

  // Handle PIN input
  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1)
    }

    const newPin = [...pin]
    newPin[index] = value
    setPin(newPin)

    // Auto-focus next input
    if (value && index < 3) {
      pinRefs.current[index + 1]?.focus()
    }
  }

  // Handle backspace in PIN input
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus()
    }
  }

  // Handle login form submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!phone && !email) {
      setError("Please enter your phone number or email")
      return
    }

    if (!password) {
      setError("Please enter your password")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setStep("verify")
    }, 1000)
  }

  // Handle PIN verification
  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (pin.some((digit) => digit === "")) {
      setError("Please enter the complete verification code")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      // Check if PIN is correct (for demo, we'll accept any 4-digit PIN)
      if (pin.join("") === "1234") {
        onVerificationComplete()
      } else {
        setError("Invalid verification code. Try 1234 for demo.")
      }
    }, 1000)
  }

  // Handle resend code
  const handleResendCode = () => {
    setError("")
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setError("A new verification code has been sent")
    }, 1000)
  }

  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} className="w-full max-w-md">
        {step === "login" ? (
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Welcome to Refii</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneOrEmail">Phone Number or Email</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400">
                      {phone.length > 0 || email.length === 0 ? (
                        <Phone className="h-5 w-5" />
                      ) : (
                        <Mail className="h-5 w-5" />
                      )}
                    </div>
                    <Input
                      id="phoneOrEmail"
                      type={phone.length > 0 || email.length === 0 ? "tel" : "email"}
                      value={phone.length > 0 ? phone : email}
                      onChange={(e) => {
                        const val = e.target.value
                        // If input contains only numbers and special chars like +, -, (, ), space
                        if (/^[0-9+\-() ]*$/.test(val)) {
                          setPhone(val)
                          setEmail("")
                        } else {
                          setEmail(val)
                          setPhone("")
                        }
                      }}
                      className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                      placeholder="0400 123 456 or your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login & Continue"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
            <CardFooter className="justify-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Button variant="link" className="p-0" onClick={() => router.push("/signup")}>
                  Sign up
                </Button>
              </p>
            </CardFooter>
          </Card>
        ) : (
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Verify Your Phone</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerifySubmit} className="space-y-4">
                <p className="text-center text-gray-600">We've sent a 4-digit code to {phone || "your phone"}</p>

                <div className="flex justify-center space-x-2 py-4">
                  {[0, 1, 2, 3].map((i) => (
                    <Input
                      key={i}
                      ref={(el) => (pinRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={pin[i]}
                      onChange={(e) => handlePinChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      className="w-14 h-14 text-center text-2xl font-bold transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  ))}
                </div>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify & Continue"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="text-center">
                  <Button type="button" variant="link" onClick={handleResendCode} disabled={isLoading}>
                    Resend Code
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="justify-center">
              <Button variant="outline" onClick={() => setStep("login")} disabled={isLoading}>
                Back to Login
              </Button>
            </CardFooter>
          </Card>
        )}
      </motion.div>
    </div>
  )
}
