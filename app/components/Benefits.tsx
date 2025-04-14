import { CheckCircle, Clock, DollarSign, Shield, Award, Zap } from "lucide-react"

export function Benefits() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Benefits for Your Business</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how finan can help your business secure better financing and save money.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="text-blue-600 mb-4">
              <DollarSign className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold mb-2">Lower Interest Rates</h3>
            <p className="text-gray-700 mb-4">
              Access competitive rates from multiple lenders, potentially saving thousands over the life of your
              business loan.
            </p>
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Average savings of $32,400</span>
            </div>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="text-green-600 mb-4">
              <Zap className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Broker Fees</h3>
            <p className="text-gray-700 mb-4">
              Unlike traditional brokers who charge 1-2% of your loan amount, our service is completely free for
              businesses.
            </p>
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Save up to $9,000 in fees</span>
            </div>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="text-purple-600 mb-4">
              <Clock className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold mb-2">Fast Approval</h3>
            <p className="text-gray-700 mb-4">
              Our streamlined process helps your business get funding faster with pre-approval in minutes.
            </p>
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Average approval in 3 days</span>
            </div>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg">
            <div className="text-yellow-600 mb-4">
              <Shield className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold mb-2">Multiple Lender Access</h3>
            <p className="text-gray-700 mb-4">
              Compare options from over 15 lenders with a single application, saving your business time and effort.
            </p>
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">One application, many options</span>
            </div>
          </div>
          <div className="bg-red-50 p-6 rounded-lg">
            <div className="text-red-600 mb-4">
              <Award className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold mb-2">Expert Support</h3>
            <p className="text-gray-700 mb-4">
              Get guidance from business loan specialists who understand your industry and financial needs.
            </p>
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Personalized business advice</span>
            </div>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="text-blue-600 mb-4">
              <Zap className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI-Powered Matching</h3>
            <p className="text-gray-700 mb-4">
              Our AI technology matches your business with the most suitable loan products based on your specific needs.
            </p>
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Tailored to your business</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Benefits
