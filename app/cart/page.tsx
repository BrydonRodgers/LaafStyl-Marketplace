'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import { useAuthStore } from '@/lib/store';
import { getCurrentUser } from '@/lib/auth';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clear, total } = useCartStore();
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    }
    checkUser();
  }, [setUser]);

  async function handleCheckout() {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      // Create order
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.id}`,
        },
        body: JSON.stringify({
          items,
          total_amount: total(),
        }),
      });

      if (res.ok) {
        const { data } = await res.json();
        clear();
        router.push(`/checkout/${data.id}`);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white p-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="text-2xl font-bold">
            LaafStyl
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link
              href="/products"
              className="text-blue-600 hover:underline font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold">Product</th>
                      <th className="px-6 py-3 text-center font-semibold">Qty</th>
                      <th className="px-6 py-3 text-right font-semibold">Price</th>
                      <th className="px-6 py-3 text-right font-semibold">Total</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.product_id} className="border-b">
                        <td className="px-6 py-3">{item.name}</td>
                        <td className="px-6 py-3 text-center">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.product_id,
                                parseInt(e.target.value)
                              )
                            }
                            className="w-16 border border-gray-300 rounded px-2 py-1 text-center"
                          />
                        </td>
                        <td className="px-6 py-3 text-right">R{item.price}</td>
                        <td className="px-6 py-3 text-right font-semibold">
                          R{(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <button
                            onClick={() => removeItem(item.product_id)}
                            className="text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="mb-6 space-y-3 border-b pb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>R{total().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>R0.00</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>R0.00</span>
                  </div>
                </div>

                <div className="mb-6 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">R{total().toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 mb-3"
                >
                  {loading ? 'Processing...' : 'Checkout'}
                </button>

                <Link
                  href="/products"
                  className="block text-center text-gray-600 hover:text-gray-900 py-3 rounded-lg border border-gray-300"
                >
                  Continue Shopping
                </Link>

                <div className="mt-6 pt-6 border-t">
                  <p className="text-xs text-gray-600">
                    Secure checkout powered by Stripe & Payfast
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
