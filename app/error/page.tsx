export default function ErrorPage() {
  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Payment Failed</h1>
      <p className="text-lg mb-8">Your payment could not be processed. Please try again.</p>
      <a href="/checkout" className="bg-blue-600 text-white px-8 py-3 rounded">
        Back to Checkout
      </a>
    </div>
  )
}
