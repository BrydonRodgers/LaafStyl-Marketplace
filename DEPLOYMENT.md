# Deployment Guide - Days 5-7

This guide covers deployment to production with GitHub Pages (frontend) and Railway/Render (backend).

## Phase 4: Payment Integration (Day 4)

Before deployment, implement payments:

### 1. Stripe Setup

```bash
npm install @stripe/stripe-js stripe

# Create app/api/checkout/route.ts
# Create app/checkout/page.tsx
# Add webhook handler: app/api/webhooks/stripe/route.ts
```

Create `/app/api/checkout/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { items, orderId } = await request.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'zar',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_API_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/cancel`,
      metadata: {
        order_id: orderId,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
```

### 2. Payfast Integration

Create `/app/api/payfast/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create payment form data
    const payData = {
      merchant_id: process.env.PAYFAST_MERCHANT_ID,
      merchant_key: process.env.PAYFAST_MERCHANT_KEY,
      return_url: process.env.PAYFAST_RETURN_URL,
      cancel_url: process.env.PAYFAST_CANCEL_URL,
      notify_url: process.env.PAYFAST_NOTIFY_URL,
      amount: body.amount,
      item_name: body.item_name,
      item_description: body.item_description,
      reference: body.reference,
      email_address: body.email,
    };

    // Generate signature
    const signature = generatePayfastSignature(payData);
    payData.signature = signature;

    return NextResponse.json({ payData });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

function generatePayfastSignature(data: any): string {
  const string = Object.keys(data)
    .sort()
    .map(key => `${key}=${encodeURIComponent(data[key])}`)
    .join('&');
  return crypto.createHash('md5').update(string).digest('hex');
}
```

### 3. Webhook Handlers

Create `/app/api/webhooks/stripe/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature') || '';
  const body = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id;

      if (orderId) {
        await supabase
          .from('payments')
          .insert([
            {
              order_id: orderId,
              amount: (session.amount_total || 0) / 100,
              status: 'completed',
              payment_method: 'stripe',
              stripe_payment_intent_id: session.payment_intent,
            },
          ]);

        await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            status: 'paid',
          })
          .eq('id', orderId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
```

## Phase 5: Deployment (Day 5-6)

### 1. GitHub Setup

```bash
# Initialize git repo (if not done)
git init
git remote add origin https://github.com/YOUR_USERNAME/LaafStyl-Marketplace.git
git push -u origin master

# Create .github/workflows/deploy.yml for CI/CD
```

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main, master]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_KEY }}
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
      
      - name: Deploy to Railway
        run: |
          curl -X POST https://api.railway.app/graphql \
            -H "Authorization: Bearer ${{ secrets.RAILWAY_TOKEN }}" \
            -d '{"query":"mutation { deploy { id } }"}'
```

### 2. Railway Deployment

1. Create account at https://railway.app
2. Link GitHub repo
3. Add environment variables in Railway dashboard
4. Deploy automatically on push

```env
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
STRIPE_SECRET_KEY=xxx
PAYFAST_MERCHANT_KEY=xxx
NODE_ENV=production
```

### 3. Static Export (GitHub Pages - Optional)

In `next.config.ts`:
```typescript
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
};

export default nextConfig;
```

Deploy to GitHub Pages:
```bash
npm run build
# Files in out/ can be deployed to gh-pages branch
```

### 4. Domain Configuration

1. Update DNS records for shop.laafstyl.org:
   ```
   CNAME shop.laafstyl.org -> your-railway-domain.railway.app
   ```

2. Or use Cloudflare Worker (already configured):
   ```javascript
   export default {
     fetch(request) {
       return fetch('https://your-railway-app.railway.app' + new URL(request.url).pathname);
     },
   };
   ```

### 5. Database Backup

Set up Supabase backups:
1. Go to Supabase project settings
2. Enable daily backups
3. Download backups to safe location

## Phase 6: Testing & Launch (Day 7)

### Testing Checklist

```bash
# 1. Unit tests
npm run test

# 2. Manual testing
npm run dev

# Test each flow:
# - [ ] Product browsing
# - [ ] Product search/filter
# - [ ] Add to cart
# - [ ] Checkout with Stripe
# - [ ] Checkout with Payfast
# - [ ] Service booking
# - [ ] Admin dashboard
# - [ ] Product CRUD
# - [ ] Mobile responsiveness

# 3. Performance testing
npm run build
npm run start
# Test with Lighthouse: chrome://inspect
```

### Launch Checklist

- [ ] All environment variables configured in production
- [ ] Database backups enabled
- [ ] Payment webhooks tested with test transactions
- [ ] Email notifications configured (Resend)
- [ ] Admin account created with strong password
- [ ] Sample products/services added
- [ ] Error tracking configured (Sentry, or similar)
- [ ] SSL certificate enabled
- [ ] 404 page configured
- [ ] Terms of Service & Privacy Policy pages added
- [ ] Support contact form added
- [ ] Analytics configured (Google Analytics)
- [ ] Database size monitored
- [ ] API rate limiting configured
- [ ] CORS properly configured

### Post-Launch Monitoring

Monitor these metrics:

1. **Database**
   - Storage usage (should stay under 500MB for free tier)
   - Query performance
   - Connection count

2. **API**
   - Response times
   - Error rates
   - Request volume

3. **Users**
   - Sign-ups per day
   - Active users
   - Conversion rate (cart → order)

4. **Payments**
   - Transaction volume
   - Success rate
   - Failed transactions

## Troubleshooting

### Supabase Connection Issues
```bash
# Test connection
curl https://[PROJECT].supabase.co/rest/v1/products \
  -H "Authorization: Bearer [ANON_KEY]"
```

### Payment Webhook Not Firing
1. Check webhook URL is public (not localhost)
2. Verify signature secret matches
3. Check Stripe/Payfast dashboard for failed deliveries

### Build Failures
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Locked
If migrations fail:
```sql
-- Check for active sessions
SELECT * FROM pg_stat_activity WHERE datname = 'postgres';

-- Terminate conflicting sessions
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = 'postgres' 
  AND pid <> pg_backend_pid();
```

## Cost Summary

At launch (monthly):

| Service | Cost |
|---------|------|
| Supabase | Free (up to 500MB) |
| Stripe | 2.9% + $0.30 per transaction |
| Payfast | 1.5% + R2.50 per transaction |
| Railway | $5 credit (typically free tier) |
| GitHub Pages | Free |
| Resend (email) | Free (up to 100/day) |
| Domain | ~$100/year (external) |
| **Total** | **~$8-10/month** (excluding domain) |

## Support

For issues during deployment:
1. Check logs: Railway dashboard or Vercel
2. Debug Supabase: https://supabase.com/docs/guides/cli/debugging
3. Stripe testing: https://stripe.com/docs/testing
4. Payfast testing: https://www.payfast.co.za/developer/resources/test-cards
