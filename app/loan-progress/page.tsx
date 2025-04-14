"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileUploader } from "@/components/FileUploader"

export default function LoanProgress() {
  const [progress, setProgress] = useState(30)
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([
    {
      sender: "System",
      content: "Welcome to your loan application progress page. Our team will keep you updated here.",
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { sender: "You", content: newMessage }])
      setNewMessage("")
      // In a real application, you would send this message to your backend
    }
  }

  const handleSignatureUpload = (file: File) => {
    console.log("Signature uploaded:", file.name)
    // In a real application, you would process the signature here
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Loan Application Progress</h1>

      <Card>
        <CardHeader>
          <CardTitle>Application Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="w-full" />
          <p className="mt-2 text-center">{progress}% Complete</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Communication</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] mb-4">
            {messages.map((message, index) => (
              <div key={index} className={`mb-2 ${message.sender === "You" ? "text-right" : ""}`}>
                <span className="font-bold">{message.sender}: </span>
                {message.content}
              </div>
            ))}
          </ScrollArea>
          <div className="flex space-x-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Signature</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">Please upload your digital signature:</p>
          <FileUploader
            onFileSelect={handleSignatureUpload}
            acceptedFileTypes=".jpg,.png,.pdf"
            maxFileSize={5 * 1024 * 1024} // 5MB
          />
        </CardContent>
      </Card>

      <div className="text-center">
        <Button>Review Application</Button>
      </div>
    </div>
  )
}
