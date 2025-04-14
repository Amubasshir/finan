"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  role: "user" | "assistant"
  content: string
}

const predefinedQuestions = [
  "What's the difference between fixed and variable rates?",
  "How does an offset account work?",
  "What fees should I watch out for when refinancing?",
  "How often can I refinance my home loan?",
  "What documents do I need for refinancing?",
]

export function AIChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your AI refinancing assistant. How can I help you today?" },
  ])
  const [input, setInput] = useState("")

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { role: "user", content: input }])
      // Here you would typically send the message to your AI backend and get a response
      // For now, we'll just echo the message back
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `You asked about: ${input}. Here's a general response about refinancing: Refinancing can potentially lower your interest rate, reduce your monthly payments, or allow you to access equity in your home. However, it's important to consider the costs involved, such as application fees and potential break costs from your current loan. Always compare the long-term benefits with the short-term costs before deciding to refinance.`,
          },
        ])
      }, 1000)
      setInput("")
    }
  }

  const handleQuickQuestion = (question: string) => {
    setMessages((prev) => [...prev, { role: "user", content: question }])
    // Here you would typically send the message to your AI backend and get a response
    // For now, we'll just provide a generic response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `You asked: ${question}. This is a placeholder response about refinancing. In a real application, this would be a detailed, tailored answer to your specific question about the refinancing process.`,
        },
      ])
    }, 1000)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Chat with Your AI Refinancing Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
              <span
                className={`inline-block p-2 rounded-lg ${
                  message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                {message.content}
              </span>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="flex space-x-2 w-full">
          <Input
            type="text"
            placeholder="Ask about refinancing..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {predefinedQuestions.map((question, index) => (
            <Button key={index} variant="outline" size="sm" onClick={() => handleQuickQuestion(question)}>
              {question}
            </Button>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}
