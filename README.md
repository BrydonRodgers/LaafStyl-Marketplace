# LaafStyl Marketplace MVP

Premium grooming products and services marketplace built with Next.js, Supabase, and Stripe.

**Status:** Core MVP complete (Phases 1-3). Ready for payment integration and deployment.
**Timeline:** Day 1-3 complete. Days 4-7 remaining (payments, deployment, testing).

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase free account (https://supabase.com)
- Stripe test credentials (https://stripe.com)
- Payfast merchant account (already configured: ID 33811799)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# 3. Create Supabase database
# - Create project on Supabase
# - Run SQL from db/migrations/001_init_schema.sql in SQL Editor
# - Save credentials to .env.local

# 4. Run development server
npm run dev
```

Open http://localhost:3000 to view the storefront.

## Project Structure

```
app/
├── page.tsx                    # Home/storefront
├── login/page.tsx             # Authentication
├── products/
│   ├── page.tsx              # Products listing
│   └── [id]/page.tsx         # Product detail
├── services/
│   ├── page.tsx              # Services listing
│   └── [id]/book/page.tsx    # Booking form
├── cart/page.tsx             # Shopping cart
├── admin/page.tsx            # Admin dashboard
└── api/
    ├── products/route.ts     # Product CRUD
    ├── services/route.ts     # Service CRUD
    ├── orders/route.ts       # Order management
    └── bookings/route.ts     # Booking management

lib/
├── supabase.ts               # Database client + types
├── auth.ts                   # Authentication helpers
└── store.ts                  # Zustand stores (auth, cart)

db/
└── migrations/001_init_schema.sql  # Database schema
```

## Features Implemented

### Phase 1: Database & Auth ✓
- [x] Supabase PostgreSQL schema (8 tables)
- [x] Row-Level Security policies
- [x] User authentication (sign up, login, logout)
- [x] Role-based access (admin vs customer)
- [x] Admin authorization on protected routes

### Phase 2: Storefront ✓
- [x] Product listing with filters
- [x] Product detail page
- [x] Shopping cart (Zustand store)
- [x] Add to cart functionality
- [x] Order creation

### Phase 3: Services ✓
- [x] Service listing
- [x] Booking form (date/time selection)
- [x] Booking API endpoints
- [x] User booking history

### Phase 4: Admin Dashboard ✓
- [x] Product CRUD interface
- [x] Admin authorization check
- [x] Analytics cards (products, revenue, orders)
- [ ] Service management UI
- [ ] Booking approval/management
- [ ] Order tracking

### Phase 5: Payments (TODO - Day 4)
- [ ] Stripe checkout integration
- [ ] Payfast fallback payment
- [ ] Payment webhook handlers
- [ ] Transaction confirmation emails

### Phase 6: Deployment (TODO - Day 5-6)
- [ ] Static export for GitHub Pages
- [ ] Backend API deployment (Railway/Render)
- [ ] Database connection from deployed app
- [ ] GitHub Actions CI/CD

## API Endpoints

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product (admin)
- `GET /api/products/[id]` - Get product detail
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Services
- `GET /api/services` - List all services
- `POST /api/services` - Create service (admin)
- `GET /api/services/[id]` - Get service detail
- `PUT /api/services/[id]` - Update service (admin)
- `DELETE /api/services/[id]` - Delete service (admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order from cart

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking

## Database Schema

### Users
```
- id (UUID)
- email (TEXT, unique)
- role ('admin' | 'customer')
- created_at, updated_at
```

### Products
```
- id, name, description, price
- image_url, category, stock_quantity
- active, created_at, updated_at
```

### Services
```
- id, name, description, price
- duration_minutes, image_url
- active, created_at, updated_at
```

### Bookings
```
- id, user_id, service_id
- booking_date, booking_time, notes
- status ('pending'|'confirmed'|'cancelled'|'completed')
- payment_status ('unpaid'|'paid'|'refunded')
- created_at, updated_at
```

### Orders
```
- id, user_id, total_amount, currency
- status, payment_status, payment_method
- shipping_address, created_at, updated_at
```

### Payments
```
- id, order_id, booking_id, amount
- status, payment_method, payment_reference
- stripe_payment_intent_id, payfast_response_json
```

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe (test mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Payfast
PAYFAST_MERCHANT_ID=33811799
PAYFAST_MERCHANT_KEY=your-merchant-key

# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
```

## Testing

### Create Test Data
1. Sign up as admin at `/login`
2. Go to `/admin` dashboard
3. Add a sample product (e.g., "Test Groomer", R50.00)
4. Add a sample service (e.g., "Haircut", R150.00, 30 min)

### Test Storefront
1. Sign out, go to `/` (home)
2. Browse products at `/products`
3. Add product to cart
4. Browse services at `/services`
5. Book a service (requires login)
6. View cart at `/cart`

### Test Checkout Flow (Payment - Day 4)
1. Proceed to checkout from cart
2. Select payment method (Stripe/Payfast)
3. Complete payment with test credentials
4. Verify order in database

## Known Limitations

- Payment integration not yet implemented (Stripe/Payfast)
- Email notifications not yet configured
- Service availability calendar not implemented
- Booking approval workflow simplified
- No image upload (links only)
- No inventory management webhooks

## Next Steps (Days 4-7)

### Day 4: Payment Integration
1. Integrate Stripe Checkout
2. Implement Payfast fallback
3. Add webhook handlers for payment confirmation
4. Send confirmation emails (Resend free tier)

### Day 5-6: Deployment
1. Export Next.js for GitHub Pages
2. Deploy backend to Railway/Render
3. Set up CI/CD with GitHub Actions
4. Configure domain DNS (shop.laafstyl.org)

### Day 7: Testing & Launch
1. End-to-end testing
2. Mobile responsiveness check
3. Performance optimization
4. Launch checklist

## Deployment Checklist

- [ ] Set up Supabase project in production region
- [ ] Create Stripe production account & keys
- [ ] Configure Payfast production merchant keys
- [ ] Deploy backend to Railway/Render
- [ ] Deploy frontend to GitHub Pages
- [ ] Set up GitHub Actions for CI/CD
- [ ] Configure custom domain DNS
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring & error tracking
- [ ] Create backup strategy for database

## Free Tier Limits

| Service | Limit | Cost |
|---------|-------|------|
| Supabase | 500MB database, 2GB bandwidth | Free |
| Stripe | No setup fees, per-transaction | 2.9% + $0.30 |
| Payfast | Per-transaction | 1.5% + R2.50 |
| Railway | Monthly credit | $5/mo (free tier) |
| GitHub Pages | Public repos only | Free |
| Resend (email) | 100/day | Free |

## Support & Documentation

- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Stripe Docs:** https://stripe.com/docs
- **Payfast Docs:** https://www.payfast.co.za/features

## License

MIT
