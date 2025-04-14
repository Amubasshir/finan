import { ClipboardList, Search, FileText, CheckCircle } from "lucide-react"

export default function Process() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Simple 4-Step Process</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting the right business loan with finan is quick and straightforward.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
              <ClipboardList className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">1. Share Your Business Details</h3>
            <p className="text-gray-600">
              Tell us about your business, loan needs, and financial situation in our simple online form.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">2. Compare Options</h3>
            <p className="text-gray-600">
              Our AI instantly compares loans from multiple lenders to find the best matches for your business.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-4">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">3. Submit Documents</h3>
            <p className="text-gray-600">
              Upload your business documents securely through our platform for verification.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">4. Get Approved</h3>
            <p className="text-gray-600">
              Receive your loan approval and have funds deposited directly to your business account.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
