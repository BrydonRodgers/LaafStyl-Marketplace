import { NextRequest, NextResponse } from 'next/server';

// Mock services - replace with Supabase later
const MOCK_SERVICES = [
  {
    id: 1,
    name: 'Professional Beard Trim',
    description: 'Expert beard shaping and styling. Perfect for maintaining that sharp look.',
    price: 29.99,
    duration_minutes: 30,
    image_url: 'https://images.unsplash.com/photo-1585747860715-cd4628902d4a?w=500&h=500&fit=crop',
    active: true,
  },
  {
    id: 2,
    name: 'Full Grooming Service',
    description: 'Complete grooming package: haircut, beard trim, facial, and styling.',
    price: 79.99,
    duration_minutes: 90,
    image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop',
    active: true,
  },
  {
    id: 3,
    name: 'Hair Treatment & Spa',
    description: 'Relaxing scalp massage with premium hair treatment oils.',
    price: 49.99,
    duration_minutes: 45,
    image_url: 'https://images.unsplash.com/photo-1552526881-721267d213f9?w=500&h=500&fit=crop',
    active: true,
  },
  {
    id: 4,
    name: 'Catering Package (Party of 10)',
    description: 'Gourmet catering service with variety of platters and beverages.',
    price: 199.99,
    duration_minutes: 120,
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561021?w=500&h=500&fit=crop',
    active: true,
  },
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ data: MOCK_SERVICES });
  } catch (error) {
    console.error('GET /api/services error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, price, duration_minutes, image_url } = body;

    if (!name || !price || !duration_minutes) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price, duration_minutes' },
        { status: 400 }
      );
    }

    // For now, return mock response (to be connected to Supabase later)
    const newService = {
      id: MOCK_SERVICES.length + 1,
      name,
      description,
      price: parseFloat(price),
      duration_minutes: parseInt(duration_minutes),
      image_url,
      active: true,
    };

    return NextResponse.json({ data: newService }, { status: 201 });
  } catch (error) {
    console.error('POST /api/services error:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
