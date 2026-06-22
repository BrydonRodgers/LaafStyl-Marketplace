# Local Quick Test Guide

## Prerequisites
- Docker and Docker Compose installed
- ngrok installed (for tunneling backend)
- Node.js and npm installed locally

## Step 1: Start Backend Services

```bash
cd /home/brydon-rodgers/.openclaw/workspace/shop-laafstyl
docker-compose up --build
```

This starts:
- PostgreSQL database (port 5432)
- Backend API (port 3000)

Wait for messages confirming both services are running.

## Step 2: Start ngrok Tunnel (in another terminal)

```bash
ngrok http 3000
```

Copy the ngrok URL (looks like: `https://1234-567-890-123-456.ngrok.io`)

## Step 3: Update Environment & Deploy

In the project root, run:

```bash
./DEPLOY.sh https://your-ngrok-url-here
```

This will:
1. Update `.env.local` with your ngrok URL
2. Build the Next.js frontend
3. Commit and push changes

## Step 4: Manual Local Testing (Optional)

If you want to test locally before deploying:

```bash
npm install
npm run dev
```

Then visit: `http://localhost:3000`

### Test Flow
1. Visit **http://localhost:3000** (Home page)
2. Click **Shop** → View products list
3. Click on any product → View details
4. Click **Add to Cart**
5. Click **Cart** in nav → View cart
6. Click **Checkout**
7. Enter test email: `test@example.com`
8. Click **Pay with Stripe**
9. Enter test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
10. Complete payment

### Expected Results
- Products load from database
- Cart items persist
- Checkout processes payment
- Success page displays order confirmation

## Troubleshooting

### "Cannot GET /api/products"
- Ensure `docker-compose up` is running
- Check that backend is listening on port 3000
- Verify DATABASE_URL in .env.local

### "Cannot POST /api/checkout"
- Ensure Stripe keys are correct in .env.local
- Check that backend is running with ngrok tunnel active

### "Network error" on page load
- Check that NEXT_PUBLIC_API_URL is set to ngrok URL
- Verify ngrok tunnel is still active
- Check browser DevTools Network tab for failed requests

## Environment Variables Reference

Current `.env.local` settings:
```
NEXT_PUBLIC_API_URL=https://[ngrok-url-here]
STRIPE_PUBLIC_KEY=[your-stripe-test-key]
STRIPE_SECRET_KEY=[your-stripe-test-secret]
PAYFAST_MERCHANT_ID=[your-merchant-id]
PAYFAST_PASSPHRASE=[your-passphrase]
NEXT_PUBLIC_SUPABASE_URL=http://localhost:5432
NEXT_PUBLIC_SUPABASE_ANON_KEY=dev
DATABASE_URL=postgresql://postgres:laafstyl-dev-password@postgres:5432/laafstyl_marketplace
```

Update NEXT_PUBLIC_API_URL with your ngrok URL before testing.
