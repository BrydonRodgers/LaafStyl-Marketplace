# Documentation Index - ngrok Tunnel Deployment

## Quick Start
- **QUICK_REFERENCE.txt** - Start here. 1-page quick lookup guide
- **PREP_COMPLETE.txt** - Completion summary and next steps

## Deployment
- **DEPLOY.sh** - The actual deployment script (just run this with ngrok URL)
- **LOCAL_QUICK_TEST.md** - Step-by-step testing & deployment guide
- **DEPLOYMENT_READY_CHECKLIST.md** - Complete deployment checklist with verification

## Overview & Reference
- **NGROK_PREP_SUMMARY.md** - Summary of all files created/modified
- **DOCS_INDEX.md** - This file (navigation guide)

---

## File Purpose Reference

| File | Purpose | Read When |
|------|---------|-----------|
| QUICK_REFERENCE.txt | 1-page quick guide | You need quick answers |
| DEPLOY.sh | Deployment script | Ready to deploy |
| .env.local | Environment config | Checking API URL or credentials |
| LOCAL_QUICK_TEST.md | Testing guide | Testing locally before deploying |
| DEPLOYMENT_READY_CHECKLIST.md | Detailed checklist | Doing full deployment |
| NGROK_PREP_SUMMARY.md | Technical overview | Understanding what changed |
| PREP_COMPLETE.txt | Completion report | Want summary of prep work |
| DOCS_INDEX.md | Navigation guide | This page |

---

## Deployment Command (When Ready)

```bash
./DEPLOY.sh https://[ngrok-url-here]
```

Example:
```bash
./DEPLOY.sh https://abc123-def456-ghi789.ngrok.io
```

---

## Modified Files (All API endpoints updated)

1. app/page.tsx - Home page
2. app/products/page.tsx - Products listing
3. app/products/[id]/page.tsx - Product details
4. app/services/page.tsx - Services listing
5. app/services/[id]/book/page.tsx - Service booking
6. app/checkout/page.tsx - Checkout flow
7. app/admin/page.tsx - Admin panel
8. app/cart/page.tsx - Shopping cart

---

## API Endpoints Covered

All 11 endpoints now use `NEXT_PUBLIC_API_URL`:

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)

### Services
- `GET /api/services` - List services
- `GET /api/services/:id` - Get service details

### Bookings
- `POST /api/bookings` - Create booking

### Checkout
- `POST /api/checkout` - Stripe checkout
- `POST /api/payfast/redirect` - PayFast checkout

### Orders
- `POST /api/orders` - Create order

---

## Environment Variables

Set in `.env.local`:

```
NEXT_PUBLIC_API_URL=https://placeholder.ngrok.io
STRIPE_PUBLIC_KEY=[your-stripe-test-key]
STRIPE_SECRET_KEY=[your-stripe-test-secret]
PAYFAST_MERCHANT_ID=[your-merchant-id]
PAYFAST_PASSPHRASE=[your-passphrase]
NEXT_PUBLIC_SUPABASE_URL=http://localhost:5432
NEXT_PUBLIC_SUPABASE_ANON_KEY=dev
DATABASE_URL=postgresql://postgres:laafstyl-dev-password@postgres:5432/laafstyl_marketplace
```

---

## Deployment Sequence

1. **Prerequisites from Brydon:**
   - Docker running: `docker-compose up --build`
   - ngrok running: `ngrok http 3000`
   - ngrok URL copied

2. **Deploy:**
   ```bash
   ./DEPLOY.sh https://[ngrok-url]
   ```

3. **Script does:**
   - Updates .env.local
   - Builds frontend
   - Commits changes
   - Pushes to main

4. **Done!**
   Site is live with ngrok tunnel as backend

---

## API URL Pattern (in all files)

```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const res = await fetch(`${apiUrl}/api/endpoint`, { ... });
```

Benefits:
- Works with ngrok tunnel
- Falls back to localhost
- No hardcoded URLs
- Easy environment switching

---

## Testing Checklist

After deployment, verify:
- [ ] Homepage loads
- [ ] Products appear
- [ ] Can add items to cart
- [ ] Cart page shows items
- [ ] Checkout page displays
- [ ] Payment options visible (Stripe & PayFast)
- [ ] API calls succeed (check DevTools)

---

## Quick Navigation

**Need quick answers?**
→ Read: QUICK_REFERENCE.txt

**Ready to deploy?**
→ Run: `./DEPLOY.sh https://[ngrok-url]`

**Want detailed guide?**
→ Read: LOCAL_QUICK_TEST.md

**Want technical details?**
→ Read: DEPLOYMENT_READY_CHECKLIST.md

**Want overview of changes?**
→ Read: NGROK_PREP_SUMMARY.md

---

## File Locations

All in project root: `/home/brydon-rodgers/.openclaw/workspace/shop-laafstyl/`

```
.env.local                          ← Environment config
DEPLOY.sh                           ← Deployment script
app/                                ← Modified fetch endpoints
├── page.tsx
├── products/
│   ├── page.tsx
│   └── [id]/page.tsx
├── services/
│   ├── page.tsx
│   └── [id]/book/page.tsx
├── checkout/page.tsx
├── admin/page.tsx
└── cart/page.tsx
```

---

## Support Files

Documentation:
- QUICK_REFERENCE.txt
- PREP_COMPLETE.txt
- LOCAL_QUICK_TEST.md
- DEPLOYMENT_READY_CHECKLIST.md
- NGROK_PREP_SUMMARY.md
- DOCS_INDEX.md (this file)

Scripts:
- DEPLOY.sh

Config:
- .env.local

---

## Status

**Prep Status:** COMPLETE ✓
**Ready to Deploy:** YES ✓
**Waiting For:** ngrok URL from Brydon ⏳

---

Last Updated: 2026-06-22
