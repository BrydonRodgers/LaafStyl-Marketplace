# LaafStyl Marketplace - Deployment Guide

## Overview
This document provides step-by-step instructions for deploying the LaafStyl Marketplace to GitHub and Railway.

## Prerequisites
- GitHub account with repository push access
- Railway.app account
- Stripe and Payfast sandbox credentials
- Supabase project URL and API keys

## Step 1: Push to GitHub

### 1.1 Create GitHub Repository
1. Go to https://github.com/new
2. Create repository: `LaafStyl-Marketplace`
3. Make it Private (recommended)
4. Do NOT initialize with README (we have one)

### 1.2 Add Remote and Push
```bash
cd /home/brydon-rodgers/.openclaw/workspace/shop-laafstyl
git remote add origin https://github.com/BrydonRodgers/LaafStyl-Marketplace.git
git branch -M main
git push -u origin main
```

### 1.3 Verify Push
```bash
git remote -v
git branch -a
```

## Step 2: GitHub Actions Setup

The workflow file `.github/workflows/deploy.yml` is already configured and will:
- Run on every push to main
- Install dependencies
- Run linting
- Build the Next.js application
- Upload build artifacts
- Trigger Railway deployment

### 2.1 Repository Secrets
In GitHub, go to Settings → Secrets and variables → Actions, add:

**Required Secrets:**
```
SUPABASE_URL              = https://[project-id].supabase.co
SUPABASE_ANON_KEY         = eyJhbGc...
STRIPE_PUBLISHABLE_KEY    = pk_test_...
STRIPE_SECRET_KEY         = sk_test_... (optional, used by backend)
RAILWAY_TOKEN             = railway_...
```

**Optional (for direct deploy):**
```
VERCEL_TOKEN              = vercel_... (if using Vercel)
```

## Step 3: Setup Railway

### 3.1 Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub (recommended)
3. Create new project

### 3.2 Connect GitHub Repository
1. In Railway dashboard, click "New Project"
2. Select "Deploy from GitHub repo"
3. Connect your GitHub account
4. Select `BrydonRodgers/LaafStyl-Marketplace`
5. Select the `main` branch

### 3.3 Add Environment Variables
In Railway project settings, add these variables:

**Frontend (Next.js):**
```
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_API_URL=https://[railway-app-name].up.railway.app/api
NODE_ENV=production
```

**Backend (API Routes):**
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYFAST_MERCHANT_ID=33811799
PAYFAST_MERCHANT_KEY=[your-merchant-key]
PAYFAST_PASSPHRASE=Ihave1newborn (for sandbox)
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
SUPABASE_URL=https://[project-id].supabase.co
```

### 3.4 Railway Deployment
1. Railway will auto-detect Next.js
2. Build command: `npm run build`
3. Start command: `npm start`
4. Port: `3000`
5. Click "Deploy"

### 3.5 Get Railway Domain
Once deployed, Railway generates a domain:
```
https://[app-name].up.railway.app
```

## Step 4: Update Webhook URLs

Update the following API endpoints to use your Railway domain:

### 4.1 Stripe Webhook (in Stripe Dashboard)
```
https://[railway-app-name].up.railway.app/api/webhooks/stripe
```

### 4.2 Payfast Webhook (in Payfast Merchant Settings)
```
https://[railway-app-name].up.railway.app/api/webhooks/payfast
```

### 4.3 Environment Variables
If not already set in Railway, update PAYFAST webhook URL in environment:
```
PAYFAST_NOTIFY_URL=https://[railway-app-name].up.railway.app/api/webhooks/payfast
```

## Step 5: GitHub Pages Setup (Optional)

If you want a static frontend mirror on GitHub Pages:

### 5.1 Repository Settings
1. Go to repo Settings → Pages
2. Source: GitHub Actions
3. Custom domain (if owned): shop.laafstyl.org

### 5.2 Auto-Deploy
The workflow will automatically deploy static files to GitHub Pages.

## Step 6: Testing Live Deployment

### 6.1 Frontend Testing
1. Open Railway domain in browser
2. Verify all pages load
3. Check responsive design on mobile

### 6.2 Authentication Testing
1. Test signup/login
2. Verify redirects work
3. Check JWT tokens in storage

### 6.3 Payment Testing (Sandbox)

**Stripe:**
```
Card: 4242 4242 4242 4242
Exp: 12/25
CVC: 123
```

**Payfast (Sandbox):**
- Use sandbox merchant account
- Test payments redirect correctly
- Verify ITN webhook fires

### 6.4 Webhook Testing
1. In Stripe Dashboard → Webhooks → Testing
2. In Payfast → Test IPN
3. Verify orders appear in Supabase

## Step 7: Monitoring & Maintenance

### 7.1 Railway Logs
```
View in Railway dashboard:
- Build logs
- Deploy logs
- Runtime logs
```

### 7.2 GitHub Actions
```
Check workflow status:
GitHub repo → Actions → See all runs
```

### 7.3 Error Monitoring
Set up error tracking:
- Sentry (recommended)
- LogRocket
- Custom logging to Supabase

## Troubleshooting

### Build Fails
```
Check: npm install && npm run build
Verify: .env variables set correctly
Review: GitHub Actions logs
```

### Railway Deployment Fails
```
Check: Railway logs for errors
Verify: Port 3000 available
Check: Environment variables complete
```

### Webhooks Not Firing
```
1. Verify webhook URLs in Stripe/Payfast dashboard
2. Check Railway domain accessible
3. Review webhook event logs
4. Test via curl from Railway shell
```

### CORS Issues
```
Check: app/api/webhooks/stripe.js CORS headers
Verify: API_URL environment variables
Test: Browser console for errors
```

## Security Checklist

- [ ] All secrets stored in GitHub Secrets
- [ ] .env.local never committed
- [ ] PAYFAST_PASSPHRASE changed for production
- [ ] Stripe/Payfast keys rotated periodically
- [ ] CORS configured for production domain
- [ ] HTTPS enforced on Railway
- [ ] Database backups configured in Supabase
- [ ] Rate limiting on API endpoints
- [ ] Request validation on webhooks

## Production Deployment

For live deployment:

1. Generate new Stripe/Payfast live keys
2. Update all environment variables
3. Switch database to production Supabase
4. Update webhook URLs to production domain
5. Enable HTTPS only
6. Configure custom domain
7. Set up monitoring/alerts
8. Run full regression tests
9. Gradual rollout (canary deployment)

## Useful Commands

```bash
# View deployment logs
railway logs

# Trigger manual deployment
git push origin main

# Check GitHub Actions status
gh run list

# View Railway project info
railway status

# Test API endpoint
curl https://[railway-app].up.railway.app/api/health
```

## Support & Resources

- Railway Docs: https://docs.railway.app
- GitHub Actions: https://docs.github.com/en/actions
- Next.js Deployment: https://nextjs.org/docs/deployment
- Stripe Webhooks: https://stripe.com/docs/webhooks
- Payfast Integration: https://developer.payfast.co.za

## Timeline

- **Day 5 (Today):** GitHub setup + Railway deployment
- **Day 6:** Live testing + webhook verification
- **Day 7:** Production deployment + final checks
