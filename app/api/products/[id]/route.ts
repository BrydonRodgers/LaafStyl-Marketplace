import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Mock products - replace with Supabase later
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: '5-in-1 Grooming Kit',
    description: 'Professional grooming tool with multiple attachments. Includes beard trimmer, nose hair clipper, and more.',
    price: 49.99,
    image_url: 'https://images.pexels.com/photos/13809242/pexels-photo-13809242.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
    category: 'Grooming',
    stock_quantity: 50,
    active: true,
  },
  {
    id: 2,
    name: 'Premium Beard Kit',
    description: 'Complete beard care solution with beard oil, balm, and brush.',
    price: 34.99,
    image_url: 'https://images.pexels.com/photos/7397453/pexels-photo-7397453.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
    category: 'Grooming',
    stock_quantity: 75,
    active: true,
  },
  {
    id: 3,
    name: 'Travel Grooming Bag',
    description: 'Compact organizer perfect for traveling. Fits all your grooming essentials.',
    price: 39.99,
    image_url: 'https://images.pexels.com/photos/18761052/pexels-photo-18761052.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
    category: 'Accessories',
    stock_quantity: 30,
    active: true,
  },
  {
    id: 4,
    name: 'Replacement Heads Pack',
    description: 'Compatible replacement heads for most grooming tools. Pack of 5.',
    price: 14.99,
    image_url: 'https://images.pexels.com/photos/20728286/pexels-photo-20728286.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
    category: 'Accessories',
    stock_quantity: 100,
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
          .from('products')
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
    const product = MOCK_PRODUCTS.find(p => p.id === parseInt(resolvedParams.id));
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ data: product });
  } catch (error) {
    console.error('GET /api/products/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
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
    const { name, description, price, image_url, category, stock_quantity, active } = body;

    const { data, error } = await supabase
      .from('products')
      .update({
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(image_url && { image_url }),
        ...(category && { category }),
        ...(stock_quantity !== undefined && { stock_quantity }),
        ...(active !== undefined && { active }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', resolvedParams.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error('PUT /api/products/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
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
      .from('products')
      .update({ active: false })
      .eq('id', resolvedParams.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
