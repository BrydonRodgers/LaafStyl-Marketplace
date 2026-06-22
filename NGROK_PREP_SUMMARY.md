# NGROK Tunnel Prep Summary

**Status**: Ready for deployment. All files prepped and waiting for ngrok URL.

## Files Created

### 1. `.env.local` (New)
- Contains placeholder: `NEXT_PUBLIC_API_URL=https://placeholder.ngrok.io`
- Contains all required Stripe, PayFast, and database credentials
- Will be updated with actual ngrok URL when available

**Location**: `/shop-laafstyl/.env.local`

### 2. `DEPLOY.sh` (New)
- Bash script to automate deployment workflow
- Usage: `./DEPLOY.sh https://your-ngrok-url`
- Steps:
  1. Updates .env.local with ngrok URL
  2. Builds project with `npm run build`
  3. Commits changes
  4. Pushes to main branch

**Location**: `/shop-laafstyl/DEPLOY.sh` (executable)

### 3. `LOCAL_QUICK_TEST.md` (New)
- Complete testing guide for local setup
- Instructions for:
  - Starting Docker + ngrok
  - Running deployment script
  - Manual testing workflow
  - Troubleshooting common issues

**Location**: `/shop-laafstyl/LOCAL_QUICK_TEST.md`

## Files Modified

All files updated to use `NEXT_PUBLIC_API_URL` environment variable:

1. **app/page.tsx** - Home page product fetch
2. **app/products/page.tsx** - Products listing fetch
3. **app/products/[id]/page.tsx** - Product detail fetch
4. **app/services/page.tsx** - Services listing fetch
5. **app/services/[id]/book/page.tsx** - Service detail & booking fetch
6. **app/checkout/page.tsx** - Stripe & PayFast checkout fetches
7. **app/admin/page.tsx** - Admin product management fetches
8. **app/cart/page.tsx** - Order creation fetch

### Pattern Used
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const res = await fetch(`${apiUrl}/api/endpoint`, { ... });
```

This allows:
- Remote deployment via ngrok tunnel
- Fallback to localhost for local development
- No hardcoded URLs

## Credentials in .env.local

```
STRIPE_PUBLIC_KEY=[your-stripe-test-key]
STRIPE_SECRET_KEY=[your-stripe-test-secret]
PAYFAST_MERCHANT_ID=[your-merchant-id]
PAYFAST_PASSPHRASE=[your-passphrase]
DATABASE_URL=postgresql://postgres:laafstyl-dev-password@postgres:5432/laafstyl_marketplace
```

## Next Steps (When Brydon Provides ngrok URL)

1. Brydon starts Docker: `docker-compose up --build`
2. Brydon starts ngrok: `ngrok http 3000` (get URL)
3. Run deployment script: `./DEPLOY.sh https://[ngrok-url]`
4. Script will:
   - Update .env.local
   - Build frontend
   - Commit and push to main
5. Site goes live with ngrok tunnel as API backend

## Ready to Deploy?

All files are prepped. Just waiting for ngrok URL.

Command format when ready:
```bash
./DEPLOY.sh https://YOUR-NGROK-URL.ngrok.io
```

Example:
```bash
./DEPLOY.sh https://abc123-def456-ghi789.ngrok.io
```
