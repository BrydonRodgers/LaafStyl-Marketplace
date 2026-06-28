import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Mock services - replace with Supabase later
const MOCK_SERVICES = [
  {
    id: 1,
    name: 'Professional Beard Trim',
    description: 'Expert beard shaping and styling. Perfect for maintaining that sharp look.',
    price: 29.99,
    duration_minutes: 30,
    image_url: 'https://images.pexels.com/photos/5584461/pexels-photo-5584461.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
    active: true,
  },
  {
    id: 2,
    name: 'Full Grooming Service',
    description: 'Complete grooming package: haircut, beard trim, facial, and styling.',
    price: 79.99,
    duration_minutes: 90,
    image_url: 'https://images.pexels.com/photos/27165073/pexels-photo-27165073.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
    active: true,
  },
  {
    id: 3,
    name: 'Hair Treatment & Spa',
    description: 'Relaxing scalp massage with premium hair treatment oils.',
    price: 49.99,
    duration_minutes: 45,
    image_url: 'https://images.pexels.com/photos/8460603/pexels-photo-8460603.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
    active: true,
  },
  {
    id: 4,
    name: 'Catering Package (Party of 10)',
    description: 'Gourmet catering service with variety of platters and beverages.',
    price: 199.99,
    duration_minutes: 120,
    image_url: 'https://images.pexels.com/photos/11893745/pexels-photo-11893745.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
    active: true,
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    // Try Supabase first, fall back to mock data
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('id', resolvedParams.id)
          .single();

        if (!error && data) {
          return NextResponse.json({ data });
        }
      } catch (supabaseError) {
        console.warn('Supabase query failed, using mock data:', supabaseError);
      }
    }

    // Fall back to mock data
    const service = MOCK_SERVICES.find(s => s.id === parseInt(resolvedParams.id));
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ data: service });
  } catch (error) {
    console.error('GET /api/services/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, price, duration_minutes, image_url, active } = body;

    const { data, error } = await supabase
      .from('services')
      .update({
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(duration_minutes && { duration_minutes: parseInt(duration_minutes) }),
        ...(image_url && { image_url }),
        ...(active !== undefined && { active }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', resolvedParams.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error('PUT /api/services/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('services')
      .update({ active: false })
      .eq('id', resolvedParams.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/services/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
