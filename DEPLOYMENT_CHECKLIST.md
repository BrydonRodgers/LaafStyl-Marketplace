# LaafStyl Marketplace - Deployment Checklist (Day 5)

## Status: DEPLOYMENT FILES READY ✓

All deployment configuration files have been created and committed to `main` branch.

### Files Created:
- `✓ .github/workflows/deploy.yml` - GitHub Actions CI/CD pipeline
- `✓ railway.json` - Railway.app deployment config
- `✓ vercel.json` - Vercel deployment config (backup)
- `✓ Dockerfile` - Container image for Railway
- `✓ .dockerignore` - Docker build exclusions
- `✓ DEPLOYMENT_GUIDE.md` - Comprehensive setup guide

### Commit:
```
8757d65 Day 5: Add GitHub Actions CI/CD + Railway deployment configuration
```

---

## NEXT STEPS (Manual Actions Required)

### Phase 1: GitHub Repository Creation
**Est. Time: 5 minutes**

1. **Create Repository:**
   - Go to https://github.com/new
   - Name: `LaafStyl-Marketplace`
   - Description: "LaafStyl - Multi-vendor marketplace with Stripe + Payfast"
   - Privacy: Private (recommended)
   - ✓ Do NOT initialize with README/gitignore
   
2. **Get Repository URL:**
   ```
   https://github.com/BrydonRodgers/LaafStyl-Marketplace.git
   ```

3. **Local Push:**
   ```bash
   cd /home/brydon-rodgers/.openclaw/workspace/shop-laafstyl
   
   # Remove old remote if exists
   git remote remove origin 2>/dev/null || true
   
   # Add new remote
   git remote add origin https://github.com/BrydonRodgers/LaafStyl-Marketplace.git
   
   # Push to main
   git push -u origin main
   
   # Verify
   git remote -v
   git branch -a
   ```

---

### Phase 2: GitHub Secrets Configuration
**Est. Time: 10 minutes**

Go to: `GitHub repo → Settings → Secrets and variables → Actions`

**Add the following secrets:**

| Secret Name | Value | Source |
|---|---|---|
| `SUPABASE_URL` | `https://[project-id].supabase.co` | Supabase Dashboard |
| `SUPABASE_ANON_KEY` | Your anon public key | Supabase → Settings → API |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | Stripe Dashboard → API Keys |
| `STRIPE_SECRET_KEY` | `sk_test_...` | Stripe Dashboard → API Keys |
| `RAILWAY_TOKEN` | Generate new | Railway → Account → API Tokens |

**Verify:**
- Each secret is visible in Actions workflow (not in logs)
- No secrets printed in GitHub Actions output

---

### Phase 3: Railway.app Setup
**Est. Time: 15 minutes**

1. **Create Railway Account:**
   - Go to https://railway.app
   - Sign up with GitHub (recommended)
   
2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authenticate with GitHub
   - Select: `BrydonRodgers/LaafStyl-Marketplace`
   - Branch: `main`
   
3. **Railway will auto-detect:**
   - ✓ Framework: Next.js
   - ✓ Build: `npm run build`
   - ✓ Start: `npm start`
   - ✓ Port: 3000
   
4. **Add Environment Variables in Railway:**
   
   **Frontend Vars:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=[from-supabase]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[from-supabase]
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[from-stripe]
   NEXT_PUBLIC_API_URL=https://[railway-domain].up.railway.app/api
   NODE_ENV=production
   ```
   
   **Backend Vars:**
   ```
   STRIPE_SECRET_KEY=[from-stripe]
   PAYFAST_MERCHANT_ID=33811799
   PAYFAST_MERCHANT_KEY=[from-payfast-sandbox]
   SUPABASE_SERVICE_ROLE_KEY=[from-supabase]
   ```
   
5. **Deploy:**
   - Click "Deploy" button
   - Wait for build (~3-5 minutes)
   - Copy Railway domain: `https://[app-name].up.railway.app`

---

### Phase 4: Webhook Configuration
**Est. Time: 10 minutes**

1. **Stripe Webhook:**
   - Go to: Stripe Dashboard → Developers → Webhooks
   - Add Endpoint
   - URL: `https://[railway-domain].up.railway.app/api/webhooks/stripe`
   - Events: 
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `charge.refunded`
   - Signing Secret: Copy and add to Railway env as `STRIPE_WEBHOOK_SECRET`
   - Status: Click "Enable"

2. **Payfast Webhook:**
   - Go to: Payfast Sandbox Merchant Settings
   - Webhooks/ITN Settings
   - Notify URL: `https://[railway-domain].up.railway.app/api/webhooks/payfast`
   - Enable ITN checkbox
   - Save

3. **Verify in Railway:**
   ```bash
   railway logs
   # Look for successful webhook deliveries
   ```

---

### Phase 5: Live Testing
**Est. Time: 20 minutes**

1. **Frontend Access:**
   ```
   https://[railway-domain].up.railway.app
   ```
   - [ ] Load homepage
   - [ ] Browse products
   - [ ] Add to cart
   - [ ] Go to checkout
   - [ ] Verify responsive design

