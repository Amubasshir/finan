"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertTriangle, Info, Calendar, Phone, Mail, MessageSquare } from "lucide-react"

export default function WaitingForApprovalContent() {
  const router = useRouter()
  const [progress, setProgress] = useState(35)
  const [daysElapsed, setDaysElapsed] = useState(2)
  const [estimatedDaysRemaining, setEstimatedDaysRemaining] = useState(3)
  const [activeTab, setActiveTab] = useState("status")
  const [showTip, setShowTip] = useState(0)

  // Add a function to check pre-approval status
  const checkPreApprovalStatus = () => {
    router.push("/pre-approval-status")
  }

  // Simulate progress updates
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + Math.random() * 0.5
        return newProgress > 95 ? 95 : newProgress
      })
    }, 60000) // Update every minute for demo purposes

    return () => clearInterval(timer)
  }, [])

  // Rotate through tips
  useEffect(() => {
    const tipTimer = setInterval(() => {
      setShowTip((prevTip) => (prevTip + 1) % 5)
    }, 8000)

    return () => clearInterval(tipTimer)
  }, [])

  // Calculate application date and expected completion date
  const applicationDate = new Date()
  applicationDate.setDate(applicationDate.getDate() - daysElapsed)

  const expectedCompletionDate = new Date()
  expectedCompletionDate.setDate(expectedCompletionDate.getDate() + estimatedDaysRemaining)

  const tips = [
    {
      title: "Keep your phone handy",
      description: "Our team or the lender might call you to verify information or request additional details.",
      icon: <Phone className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "Check your email regularly",
      description: "We'll send important updates and requests for additional information via email.",
      icon: <Mail className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "Don't apply for new credit",
      description: "Avoid applying for new credit cards or loans while your application is being processed.",
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    },
    {
      title: "Maintain your financial situation",
      description: "Try to keep your financial situation stable until your loan is approved.",
      icon: <Info className="h-5 w-5 text-purple-500" />,
    },
    {
      title: "Start planning your next steps",
      description: "Begin thinking about your settlement timeline and moving arrangements.",
      icon: <Calendar className="h-5 w-5 text-green-500" />,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2 text-center">Your Conditional Approval Status</h1>
      <p className="text-center text-gray-600 mb-8">
        We're currently processing your application and working with lenders to convert your conditional approval to
        pre-approval.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center text-blue-800">
              <Clock className="mr-2 h-5 w-5 text-blue-600" />
              Application Progress
            </CardTitle>
            <CardDescription>Your application was submitted on {applicationDate.toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">Conditional to Pre-Approval Status</span>
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                    <Clock className="mr-1 h-3 w-3" /> In Progress
                  </Badge>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>Application Submitted</span>
                  <span>Document Verification</span>
                  <span>Lender Review</span>
                  <span>Pre-Approval</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Days Since Application</p>
                  <p className="text-2xl font-bold">{daysElapsed}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Estimated Days Remaining</p>
                  <p className="text-2xl font-bold">{estimatedDaysRemaining}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Expected Completion</p>
                  <p className="text-2xl font-bold">{expectedCompletionDate.toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-3">Current Stage: Document Verification</h3>
                <p className="text-gray-600">
                  Your application and supporting documents are currently being reviewed to convert your conditional
                  approval to pre-approval. This process typically takes 3-5 business days.
                </p>
              </div>

              <Alert className="mt-4 bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Next Update Expected</AlertTitle>
                <AlertDescription className="text-blue-700">
                  We'll provide you with an update on your application status within the next 24-48 hours.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="flex items-center text-green-800">
              <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3 mt-0.5">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Conditional Approval</h4>
                  <p className="text-sm text-gray-600">
                    Your application has been conditionally approved based on the information provided.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 mt-0.5">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Document Verification</h4>
                  <p className="text-sm text-gray-600">
                    Lenders are reviewing your documents to verify your information.
                  </p>
                </div>
              </div>

              <div className="flex items-start opacity-60">
                <div className="bg-gray-100 p-2 rounded-full mr-3 mt-0.5">
                  <span className="h-4 w-4 text-gray-400">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Pre-Approval</h4>
                  <p className="text-sm text-gray-600">You'll receive formal pre-approval offers from lenders.</p>
                </div>
              </div>

              <div className="flex items-start opacity-60">
                <div className="bg-gray-100 p-2 rounded-full mr-3 mt-0.5">
                  <span className="h-4 w-4 text-gray-400">4</span>
                </div>
                <div>
                  <h4 className="font-medium">Loan Selection</h4>
                  <p className="text-sm text-gray-600">Choose the best loan offer for your needs.</p>
                </div>
              </div>

              <div className="flex items-start opacity-60">
                <div className="bg-gray-100 p-2 rounded-full mr-3 mt-0.5">
                  <span className="h-4 w-4 text-gray-400">5</span>
                </div>
                <div>
                  <h4 className="font-medium">Final Approval & Settlement</h4>
                  <p className="text-sm text-gray-600">Complete the final steps to secure your home loan.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="status">Application Status</TabsTrigger>
          <TabsTrigger value="instructions">While You Wait</TabsTrigger>
          <TabsTrigger value="faq">FAQs</TabsTrigger>
        </TabsList>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Application Status</CardTitle>
              <CardDescription>
                Here's a detailed breakdown of your application status and what's happening behind the scenes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 flex flex-col items-center mr-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div className="w-0.5 h-16 bg-green-200"></div>
                  </div>
                  <div className="pt-1 pb-8">
                    <h3 className="text-xl font-semibold mb-2 text-green-700">Application Received</h3>
                    <p className="text-gray-600">
                      Your application has been successfully received and logged in our system. All required documents
                      have been uploaded.
                    </p>
                    <span className="inline-block mt-2 text-sm text-green-600 font-medium">
                      Completed on {applicationDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 flex flex-col items-center mr-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div className="w-0.5 h-16 bg-green-200"></div>
                  </div>
                  <div className="pt-1 pb-8">
                    <h3 className="text-xl font-semibold mb-2 text-green-700">Initial Verification</h3>
                    <p className="text-gray-600">
                      Our team has verified your identity and initial documentation. Your application has passed the
                      preliminary checks.
                    </p>
                    <span className="inline-block mt-2 text-sm text-green-600 font-medium">
                      Completed on {new Date(applicationDate.getTime() + 86400000).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 flex flex-col items-center mr-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div className="w-0.5 h-16 bg-gray-200"></div>
                  </div>
                  <div className="pt-1 pb-8">
                    <h3 className="text-xl font-semibold mb-2 text-blue-700">Lender Assessment</h3>
                    <p className="text-gray-600">
                      Your application is currently being assessed by our lending partners. They are reviewing your
                      financial information, credit history, and property details.
                    </p>
                    <span className="inline-block mt-2 text-sm text-blue-600 font-medium">In Progress</span>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 flex flex-col items-center mr-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-400">
                      <span>4</span>
                    </div>
                    <div className="w-0.5 h-16 bg-gray-200"></div>
                  </div>
                  <div className="pt-1 pb-8">
                    <h3 className="text-xl font-semibold mb-2 text-gray-500">Pre-Approval Decision</h3>
                    <p className="text-gray-600">
                      Lenders will make their pre-approval decisions based on their assessment of your application.
                    </p>
                    <span className="inline-block mt-2 text-sm text-gray-500 font-medium">Pending</span>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 flex flex-col items-center mr-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-400">
                      <span>5</span>
                    </div>
                  </div>
                  <div className="pt-1">
                    <h3 className="text-xl font-semibold mb-2 text-gray-500">Pre-Approval Notification</h3>
                    <p className="text-gray-600">
                      You'll be notified of pre-approval decisions and presented with available loan options.
                    </p>
                    <span className="inline-block mt-2 text-sm text-gray-500 font-medium">Pending</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructions">
          <Card>
            <CardHeader>
              <CardTitle>What to Do While You Wait</CardTitle>
              <CardDescription>
                Here are some important things to know and do while your application is being processed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 shadow-sm">
                  <h3 className="text-xl font-semibold mb-4 text-blue-800">Tips for a Smooth Approval Process</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 transition-all duration-300 hover:shadow-md">
                      {tips[showTip].icon}
                      <h4 className="font-semibold mt-2 mb-1">{tips[showTip].title}</h4>
                      <p className="text-sm text-gray-600">{tips[showTip].description}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Avoid Major Financial Changes</h4>
                          <p className="text-sm text-gray-600">
                            Don't make large purchases, change jobs, or apply for new credit during this time.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Respond Promptly to Requests</h4>
                          <p className="text-sm text-gray-600">
                            If we need additional information, respond as quickly as possible to avoid delays.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Keep Your Contact Information Updated</h4>
                          <p className="text-sm text-gray-600">
                            Ensure your phone and email are correct so we can reach you.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                    <h3 className="text-lg font-semibold mb-3 text-green-800">Start Planning Your Next Steps</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
                        <span className="text-gray-700">Research potential properties if you're buying</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
                        <span className="text-gray-700">Calculate your moving costs and timeline</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
                        <span className="text-gray-700">Consider your settlement preferences and availability</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
                        <span className="text-gray-700">Prepare for potential property inspections</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                    <h3 className="text-lg font-semibold mb-3 text-purple-800">Understanding Pre-Approval</h3>
                    <p className="text-gray-700 mb-3">
                      Pre-approval is an initial assessment by a lender indicating how much they may be willing to lend
                      you based on your financial situation.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Info className="h-4 w-4 text-purple-500 mr-2 mt-1" />
                        <span className="text-gray-700">It's not a guarantee of final loan approval</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-4 w-4 text-purple-500 mr-2 mt-1" />
                        <span className="text-gray-700">Pre-approvals typically last 3-6 months</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-4 w-4 text-purple-500 mr-2 mt-1" />
                        <span className="text-gray-700">Final approval will depend on the specific property</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <Alert className="bg-amber-50 border-amber-200">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800">Important Reminder</AlertTitle>
                  <AlertDescription className="text-amber-700">
                    If your circumstances change during the application process (e.g., change of employment, new debts,
                    or changes to your deposit amount), please notify us immediately as this may affect your
                    application.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Common questions about the pre-approval process and what happens next.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">How long does pre-approval take?</h3>
                  <p className="text-gray-600">
                    Pre-approval typically takes 3-5 business days, but can take longer depending on the complexity of
                    your application and the lender's current processing times.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">What happens after I get pre-approved?</h3>
                  <p className="text-gray-600">
                    Once pre-approved, you'll be presented with loan options from different lenders. You can then select
                    the best option for your needs and proceed to the final approval stage.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Can my pre-approval be declined?</h3>
                  <p className="text-gray-600">
                    Yes, pre-approval can be declined if the lender determines you don't meet their lending criteria.
                    Common reasons include insufficient income, poor credit history, or high existing debt levels.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">
                    Will I be notified if there are issues with my application?
                  </h3>
                  <p className="text-gray-600">
                    Yes, we'll contact you promptly if there are any issues or if additional information is needed to
                    process your application.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">How long is the pre-approval valid for?</h3>
                  <p className="text-gray-600">
                    Pre-approvals are typically valid for 3-6 months, depending on the lender. If your pre-approval
                    expires before you find a property, you can apply for an extension or reapply.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">
                    Can I make changes to my loan amount after pre-approval?
                  </h3>
                  <p className="text-gray-600">
                    Yes, but any significant changes to your loan amount or terms may require a reassessment of your
                    application, which could delay the process.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-6">
              <Button variant="outline" className="flex items-center" onClick={() => router.push("/contact-support")}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Have more questions? Contact our support team
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">
          Need to check on your application status later? You can always return to this page from your dashboard.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="outline" size="lg" onClick={() => router.push("/dashboard")}>
            Return to Dashboard
          </Button>
          <Button size="lg" onClick={() => router.push("/contact-support")}>
            Contact Support
          </Button>
          <Button size="lg" onClick={checkPreApprovalStatus} className="bg-green-600 hover:bg-green-700 text-white">
            <CheckCircle className="mr-2 h-5 w-5" />
            Check Pre-Approval Status
          </Button>
        </div>
      </div>
    </div>
  )
}
