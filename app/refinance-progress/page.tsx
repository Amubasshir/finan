"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileUploader } from "@/components/FileUploader"

// This would typically come from your backend
const mockApplicationStatus = {
  status: "In Progress",
  progress: 60,
  completed: false,
  steps: [
    { name: "Application Received", completed: true },
    { name: "Document Verification", completed: true },
    { name: "Lender Negotiation", completed: false },
    { name: "Final Approval", completed: false },
    { name: "Loan Finalization", completed: false },
  ],
}

const mockDocumentsToSign = [
  { id: 1, name: "Loan Agreement", status: "Pending", type: "Digital" },
  { id: 2, name: "Property Valuation Consent", status: "Pending", type: "Upload" },
  { id: 3, name: "Privacy Statement", status: "Signed", type: "Digital" },
  { id: 4, name: "Mortgage Transfer", status: "Pending", type: "Download" },
]

export default function RefinanceProgress() {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [chat, setChat] = useState<{ sender: string; message: string }[]>([
    { sender: "Team", message: "Hello! Your application has been received. We'll update you on the progress here." },
  ])

  const sendMessage = () => {
    if (message.trim()) {
      setChat([...chat, { sender: "You", message }])
      setMessage("")
      // In a real application, you'd send this message to your backend
      setTimeout(() => {
        setChat((prev) => [
          ...prev,
          { sender: "Team", message: "Thank you for your message. We'll get back to you shortly." },
        ])
      }, 1000)
    }
  }

  useEffect(() => {
    if (mockApplicationStatus.completed) {
      router.push("/refinance-completion")
    }
  }, [mockApplicationStatus.completed])

  const handleSignDocument = (documentId: number, signatureType: string) => {
    // In a real application, this would trigger the appropriate signing process
    console.log(`Signing document ${documentId} with ${signatureType} signature`)
  }

  const handleFileUpload = (documentId: number, file: File) => {
    // In a real application, this would handle the file upload
    console.log(`Uploading signed document ${documentId}: ${file.name}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Refinance Application Progress</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Status:</span>
                <Badge variant={mockApplicationStatus.status === "In Progress" ? "default" : "success"}>
                  {mockApplicationStatus.status}
                </Badge>
              </div>
              <Progress
                value={mockApplicationStatus.completed ? 100 : mockApplicationStatus.progress}
                className="w-full"
              />
              <ul className="space-y-2">
                {mockApplicationStatus.steps.map((step, index) => (
                  <li key={index} className="flex items-center">
                    <span className={`mr-2 ${step.completed ? "text-green-500" : "text-gray-400"}`}>
                      {step.completed ? "✓" : "○"}
                    </span>
                    <span className={step.completed ? "text-gray-900" : "text-gray-500"}>{step.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Communication with Our Team</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] mb-4">
              {chat.map((msg, index) => (
                <div key={index} className={`mb-2 ${msg.sender === "You" ? "text-right" : ""}`}>
                  <span className="font-semibold">{msg.sender}: </span>
                  <span>{msg.message}</span>
                </div>
              ))}
            </ScrollArea>
            <div className="flex space-x-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-grow"
              />
              <Button onClick={sendMessage}>Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Documents to Sign</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Signature Type</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDocumentsToSign.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>{doc.status}</TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>
                    {doc.status === "Pending" && (
                      <>
                        {doc.type === "Digital" && (
                          <Button onClick={() => handleSignDocument(doc.id, "digital")}>Sign Digitally</Button>
                        )}
                        {doc.type === "Upload" && (
                          <FileUploader
                            onFileSelect={(file) => handleFileUpload(doc.id, file)}
                            acceptedFileTypes=".pdf,.jpg,.png"
                            maxFileSize={5 * 1024 * 1024} // 5MB
                          />
                        )}
                        {doc.type === "Download" && (
                          <Button asChild>
                            <a href={`/api/documents/${doc.id}/download`} download>
                              Download & Sign
                            </a>
                          </Button>
                        )}
                      </>
                    )}
                    {doc.status === "Signed" && <span className="text-green-500">Completed</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
