"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SendIcon } from "lucide-react"

export function AIRefinanceChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi there! I'm your AI Business Loan Assistant. How can I help you with your business loan today?",
    },
  ])
  const [input, setInput] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "I can help you understand the different types of business loans available for your situation.",
        "Based on your business profile, you might qualify for better rates than you currently have.",
        "Would you like me to explain how the refinancing process works for business loans?",
        "I can help you compare different loan options based on your specific business needs.",
        "Let me know if you have any specific questions about business loan features or requirements.",
      ]
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
      setMessages((prev) => [...prev, { role: "assistant", content: randomResponse }])
    }, 1000)
  }

  return (
    <div className="flex flex-col h-96">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-md">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white border border-gray-200 rounded-bl-none"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex items-center gap-2 mt-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about business loans..."
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <SendIcon className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
