"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const steps = ["Account Details", "Personal Information"]

export default function SignUpForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // For this example, we'll simulate a successful registration and redirect

    router.push("/self-refinancing-explained")
  }

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Create Your Account</h3>
              <p className="text-gray-600 mb-4">
                Please provide your email and create a secure password to get started.
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </>
        )
      case 1:
        return (
          <>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
              <p className="text-gray-600 mb-4">
                Please provide your personal details to help us tailor our service to you.
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Sign Up for Refii</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Progress value={((currentStep + 1) / steps.length) * 100} className="w-full" />
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <span key={index} className={`text-sm ${index === currentStep ? "font-bold" : ""}`}>
                {step}
              </span>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStep()}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" onClick={prevStep} disabled={currentStep === 0}>
          Previous
        </Button>
        {currentStep === steps.length - 1 ? (
          <Button type="submit" onClick={handleSubmit}>
            Create Account
          </Button>
        ) : (
          <Button type="button" onClick={nextStep}>
            Next
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
