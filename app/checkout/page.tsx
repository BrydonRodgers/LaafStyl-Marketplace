'use client'
import { useCartStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items)
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleStripe = async () => {
    setLoading(true)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const res = await fetch(`${apiUrl}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: items, email }),
    })
    const { sessionId } = await res.json()
    // Redirect to Stripe checkout (needs stripe.js setup)
    window.location.href = `https://checkout.stripe.com/pay/${sessionId}`
    setLoading(false)
  }

  const handlePayfast = async () => {
    setLoading(true)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const res = await fetch(`${apiUrl}/api/payfast/redirect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: items, orderId: Date.now(), email }),
    })
    const { redirectUrl } = await res.json()
    window.location.href = redirectUrl
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="bg-gray-50 p-6 rounded mb-8">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        {items.map(item => (
          <div key={item.product_id} className="flex justify-between py-2 border-b">
            <span>{item.name} x{item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="text-xl font-bold pt-4 mt-4 border-t">
          Total: ${total.toFixed(2)}
        </div>
      </div>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full p-3 border rounded mb-4"
      />

      <div className="space-y-4">
        <button
          onClick={handleStripe}
          disabled={loading || !email}
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Pay with Stripe'}
        </button>
        <button
          onClick={handlePayfast}
          disabled={loading || !email}
          className="w-full bg-orange-600 text-white py-3 rounded font-semibold hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Pay with Payfast'}
        </button>
      </div>
    </div>
  )
}
