import { CheckCircle, Search, DollarSign, Clock, Shield, Award } from "lucide-react"

export default function Features() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How finan Works for Your Business</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform makes finding and applying for business loans simple and transparent.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-blue-600 mb-4">
              <Search className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold mb-2">Compare Business Loans</h3>
            <p className="text-gray-600 mb-4">
              Our AI compares loans from over 15 lenders to find the best rates and terms for your business needs.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Side-by-side comparison of rates and features</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Personalized to your business profile</span>
              </li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-green-600 mb-4">
              <DollarSign className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold mb-2">Save on Fees</h3>
            <p className="text-gray-600 mb-4">No broker fees or hidden costs. We're paid by lenders, not by you.</p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Average savings of $9,000 in broker fees</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Lower interest rates save $32,400 on average</span>
              </li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-purple-600 mb-4">
              <Clock className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold mb-2">Fast Approval</h3>
            <p className="text-gray-600 mb-4">
              Get pre-approved in minutes and receive formal approval in as little as 3 days.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Streamlined application process</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Digital document submission</span>
              </li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-yellow-600 mb-4">
              <Shield className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold mb-2">Secure & Confidential</h3>
            <p className="text-gray-600 mb-4">
              Your business information is protected with bank-level security and encryption.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>256-bit encryption for all data</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Strict privacy policy</span>
              </li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-red-600 mb-4">
              <Award className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold mb-2">Expert Support</h3>
            <p className="text-gray-600 mb-4">
              Get guidance from our team of business loan specialists whenever you need it.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Personalized advice for your business</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Support throughout the application process</span>
              </li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-blue-600 mb-4">
              <Search className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI-Powered Recommendations</h3>
            <p className="text-gray-600 mb-4">
              Our AI analyzes your business needs to recommend the most suitable loan structures.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Tailored to your business cash flow</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Optimized for your growth plans</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
