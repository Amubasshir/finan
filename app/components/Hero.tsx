import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
      <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          Refinance Your Home Loan and <span className="text-blue-600">Save on Broker Fees</span>
        </h1>
        <p className="text-xl mb-8 text-gray-700">
          Self-refinance with AI-powered comparisons and tools. Save up to 1-3% in broker commissions.
        </p>
        <div className="space-x-4">
          <Button size="lg" asChild>
            <Link href="/signup">
              Compare Home Loans <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/signup">Calculate Savings</Link>
          </Button>
        </div>
      </div>
      <div className="md:w-1/2 relative">
        <Image
          src="/placeholder.svg?height=400&width=600"
          alt="Homeowner receiving savings"
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
        />
        <div className="absolute -bottom-4 -left-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
          <p className="text-2xl font-bold">Save up to 3%</p>
          <p>on your home loan</p>
        </div>
      </div>
    </section>
  )
}
