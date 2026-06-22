export default function SuccessPage() {
  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Payment Successful</h1>
      <p className="text-lg mb-8">Thank you for your order. You will receive a confirmation email shortly.</p>
      <a href="/" className="bg-blue-600 text-white px-8 py-3 rounded">
        Continue Shopping
      </a>
    </div>
  )
}
