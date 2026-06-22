# Days 6-7: Completion Checklist

**Objective:** Test marketplace thoroughly, configure custom domain, go live with shop.laafstyl.org

---

## Day 6: E2E Testing

### A. Verify Infrastructure (5 min)
- [ ] GitHub repository exists: https://github.com/BrydonRodgers/LaafStyl-Marketplace
- [ ] Main branch pushed and synced
- [ ] GitHub Actions shows successful deployment
- [ ] Railway project deployed successfully
- [ ] Railway domain accessible (e.g., https://[app].up.railway.app)

### B. Test All 10 User Flows (90 min)

#### Test 1: Products & Cart Flow (15 min)
- [ ] Homepage loads without errors
- [ ] Product grid displays all items
- [ ] Product detail page shows full info
- [ ] Add to cart works
- [ ] Cart count updates in navbar
- [ ] Cart page shows correct totals
- [ ] Can modify quantities
- [ ] Can remove items

#### Test 2: Stripe Sandbox Payment (15 min)
- [ ] Checkout page accessible
- [ ] Order summary shows correct items and total
- [ ] Email field required
- [ ] "Pay with Stripe" button works
- [ ] Redirected to Stripe checkout
- [ ] Test card accepted: 4242 4242 4242 4242
- [ ] Redirected to success page after payment
- [ ] Order created in Supabase with correct details

#### Test 3: Stripe Webhook (10 min)
- [ ] Webhook endpoint accessible: /api/webhooks/stripe
- [ ] Payment status updates to "paid"
- [ ] Order shows in Supabase with correct payment_id
- [ ] No errors in Railway logs

#### Test 4: Payfast Sandbox Payment (15 min)
- [ ] "Pay with Payfast" button works
- [ ] Redirected to Payfast sandbox
- [ ] Order amount shown
- [ ] Test payment completes (use sandbox credentials)
- [ ] Redirected back to success page
- [ ] Order created in Supabase

#### Test 5: Payfast Webhook/ITN (10 min)
- [ ] ITN endpoint accessible: /api/webhooks/payfast
- [ ] Payment status updates after webhook
- [ ] Order shows in Supabase correctly
- [ ] No errors in Railway logs

#### Test 6: Service Booking (10 min)
- [ ] Services page accessible
- [ ] Service detail page loads
- [ ] Booking form with date picker works
- [ ] Min date = tomorrow
- [ ] Time slots available (9am-5pm, 30min intervals)
- [ ] Can add special requests
- [ ] Booking summary shows correct totals
- [ ] Can proceed to checkout with booking

#### Test 7: Authentication (10 min)
- [ ] Sign up new account works
- [ ] JWT token stored in localStorage
- [ ] Login with existing credentials works
- [ ] Logout clears session
- [ ] Auth-protected pages redirect non-logged-in users

#### Test 8: Admin Dashboard (10 min)
- [ ] Admin login works (set role=admin in Supabase)
- [ ] Dashboard displays stats
- [ ] Can create new product
- [ ] Can edit existing product
- [ ] Can delete product
- [ ] Changes immediately visible in public store
- [ ] Non-admin users cannot access admin

#### Test 9: Mobile Responsiveness (10 min)
- [ ] Homepage responsive on 375px (mobile)
- [ ] Products grid adapts (1-2 columns)
- [ ] Navigation works on mobile
- [ ] Checkout form accessible on mobile
- [ ] Buttons are touch-friendly
- [ ] No layout breaks on tablet (768px)
- [ ] Desktop layout (1920px) still works

#### Test 10: Error Handling (5 min)
- [ ] 404 page for non-existent products
- [ ] Validation errors on checkout (missing email)
- [ ] Network error recovery
- [ ] API error responses handled gracefully

### C. Log Issues & Fixes (If any test fails)
- [ ] Document exact failure steps
- [ ] Check Railway logs for errors
- [ ] Fix in code
- [ ] Commit and push to GitHub
- [ ] Re-test until passing
- [ ] Log what was fixed

### D. Final Verification Before Day 7 (5 min)
- [ ] All 10 test flows pass
- [ ] No console errors in browser DevTools
- [ ] No server errors in Railway logs
- [ ] Ready to configure production domain

---

## Day 7: Domain Setup & Launch

### A. Configure Cloudflare DNS (10 min)
- [ ] Go to Cloudflare Dashboard
- [ ] Select domain: laafstyl.org
- [ ] Go to DNS section
- [ ] Add CNAME record:
  - Type: CNAME
  - Name: shop
  - Content: [railway-app-name].up.railway.app
  - TTL: Auto
  - Proxy: DNS only (or Proxied)
- [ ] Save and wait 5 minutes for propagation
- [ ] Verify: `nslookup shop.laafstyl.org` returns Railway IP

### B. Configure Railway Domain (10 min)
- [ ] Go to Railway Dashboard
- [ ] Select LaafStyl-Marketplace project
- [ ] Go to Settings or Deploy section
- [ ] Find Domain section
- [ ] Add custom domain: shop.laafstyl.org
- [ ] Railway generates SSL certificate (auto with Cloudflare)
- [ ] Wait 1-2 minutes for SSL provisioning

### C. Update Environment Variables (Production) (15 min)

#### Stripe Keys (choose one)
- [ ] If live keys available:
  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
  - STRIPE_SECRET_KEY=sk_live_...
- [ ] If staying on sandbox:
  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
  - STRIPE_SECRET_KEY=sk_test_...
- [ ] STRIPE_WEBHOOK_SECRET=[copy from Stripe webhook]

#### Payfast Keys (choose one)
- [ ] If live credentials available:
  - PAYFAST_MERCHANT_ID=[live-id]
  - PAYFAST_MERCHANT_KEY=[live-key]
  - PAYFAST_PASSPHRASE=[live-passphrase]
- [ ] If staying on sandbox:
  - PAYFAST_MERCHANT_ID=33811799
  - PAYFAST_MERCHANT_KEY=[sandbox-key]
  - PAYFAST_PASSPHRASE=[sandbox-passphrase or empty]

#### All Required Vars
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] NEXT_PUBLIC_API_URL=https://shop.laafstyl.org/api
- [ ] NODE_ENV=production
- [ ] All Stripe vars set
- [ ] All Payfast vars set

