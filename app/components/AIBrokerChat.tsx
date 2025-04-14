"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  role: "user" | "assistant"
  content: string
}

const promptSuggestions = [
  "What's the difference between fixed and variable rates?",
  "How do offset accounts work?",
  "Can you explain comparison rates?",
  "What fees should I watch out for?",
  "How does refinancing affect my credit score?",
]

export function AIBrokerChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI Broker Assistant. How can I help you with your loan comparison today? Feel free to ask me anything!",
    },
  ])
  const [input, setInput] = useState("")

  const handleSendMessage = (message: string = input) => {
    if (message.trim()) {
      setMessages((prev) => [...prev, { role: "user", content: message }])
      // Here you would typically send the message to your AI backend and get a response
      // For now, we'll just echo the message back with a generic response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Thank you for your question about "${message}". As an AI Broker Assistant, I can provide general information about loans and the comparison process. However, for personalized advice, it's best to consult with a human financial advisor. Is there anything specific about the loan options you'd like to know more about?`,
          },
        ])
      }, 1000)
      setInput("")
    }
  }

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-white">AI Broker Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden flex flex-col">
        <ScrollArea className="flex-grow pr-4 mb-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}>
              {message.role === "assistant" && (
                <Avatar className="mr-2">
                  <AvatarImage src="/ai-avatar.png" alt="AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`p-3 rounded-lg max-w-[80%] ${
                  message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-700 text-white"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap gap-2">
            {promptSuggestions.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSendMessage(prompt)}
                className="text-white border-white hover:bg-gray-700"
              >
                {prompt}
              </Button>
            ))}
          </div>
          <div className="flex w-full space-x-2">
            <Input
              className="flex-grow bg-gray-700 text-white border-gray-600 placeholder-gray-400"
              type="text"
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button onClick={() => handleSendMessage()} className="bg-blue-500 hover:bg-blue-600 text-white">
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
