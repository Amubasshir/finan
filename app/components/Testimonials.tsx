import { Star } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Thompson",
      business: "Thompson's Cafe",
      location: "Sydney, NSW",
      quote:
        "finan saved us over $45,000 on our business expansion loan. The process was incredibly simple, and we had approval within 48 hours. Highly recommended for any small business owner!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      business: "TechGrow Solutions",
      location: "Melbourne, VIC",
      quote:
        "As a tech startup, we needed flexible financing options. finan helped us compare multiple lenders and found us a line of credit that perfectly suited our growth plans. No broker fees saved us thousands.",
      rating: 5,
    },
    {
      name: "David Wilson",
      business: "Wilson Construction",
      location: "Brisbane, QLD",
      quote:
        "I was skeptical about using an online platform for our equipment financing, but finan exceeded all expectations. The AI recommendations were spot-on, and we secured a rate 1.2% lower than our bank offered.",
      rating: 4,
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Australian Business Owners Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied business owners who have found the perfect loan with finan.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-gray-600 text-sm">{testimonial.business}</p>
                <p className="text-gray-500 text-sm">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
