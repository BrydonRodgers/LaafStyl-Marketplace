import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ data: MOCK_PRODUCTS });
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin auth (simplified - in production use JWT verification)
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, price, image_url, category, stock_quantity } = body;

    if (!name || !price) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price' },
        { status: 400 }
      );
    }

    // For now, return mock response (to be connected to Supabase later)
    const newProduct = {
      id: MOCK_PRODUCTS.length + 1,
      name,
      description,
      price: parseFloat(price),
      image_url,
      category,
      stock_quantity: stock_quantity || 0,
      active: true,
    };

    return NextResponse.json({ data: newProduct }, { status: 201 });
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
