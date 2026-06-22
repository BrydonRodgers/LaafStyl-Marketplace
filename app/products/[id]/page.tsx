'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/supabase';
import { useCartStore } from '@/lib/store';

export default function ProductDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const res = await fetch(`${apiUrl}/api/products/${params.id}`);
        const { data } = await res.json();
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params.id]);

  function handleAddToCart() {
    if (product) {
      addItem({
        product_id: product.id,
        quantity,
        price: product.price,
        name: product.name,
      });
      router.push('/cart');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Product not found</p>
          <Link href="/products" className="text-blue-600 hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white p-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="hover:text-gray-300">
            &larr; Back
          </Link>
        </div>
      </nav>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div>
            {product.image_url ? (
              <div className="bg-gray-200 rounded-lg overflow-hidden h-96">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

            {product.category && (
              <p className="text-gray-600 mb-4">
                Category: <span className="font-semibold">{product.category}</span>
              </p>
            )}

            <div className="text-4xl font-bold text-blue-600 mb-6">
              R{product.price}
            </div>

            {product.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            <div className="mb-8">
              <p className="text-sm text-gray-600 mb-4">
                {product.stock_quantity > 0 ? (
                  <span className="text-green-600 font-semibold">
                    In Stock ({product.stock_quantity} available)
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">Out of Stock</span>
                )}
              </p>

              {product.stock_quantity > 0 && (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <label className="font-semibold">Quantity:</label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="border border-gray-300 rounded px-3 py-2"
                    >
                      {[...Array(Math.min(product.stock_quantity, 10))].map(
                        (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mb-4"
                  >
                    Add to Cart
                  </button>
                </>
              )}

              <Link
                href="/products"
                className="block text-center text-gray-600 hover:text-gray-900 py-3 rounded-lg border border-gray-300"
              >
                Continue Shopping
              </Link>
            </div>

            {/* Product Meta */}
            <div className="border-t pt-8">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 font-semibold">SKU</p>
                  <p className="text-gray-900 font-mono">{product.id.slice(0, 8)}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Availability</p>
                  <p className="text-gray-900">
                    {product.stock_quantity > 0 ? 'Ships in 1-2 days' : 'Not available'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