**Update in Railway:** Settings → Environment → Update all vars

### D. Update Webhook URLs (10 min)

#### Stripe Webhook
- [ ] Go to Stripe Dashboard → Developers → Webhooks
- [ ] Find endpoint or create new:
  - URL: https://shop.laafstyl.org/api/webhooks/stripe
  - Events: payment_intent.succeeded, payment_intent.payment_failed, charge.refunded
- [ ] Copy signing secret
- [ ] Update Railway: STRIPE_WEBHOOK_SECRET=[new-secret]
- [ ] Test webhook: Send test event from Stripe
- [ ] Verify: 200 response in webhook log

#### Payfast ITN
- [ ] Go to Payfast Merchant Settings
- [ ] Go to Webhooks/ITN section
- [ ] Update notify URL: https://shop.laafstyl.org/api/webhooks/payfast
- [ ] Enable ITN checkbox
- [ ] Save

### E. Redeploy (If env vars changed) (3 min)
```bash
# Option 1: Push a new commit
cd /home/brydon-rodgers/.openclaw/workspace/shop-laafstyl
git commit --allow-empty -m "Deploy: Production environment variables updated"
git push origin main

# Option 2: Redeploy directly in Railway
railway up
```

### F. Domain & SSL Verification (5 min)
- [ ] Test domain resolution:
  ```bash
  dig shop.laafstyl.org
  # Should resolve to Railway IP
  ```
- [ ] Test HTTPS:
  ```bash
  curl -I https://shop.laafstyl.org
  # Should return 200 with SSL cert
  ```
- [ ] Open in browser: https://shop.laafstyl.org
- [ ] Check: Green lock icon (SSL active)
- [ ] Check: No HTTPS warnings

### G. Final Live Test (30 min)

#### Complete User Journey
1. [ ] Open https://shop.laafstyl.org
2. [ ] Browse products and add to cart (5 min)
3. [ ] Go to checkout (3 min)
4. [ ] Complete Stripe payment with test card (5 min)
5. [ ] Verify order in Supabase (3 min)
6. [ ] Check webhook fired (2 min)
7. [ ] Add service booking to new cart (5 min)
8. [ ] Complete Payfast payment (5 min)
9. [ ] Verify Payfast order in Supabase (2 min)

#### Mobile Test
- [ ] Test on mobile device (or DevTools)
- [ ] Browse products responsive
- [ ] Add to cart works
- [ ] Checkout form accessible
- [ ] Payment works on mobile (5 min)

