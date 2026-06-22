# LaafStyl Marketplace - Setup Guide

## Phase 1: Database & Auth Setup (Day 1-2)

### 1. Create Supabase Project

1. Go to https://supabase.com and create a new project
2. Choose the free tier
3. Database region: Johannesburg (af-south-1) or nearest
4. Save your credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 2. Apply Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Create new query and copy contents of `db/migrations/001_init_schema.sql`
3. Run the query
4. Verify tables created: `users`, `products`, `services`, `bookings`, `orders`, `payments`, `admin_settings`

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Fill in:
- Supabase credentials
- Stripe publishable key (for testing: use Stripe test keys)
- Payfast merchant ID (already have: 33811799)

### 4. Install Dependencies

```bash
npm install
```

### 5. Test Database Connection

```bash
npm run dev
```

Open http://localhost:3000/api/products - should return empty array

## Phase 2: Authentication (Day 2)

### 1. Create Admin User

In Supabase dashboard:
1. Go to **Authentication** > **Users**
2. Click **Invite**
3. Send invite to admin email (or create manually)
4. Set password
5. Verify the user appears in `users` table with `role='admin'`

### 2. Test Auth Flow

- Navigate to `/login`
- Sign in with admin credentials
- Should redirect to `/admin`

## Phase 3: Admin Dashboard (Day 2-3)

### Features Implemented

- [x] Product CRUD (Create, Read, Update, Delete)
- [x] Admin authorization check
- [ ] Service CRUD
- [ ] Booking management
- [ ] Analytics dashboard

### API Endpoints (Built)

- `GET /api/products` - List all products
- `POST /api/products` - Create product (admin)
- `GET /api/products/[id]` - Get product
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

## Phase 4: Payment Integration (Day 4)

### Stripe Setup

1. Create Stripe account: https://stripe.com
2. Get test keys from Dashboard
3. Add to `.env.local`:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`

### Payfast Backup

Already configured:
- Merchant ID: 33811799
- Merchant key in: ~/chad-shopify/payfast.env

## Phase 5: Deployment (Day 5-6)

### Frontend: GitHub Pages

```bash
npm run build
# Static export will generate in out/
# Deploy to GitHub Pages via Actions
```

### Backend: Railway or Render

- Create account on Railway.app or Render.com
- Deploy from GitHub
- Set environment variables
- Database already on Supabase (free tier)

## Schema Overview

### Users
- `id` (UUID) - Primary key
- `email` (TEXT) - Unique
- `role` (TEXT) - 'admin' or 'customer'
- `created_at`, `updated_at`

### Products
- `id`, `name`, `price`, `description`, `image_url`
- `category`, `stock_quantity`, `active`

### Services
- `id`, `name`, `price`, `duration_minutes`
- `description`, `image_url`, `active`

### Bookings
- `id`, `user_id`, `service_id`
- `booking_date`, `booking_time`, `status`, `payment_status`

### Orders
- `id`, `user_id`, `total_amount`, `status`, `payment_status`
- `shipping_address`, `payment_method`

### Payments
- `id`, `order_id`, `booking_id`, `amount`
- `status`, `payment_method`, `stripe_payment_intent_id`, `payfast_response_json`

## Testing Checklist

- [ ] Create product via admin
- [ ] Update product
- [ ] Delete product (soft delete)
- [ ] Fetch products on storefront
- [ ] Test auth (sign in/out)
- [ ] Test admin-only access
- [ ] Create order
- [ ] Process payment (test mode)

## Next Steps

1. **Day 2-3**: Build public storefront (product listing, cart, checkout)
2. **Day 4**: Integrate Stripe and Payfast webhooks
3. **Day 5-6**: Deploy to production
4. **Day 7**: Testing, polish, launch

## Important Notes

- **Database**: Supabase free tier = 500MB storage (plenty for MVP)
- **Auth**: Supabase auth with JWT tokens (included)
- **API**: Use Supabase client library (already configured)
- **Images**: Store URLs only, use Cloudflare R2 or external CDN
- **RLS**: Row-Level Security policies in place (admin vs customer)

## Free Tier Limits

- Supabase: 500MB database, 2GB bandwidth
- Stripe: No fees, 2.9% + $0.30 per transaction
- Payfast: 1.5% + R2.50 per transaction
- GitHub Pages: Unlimited
- Railway/Render: $5/month credit
