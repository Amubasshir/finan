"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "How does finan help me find the best business loan?",
      answer:
        "finan uses AI technology to compare business loans from over 15 lenders based on your specific business needs, financial situation, and goals. We analyze interest rates, fees, terms, and features to find the most suitable options for your business.",
    },
    {
      question: "Is finan free to use?",
      answer:
        "Yes, finan is completely free for businesses to use. We don't charge any fees for our comparison service or application assistance. We're paid by lenders when you successfully secure a loan through our platform.",
    },
    {
      question: "How much can I save with finan?",
      answer:
        "On average, businesses save $41,400 by using finan. This includes approximately $9,000 in broker fees and $32,400 in interest savings over the life of the loan by securing a better interest rate.",
    },
    {
      question: "What types of business loans can I compare?",
      answer:
        "finan helps you compare various business loan types including term loans, lines of credit, equipment finance, commercial mortgages, and specialized business loans. We work with lenders who cater to businesses of all sizes and industries.",
    },
    {
      question: "How long does the application process take?",
      answer:
        "With finan, you can complete your initial application in about 10 minutes. Pre-approval typically takes minutes to hours, while formal approval can be as quick as 3 days depending on the lender and the complexity of your business situation.",
    },
    {
      question: "What documents do I need to apply for a business loan?",
      answer:
        "Typically, you'll need business financial statements, tax returns, bank statements, business registration documents (ABN/ACN), and identification. Our platform will guide you through exactly what's needed based on your specific situation and chosen loan type.",
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get answers to common questions about business loans and how finan works.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full text-left p-4 bg-white rounded-lg shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="font-semibold text-lg">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-blue-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
              </button>
              {openIndex === index && (
                <div className="p-4 bg-white border-t border-gray-100 rounded-b-lg">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
