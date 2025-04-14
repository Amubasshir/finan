export default function Stats() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Australian Businesses Choose finan</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We've helped thousands of Australian businesses save money and find the right loan solution.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2">$41,400</p>
            <p className="text-gray-600">Average Business Savings</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <p className="text-4xl font-bold text-green-600 mb-2">4.8/5</p>
            <p className="text-gray-600">Customer Satisfaction</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg text-center">
            <p className="text-4xl font-bold text-purple-600 mb-2">15+</p>
            <p className="text-gray-600">Lender Partners</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg text-center">
            <p className="text-4xl font-bold text-yellow-600 mb-2">3 Days</p>
            <p className="text-gray-600">Average Approval Time</p>
          </div>
        </div>
      </div>
    </section>
  )
}
