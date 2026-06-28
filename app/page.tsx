'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/supabase';
import { useAuthStore, useCartStore } from '@/lib/store';
import { getCurrentUser } from '@/lib/auth';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useAuthStore();
  const { items: cartItems } = useCartStore();

  useEffect(() => {
    async function init() {
      // Fetch products
      try {
        const res = await fetch('/api/products');
        const { data } = await res.json();
        setProducts(data || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
      }

      // Check if user is logged in (non-blocking)
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth error:', error);
      }

      setLoading(false);
    }

    init();
  }, [setUser]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            LaafStyl
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/products" className="hover:text-gray-300">
              Shop
            </Link>
            <Link href="/services" className="hover:text-gray-300">
              Services
            </Link>
            <Link href="/cart" className="hover:text-gray-300 relative">
              Cart
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link href="/admin" className="hover:text-gray-300">
                    Admin
                  </Link>
                )}
                <Link href="/account" className="hover:text-gray-300">
                  {user.email}
                </Link>
              </>
            ) : (
              <Link href="/login" className="hover:text-gray-300">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center text-white py-28 px-4"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.7), rgba(15,23,42,0.75)), url('https://images.pexels.com/photos/27165073/pexels-photo-27165073.jpeg?auto=compress&cs=tinysrgb&w=1600')",
        }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 drop-shadow">Welcome to LaafStyl</h1>
          <p className="text-xl text-gray-200 mb-8 drop-shadow">
            Premium grooming products and services for the modern man
          </p>
          <Link
            href="/products"
            className="bg-white text-gray-900 px-8 py-3 rounded font-semibold hover:bg-gray-100 shadow-lg"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold mb-12">Featured Products</h2>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No products available yet</p>
            {user?.role === 'admin' && (
              <Link href="/admin" className="text-blue-600 hover:underline">
                Go to Admin Dashboard
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                {product.image_url && (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  {product.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      R{product.price}
                    </span>
                    {product.stock_quantity > 0 ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        In Stock
                      </span>
                    ) : (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Premium Services</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Book professional grooming services from our expert stylists
          </p>
          <Link
            href="/services"
            className="bg-blue-600 text-white px-8 py-3 rounded font-semibold hover:bg-blue-700"
          >
            View Services
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            &copy; 2026 LaafStyl Marketplace. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