### H. Pre-Launch Checklist (Final)
- [ ] Homepage loads at https://shop.laafstyl.org
- [ ] Products display correctly
- [ ] Cart functionality works
- [ ] Checkout page accessible
- [ ] Authentication works
- [ ] Admin dashboard accessible (as admin)
- [ ] Stripe test payment works
- [ ] Stripe webhook fires
- [ ] Payfast test payment works
- [ ] Payfast webhook fires
- [ ] Service booking works
- [ ] Mobile responsive
- [ ] No console errors
- [ ] No server errors
- [ ] SSL certificate active (green lock)
- [ ] All environment variables set correctly

---

## Launch Day

### A. Final Confirmation (5 min)
- [ ] All Day 6 tests passed
- [ ] All Day 7 setup complete
- [ ] All checklist items marked complete

### B. Go Live (Automatic)
- [ ] Railway deployment successful
- [ ] GitHub Actions completed
- [ ] Domain resolves: https://shop.laafstyl.org
- [ ] Live URL is LIVE! 🚀

### C. Document Launch (5 min)
Update TOOLS.md with:
- [ ] Live URL: https://shop.laafstyl.org
- [ ] Admin email and password
- [ ] Payment provider sandbox credentials

### D. First 24-Hour Monitoring
- [ ] Check logs for errors every 2-3 hours
- [ ] Monitor order creation rate
- [ ] Test one payment flow manually
- [ ] Watch webhook delivery in Stripe/Payfast

---

## Success Criteria

✓ **Day 6 Complete:**
- All 10 test flows pass on Railroad domain
- No critical errors
- Mobile responsive verified
- Both payment methods work in sandbox

✓ **Day 7 Complete:**
- Domain shop.laafstyl.org resolves
- HTTPS with SSL active
- Production environment variables set
- Webhook URLs updated
- Live test payment processed successfully
- First order confirmed in Supabase

✓ **Launch Verified:**
- App live at https://shop.laafstyl.org
- Zero errors in logs
- Full user journey works
- Payment processing confirmed
- Webhooks firing correctly

---

## Troubleshooting Quick Reference

### If Domain Not Resolving
1. Wait 5 minutes (DNS propagation)
2. Check Cloudflare DNS record:
   - Name: shop
   - Type: CNAME
   - Content: [railway-domain]
3. Verify Railway domain setting accepts shop.laafstyl.org
4. Clear browser cache (Ctrl+Shift+Del)

### If Payments Fail
1. Verify API keys in Railway env
2. Check webhook URLs are correct
3. Test webhook from provider dashboard
4. Check API route logs: `railway logs`
5. If still failing, revert to sandbox keys

### If Webhooks Not Firing
1. Verify webhook URL is publicly accessible
2. Check API route for errors
3. Manually trigger test webhook from provider
4. Check provider logs (Stripe/Payfast dashboard)
5. Verify signature keys match

### If SSL Certificate Missing
1. Wait 2 minutes after domain added to Railway
2. Clear browser cache
3. Check Cloudflare SSL status
4. In Railway, verify domain is "verified" or "provisioning"

---

## Commits to Make

### Day 6
```bash
git commit -m "Day 6: Complete E2E testing on production sandbox

- All 10 user flows tested and passing
- Stripe sandbox payment verified
- Payfast sandbox payment verified
- Mobile responsiveness confirmed
- No critical errors in logs
- Ready for Day 7 domain setup
"
```

### Day 7
```bash
git commit -m "Day 7: Production domain setup + go-live

- shop.laafstyl.org domain configured
- Cloudflare DNS updated
- Railway domain setup complete
- SSL certificate active
- Production environment variables set
- Webhook URLs updated
- Live testing complete
- Ready for production traffic
"
```

---

## Timeline Summary

| Phase | Duration | Status |
|-------|----------|--------|
| Day 6 Early | ~2-3 hours | E2E Testing |
| Day 6 End | ~1-2 hours | Fix any issues |
| Day 7 Morning | ~30 min | Domain setup |
| Day 7 Mid | ~30 min | Environment config |
| Day 7 Afternoon | ~30 min | Final testing |
| Day 7 Evening | ~30 min | Monitoring |
| **Total** | **~5-6 hours** | **LIVE** ✓ |

---

## Notes

- **No additional code changes needed** - app is production-ready
- **Both payment methods** tested in sandbox before live
- **All infrastructure** already configured by Day 5
- **Expected downtime:** 0 minutes (blue-green deployment)
- **Rollback available:** Previous version always running on Railway
- **Support resources:** Stripe, Payfast, and Supabase docs linked in main guide

---

**Status: READY FOR TESTING & LAUNCH**

Next: Execute all checklist items in order, documenting any issues.

Final report: Live URL + first order confirmation screenshot.
