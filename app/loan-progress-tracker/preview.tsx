"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, FileSignature, MessageSquare } from "lucide-react"

// This is a simplified preview component to show how the page looks
export default function LoanProgressTrackerPreview() {
  const [activeTab, setActiveTab] = useState("progress")

  // Sample data for the progress stages
  const stages = [
    {
      name: "Application Submitted",
      completed: true,
      description: "Your application and documents have been received and are being prepared for review.",
    },
    {
      name: "Document Verification",
      completed: true,
      description: "Your documents are being verified for accuracy and completeness.",
    },
    {
      name: "Lender Review",
      completed: false,
      description: "The lender is reviewing your application, credit history, and financial situation.",
    },
    {
      name: "Property Valuation",
      completed: false,
      description: "A valuation of your property is being conducted to determine its current market value.",
    },
    {
      name: "Final Approval",
      completed: false,
      description: "Final assessment and approval of your refinance application.",
    },
    {
      name: "Loan Documentation",
      completed: false,
      description: "Preparation and signing of loan documents and contracts.",
    },
    {
      name: "Settlement",
      completed: false,
      description: "Final settlement process where your old loan is paid out and new loan is established.",
    },
  ]

  // Calculate progress percentage
  const progressPercentage = Math.round((stages.filter((stage) => stage.completed).length / stages.length) * 100)

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Refinance Application Progress</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="progress">Application Status</TabsTrigger>
          <TabsTrigger value="documents">Documents to Sign</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
                Application Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Status:</span>
                  <Badge>In Progress</Badge>
                </div>
                <Progress value={progressPercentage} className="w-full h-6" />
                <div className="text-center text-sm font-medium">{progressPercentage}% Complete</div>
                <p className="font-semibold text-lg">Current Stage: Lender Review</p>

                <div className="mt-8 space-y-6">
                  {stages.map((stage, index) => (
                    <div key={index} className="flex">
                      <div className="flex-shrink-0 flex flex-col items-center mr-4">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            stage.completed
                              ? "bg-green-100 text-green-600"
                              : index === stages.findIndex((s) => !s.completed)
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {stage.completed ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : index === stages.findIndex((s) => !s.completed) ? (
                            <Clock className="h-6 w-6" />
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </div>
                        {index < stages.length - 1 && (
                          <div className={`w-0.5 h-16 ${stage.completed ? "bg-green-200" : "bg-gray-200"}`}></div>
                        )}
                      </div>
                      <div className="pt-1 pb-8">
                        <h3
                          className={`text-xl font-semibold mb-2 ${
                            stage.completed
                              ? "text-green-700"
                              : index === stages.findIndex((s) => !s.completed)
                                ? "text-blue-700"
                                : "text-gray-500"
                          }`}
                        >
                          {stage.name}
                        </h3>
                        <p className="text-gray-600">{stage.description}</p>
                        {stage.completed && (
                          <span className="inline-block mt-2 text-sm text-green-600 font-medium">Completed</span>
                        )}
                        {!stage.completed && index === stages.findIndex((s) => !s.completed) && (
                          <span className="inline-block mt-2 text-sm text-blue-600 font-medium">In Progress</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileSignature className="mr-2 h-6 w-6 text-purple-500" />
                Documents Requiring Your Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 bg-gray-100 rounded-lg">
                <h2 className="text-xl font-semibold">Documents Tab</h2>
                <p className="mt-2">This tab shows a table of documents that need to be signed or uploaded.</p>
                <p className="mt-1">Each document has actions like "Sign Digitally" or "Upload".</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-6 w-6 text-blue-500" />
                Communication with Our Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 bg-gray-100 rounded-lg">
                <h2 className="text-xl font-semibold">Communication Tab</h2>
                <p className="mt-2">This tab shows a chat interface to communicate with the loan team.</p>
                <p className="mt-1">You can send messages and receive updates about your application.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
