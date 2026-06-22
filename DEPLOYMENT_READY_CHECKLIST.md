# Deployment Ready Checklist

## Prep Phase (COMPLETED)

- [x] Created `.env.local` with placeholder ngrok URL
- [x] Updated all 8 fetch endpoints to use `NEXT_PUBLIC_API_URL`
- [x] Created `DEPLOY.sh` script (executable)
- [x] Created `LOCAL_QUICK_TEST.md` testing guide
- [x] Verified all API calls follow pattern: `${apiUrl}/api/endpoint`

## Files Ready for Deployment

```
✓ .env.local (with placeholder ngrok URL)
✓ DEPLOY.sh (automated deployment script)
✓ LOCAL_QUICK_TEST.md (testing instructions)
✓ app/page.tsx (updated)
✓ app/products/page.tsx (updated)
✓ app/products/[id]/page.tsx (updated)
✓ app/services/page.tsx (updated)
✓ app/services/[id]/book/page.tsx (updated)
✓ app/checkout/page.tsx (updated)
✓ app/admin/page.tsx (updated)
✓ app/cart/page.tsx (updated)
```

## Deployment Phase (WHEN BRYDON SENDS NGROK URL)

### Step 1: Start Infrastructure
```bash
# Terminal 1: Start Docker services
docker-compose up --build

# Terminal 2: Start ngrok tunnel
ngrok http 3000
# Copy the URL (e.g., https://abc123-def456.ngrok.io)
```

### Step 2: Deploy
```bash
# Terminal 3: Deploy with ngrok URL
./DEPLOY.sh https://your-ngrok-url.ngrok.io
```

This automatically:
1. Updates `.env.local`
2. Builds frontend
3. Commits changes
4. Pushes to main

### Step 3: Verify
Visit the deployed site and test:
- [ ] Homepage loads
- [ ] Products appear
- [ ] Add to cart works
- [ ] Checkout page loads
- [ ] Payment options visible (Stripe & PayFast)

## API Endpoints Updated

All these endpoints now use `NEXT_PUBLIC_API_URL`:

| Endpoint | File | Method | Purpose |
|----------|------|--------|---------|
| `/api/products` | app/page.tsx | GET | Fetch all products |
| `/api/products` | app/products/page.tsx | GET | Products listing page |
| `/api/products/:id` | app/products/[id]/page.tsx | GET | Product detail |
| `/api/services` | app/services/page.tsx | GET | Services listing |
| `/api/services/:id` | app/services/[id]/book/page.tsx | GET | Service detail |
| `/api/bookings` | app/services/[id]/book/page.tsx | POST | Create booking |
| `/api/checkout` | app/checkout/page.tsx | POST | Stripe checkout |
| `/api/payfast/redirect` | app/checkout/page.tsx | POST | PayFast checkout |
| `/api/orders` | app/cart/page.tsx | POST | Create order |
| `/api/products` | app/admin/page.tsx | GET/POST | Admin products |
| `/api/products/:id` | app/admin/page.tsx | PUT | Update product |

## Environment Variables

All set in `.env.local`:

```
NEXT_PUBLIC_API_URL=https://[WILL_BE_UPDATED_WITH_NGROK_URL]
STRIPE_PUBLIC_KEY=[your-stripe-test-key]
STRIPE_SECRET_KEY=[your-stripe-test-secret]
PAYFAST_MERCHANT_ID=[your-merchant-id]
PAYFAST_PASSPHRASE=[your-passphrase]
NEXT_PUBLIC_SUPABASE_URL=http://localhost:5432
NEXT_PUBLIC_SUPABASE_ANON_KEY=dev
DATABASE_URL=postgresql://postgres:laafstyl-dev-password@postgres:5432/laafstyl_marketplace
```

## Fallback Behavior

All API calls include fallback:
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
```

This means:
- If `NEXT_PUBLIC_API_URL` is set → uses ngrok tunnel
- If `NEXT_PUBLIC_API_URL` is undefined → falls back to localhost:3000
- Allows local development without ngrok

## Files Not Modified

- No `.gitignore` changes
- No package.json changes
- No database migrations
- No backend code changes
- No configuration changes

## Ready?

When you have the ngrok URL from Brydon, simply run:

```bash
cd /home/brydon-rodgers/.openclaw/workspace/shop-laafstyl
./DEPLOY.sh https://[ngrok-url]
```

All other work is done.