2. **Authentication:**
   - [ ] Sign up new account
   - [ ] Login with existing
   - [ ] JWT token stored in localStorage
   - [ ] Logout works

3. **Stripe Payment (Sandbox):**
   - [ ] Proceed to checkout
   - [ ] Enter test card: `4242 4242 4242 4242`
   - [ ] Exp: `12/25`, CVC: `123`
   - [ ] Complete payment
   - [ ] See success page
   - [ ] Order appears in Supabase

4. **Payfast Payment (Sandbox):**
   - [ ] Select Payfast at checkout
   - [ ] Redirected to Payfast page
   - [ ] Complete payment
   - [ ] Redirected back to success
   - [ ] Order appears in Supabase

5. **Webhook Verification:**
   - [ ] Order status updates to "completed"
   - [ ] Railway logs show webhook receipt
   - [ ] No errors in application logs

---

### Phase 6: GitHub Actions Verification
**Est. Time: 5 minutes**

1. **Make a Test Commit:**
   ```bash
   cd /home/brydon-rodgers/.openclaw/workspace/shop-laafstyl
   echo "# Test deployment" >> DEPLOYMENT_STATUS.md
   git add DEPLOYMENT_STATUS.md
   git commit -m "Test: Trigger GitHub Actions"
   git push origin main
   ```

2. **Monitor Build:**
   - Go to GitHub repo → Actions
   - Click latest workflow run
   - [ ] Build job succeeds
   - [ ] Linter passes (or warnings only)
   - [ ] Build artifacts created
   - [ ] Deploy job completes

---

## Summary of Ready-to-Deploy Files

### Configuration Files (Already Committed)
```
.github/workflows/deploy.yml          # GitHub Actions automation
railway.json                          # Railway platform config
vercel.json                          # Vercel deployment (backup)
Dockerfile                           # Container image build
.dockerignore                        # Docker exclusions
DEPLOYMENT_GUIDE.md                  # Full deployment documentation
```

### Application Files (Already Complete)
```
app/                                 # Next.js app with pages
lib/                                 # Supabase client + utilities
db/                                  # Database schema
public/                              # Static assets
package.json                         # Dependencies
tsconfig.json                        # TypeScript config
```

### API Endpoints Ready
```
POST   /api/checkout                 # Stripe checkout session
POST   /api/webhooks/stripe          # Stripe webhook receiver
POST   /api/webhooks/payfast         # Payfast ITN receiver
GET    /api/auth/user                # Auth verification
GET    /api/orders                   # List user orders
```

---

## Deployment Timeline

| Phase | Task | Est. Time | Status |
|-------|------|-----------|--------|
| 1 | GitHub Repo Creation | 5 min | ⏳ PENDING |
| 2 | GitHub Secrets Setup | 10 min | ⏳ PENDING |
| 3 | Railway.app Setup | 15 min | ⏳ PENDING |
| 4 | Webhook Configuration | 10 min | ⏳ PENDING |
| 5 | Live Testing | 20 min | ⏳ PENDING |
| 6 | GitHub Actions Verify | 5 min | ⏳ PENDING |
| **Total** | | **~65 min** | |

---

## Rollback Plan

If deployment fails:

1. **GitHub Actions Failure:**
   ```bash
   # Check logs in Actions tab
   # Fix code issue locally
   git commit -m "Fix: Address build error"
   git push origin main
   # Workflow auto-retries
   ```

2. **Railway Deployment Failure:**
   - Railway auto-reverts to last successful build
   - Check environment variables
   - Verify Docker build works locally:
     ```bash
     docker build -t laafstyl:latest .
     docker run -p 3000:3000 laafstyl:latest
     ```

3. **Webhook Issues:**
   - Temporarily disable webhooks
   - Manually update order status in Supabase
   - Verify webhook URLs correct
   - Re-enable webhooks

---

## Success Criteria

✓ **Day 5 Complete When:**
- [ ] GitHub repository created and main branch pushed
- [ ] GitHub Actions workflow passes on first run
- [ ] Railway deployment completes successfully
- [ ] Application loads in browser at Railway domain
- [ ] Stripe sandbox payment processes end-to-end
- [ ] Payfast sandbox payment processes end-to-end
- [ ] Both webhooks fire and update Supabase orders
- [ ] No errors in production logs

✓ **Ready for Day 6:** Live testing and optimization

---

## Resources

- **Railway Docs:** https://docs.railway.app
- **GitHub Actions:** https://docs.github.com/en/actions
- **Next.js Deploy:** https://nextjs.org/docs/deployment
- **Stripe Webhooks:** https://stripe.com/docs/webhooks
- **Payfast Integration:** https://developer.payfast.co.za

---

## Notes

- All files committed to `main` branch
- No additional code changes needed
- Ready for immediate deployment to GitHub
- Railway auto-deploys on push to main (after setup)
- Recommend testing in sandbox mode first
- Production deployment details in DEPLOYMENT_GUIDE.md
