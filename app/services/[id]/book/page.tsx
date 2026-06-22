'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Service, Booking } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';
import { getCurrentUser } from '@/lib/auth';
import { format, addDays } from 'date-fns';

export default function BookServicePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function init() {
      // Check auth
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      // Fetch service
      try {
        const res = await fetch(`/api/services/${params.id}`);
        const { data } = await res.json();
        setService(data);

        // Set default date to tomorrow
        const tomorrow = addDays(new Date(), 1);
        setBookingDate(format(tomorrow, 'yyyy-MM-dd'));
      } catch (error) {
        console.error('Failed to fetch service:', error);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [params.id, setUser, router]);

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault();

    if (!user || !service) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.id}`,
        },
        body: JSON.stringify({
          service_id: service.id,
          booking_date: bookingDate,
          booking_time: bookingTime,
          notes,
        }),
      });

      if (res.ok) {
        const { data } = await res.json();
        router.push(`/bookings/${data.id}/confirmation`);
      }
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!service || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Service not found or not logged in</p>
          <Link href="/services" className="text-blue-600 hover:underline">
            Back to Services
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
          <Link href="/services" className="hover:text-gray-300">
            &larr; Back to Services
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h1 className="text-3xl font-bold mb-2">Book: {service.name}</h1>
        <p className="text-gray-600 mb-8">
          Duration: {service.duration_minutes} minutes | Price: R{service.price}
        </p>

        <form onSubmit={handleBooking} className="bg-gray-50 rounded-lg p-8">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Date *
            </label>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Time *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                '09:00',
                '09:30',
                '10:00',
                '10:30',
                '11:00',
                '14:00',
                '14:30',
                '15:00',
                '15:30',
                '16:00',
              ].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setBookingTime(time)}
                  className={`py-2 px-3 rounded font-semibold transition ${
                    bookingTime === time
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 hover:border-blue-600'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            {!bookingTime && (
              <p className="text-red-600 text-sm mt-2">Please select a time</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Special Requests (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests or preferences?"
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
              rows={4}
            />
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
            <h2 className="font-semibold mb-4">Booking Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Service</span>
                <span className="font-semibold">{service.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="font-semibold">
                  {bookingDate ? format(new Date(bookingDate), 'MMMM dd, yyyy') : 'Not selected'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time</span>
                <span className="font-semibold">{bookingTime || 'Not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-semibold">{service.duration_minutes} minutes</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between">
                <span className="text-gray-600">Total</span>
                <span className="text-xl font-bold text-blue-600">R{service.price}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !bookingTime}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Processing...' : 'Continue to Payment'}
          </button>

          <p className="text-xs text-gray-600 text-center mt-4">
            Payment required to confirm booking
          </p>
        </form>
      </div>
    </div>
  );
}
