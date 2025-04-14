import Link from "next/link"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Star } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 md:py-24">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Get the Best Home Loan & Keep the Broker Fee</h1>
              <p className="text-xl mb-8">
                Whether you're refinancing or buying your first home, our AI-powered platform helps you save. Banks bid
                for your loan, and you earn 0.5-2% cashback typically paid to brokers.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup">
                  <Button size="lg" variant="secondary" className="font-semibold">
                    Compare Home Loans
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white hover:text-blue-700 font-semibold"
                  >
                    Calculate Savings
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold mb-4">Save up to 2%</h2>
                <p className="text-lg mb-2">on your home loan</p>
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt="Happy lady with a laptop"
                  className="rounded-lg shadow-lg mt-4"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Save Big with Self-Refinancing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">$5,000</div>
                <p className="text-gray-700">Average Savings per annum on home loan repayments</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">0.5-2%</div>
                <p className="text-gray-700">Cashback Potential of loan amount, typically paid to brokers</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">2 Weeks</div>
                <p className="text-gray-700">Time Saved faster than traditional refinancing</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">$15,000+</div>
                <p className="text-gray-700">Total Savings average combined savings and cashback</p>
              </div>
            </div>
            <p className="text-center mt-8 text-lg">
              Join thousands of homeowners who have saved money, time, and earned cashback by self-refinancing with
              Refii.
            </p>
            <div className="flex justify-center mt-8 gap-4">
              <Link href="/signup">
                <Button size="lg" className="font-semibold">
                  Compare Home Loans
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline" className="font-semibold">
                  Calculate Cashback
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Refii */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Refii?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                "Banks bid for your loan",
                "For new buyers and refinancers",
                "AI-powered loan comparisons",
                "No commissions or hidden fees",
                "100% transparent process",
                "Save time with automation",
                "Tailored to your situation",
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-4">
                  <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                    <Check size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{feature}</h3>
                    <p className="text-gray-600">
                      {index === 0 &&
                        "Let lenders compete for your business, driving down rates and increasing cashback offers."}
                      {index === 1 &&
                        "Whether you're buying your first home or refinancing, our platform works for all home loan seekers."}
                      {index === 2 && "Get instant, unbiased recommendations tailored to your needs."}
                      {index === 3 && "Keep the savings that would typically go to brokers."}
                      {index === 4 && "See every step of your home loan journey clearly."}
                      {index === 5 && "Our AI does the heavy lifting, saving you weeks of research."}
                      {index === 6 && "Get personalized recommendations based on your unique financial profile."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI-Powered Comparison */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Compare Loans with AI</h2>
            <p className="text-center text-lg mb-12 max-w-3xl mx-auto">
              Our advanced AI technology compares loans from multiple lenders, ensuring you get the best deal with
              complete transparency and zero commissions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Unbiased Comparisons</h3>
                <p>
                  Our AI analyzes thousands of loan options without any preference, ensuring you get truly unbiased
                  recommendations.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Banks Bid For Your Loan</h3>
                <p>
                  Instead of you shopping around, lenders compete for your business, offering better rates and higher
                  cashback.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">No Hidden Fees</h3>
                <p>
                  We don't take commissions from lenders. Our recommendations are based solely on what's best for you.
                </p>
              </div>
            </div>
            <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm text-gray-600 max-w-3xl mx-auto">
              <p className="font-semibold mb-1">AI-Powered Comparison Disclaimer</p>
              <p>
                Our AI-powered loan comparison tool provides recommendations based on the information available to it.
                While we strive for accuracy, these recommendations should not be considered as financial advice. Always
                consult with a qualified financial professional before making any financial decisions.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Benefits of Self-Refinancing with Refii</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                "Lower monthly repayments",
                "First home buyer friendly",
                "Banks compete for your loan",
                "Shorten loan term",
                "Access home equity",
                "Earn 0.5-2% cashback",
                "Keep broker commissions",
                "Full control over process",
              ].map((benefit, index) => (
                <div key={index} className="bg-white p-5 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg mb-2">{benefit}</h3>
                  <p className="text-gray-600">
                    {index === 1 &&
                      "First-time buyers get the same benefits as refinancers, with guidance tailored to your needs."}
                    {index === 2 &&
                      "Let lenders bid against each other, driving down your interest rate and increasing benefits."}
                    {index === 5 && "Receive the commission typically paid to brokers directly as cashback."}
                    {index === 6 && "By handling your own loan, you keep the fees usually paid to middlemen."}
                    {index !== 1 &&
                      index !== 2 &&
                      index !== 5 &&
                      index !== 6 &&
                      "Enjoy the benefits of a better home loan while maintaining full control over the process."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Re-financing Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: 1,
                  title: "Complete Questions",
                  desc: "Answer a few simple questions about your financial situation and home loan needs.",
                },
                {
                  step: 2,
                  title: "Get Pre-Approval",
                  desc: "Receive your estimated pre-approval rate and potential savings instantly.",
                },
                {
                  step: 3,
                  title: "Banks Bid For Your Loan",
                  desc: "Multiple lenders compete for your business, offering their best rates and cashback.",
                },
                {
                  step: 4,
                  title: "Approve & Settlement",
                  desc: "Select your preferred offer and complete the settlement process.",
                },
              ].map((step) => (
                <div key={step.step} className="relative p-6 bg-blue-50 rounded-lg shadow-sm">
                  <div className="absolute -top-3 -left-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-lg mt-2 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Saved Thousands & Pocketed the Broker Fee!",
                  content:
                    "I was skeptical at first, but refinancing through Refii was a game-changer. Instead of going through a traditional broker, I used the platform, handled everything myself, and got the same great refinancing deal—except this time, I got to keep the broker's fee! It was straightforward, and I saved over $3,000. Highly recommend it if you like taking control of your finances!",
                  author: "Mark R.",
                },
                {
                  title: "Easy, Transparent, and More Money in My Pocket",
                  content:
                    "I've refinanced before, and each time, I knew brokers were making money off of my loan. When I found out I could do it myself and keep the fee, I jumped at the chance. The platform made it super easy, walking me through the process step by step. In the end, I saved money on my loan and got paid for doing what a broker would have done anyway. No brainer!",
                  author: "Sarah L.",
                },
                {
                  title: "Best Financial Decision I've Made This Year",
                  content:
                    "I never thought I'd be able to refinance my mortgage without a broker, but Refii made it so simple. The best part? I kept the commission fee that a broker would have taken. The whole process was seamless, and I ended up saving thousands on my refinance. If you're comfortable with a little paperwork and want to make money while refinancing, this is the way to go.",
                  author: "James P.",
                },
              ].map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{testimonial.title}</h3>
                  <p className="text-gray-600 mb-4">{testimonial.content}</p>
                  <p className="font-medium">{testimonial.author}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto">
              {[
                "What is self-re-financing?",
                "Can first-time home buyers use Refii?",
                "How does Refii's AI assistant work?",
                "Is Refii's loan comparison software accurate?",
              ].map((question, index) => (
                <div key={index} className="mb-4 border-b border-gray-200 pb-4">
                  <button className="flex justify-between items-center w-full text-left font-semibold text-lg">
                    {question}
                    <ArrowRight size={20} className="text-blue-600" />
                  </button>
                </div>
              ))}
              <div className="text-center mt-8">
                <Link href="/faq">
                  <Button variant="outline">View All FAQs</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get the Best Home Loan?</h2>
            <p className="text-xl mb-8">
              Join thousands of homeowners and first-time buyers who have already benefited from our platform.
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="font-semibold">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
