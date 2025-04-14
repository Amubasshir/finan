import { BotIcon as Robot, BarChart2, Brain, DollarSign } from "lucide-react"

export default function AIComparison() {
  const features = [
    {
      icon: BarChart2,
      title: "Unbiased Comparisons",
      description:
        "Our AI analyzes thousands of business loan options without any preference, ensuring you get truly unbiased recommendations.",
    },
    {
      icon: Brain,
      title: "Intelligent Matching",
      description:
        "The AI considers your unique business financial situation to find the loans that best match your needs and qualifications.",
    },
    {
      icon: DollarSign,
      title: "No Hidden Fees",
      description:
        "We don't take commissions from lenders. Our recommendations are based solely on what's best for your business.",
    },
  ]

  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Compare Business Loans with AI</h2>
        <div className="flex flex-col md:flex-row items-center mb-12">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <Robot className="w-48 h-48 mx-auto text-blue-600" />
          </div>
          <div className="md:w-1/2">
            <p className="text-lg mb-4">
              Our advanced AI technology compares business loans from multiple lenders, ensuring you get the best deal
              with complete transparency and zero commissions.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded">
          <h4 className="font-bold mb-2">AI-Powered Comparison Disclaimer</h4>
          <p>
            Our AI-powered business loan comparison tool provides recommendations based on the information available to
            it. While we strive for accuracy, these recommendations should not be considered as financial advice. Always
            consult with a qualified financial professional before making any financial decisions for your business.
          </p>
        </div>
      </div>
    </section>
  )
}
