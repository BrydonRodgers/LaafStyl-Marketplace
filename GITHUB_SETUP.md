# GitHub Repository Setup Guide

This guide walks through creating the GitHub repository and pushing the LaafStyl Marketplace code.

## Prerequisites
- GitHub account (https://github.com/BrydonRodgers)
- Git installed locally
- Code is ready to push (already committed in main branch)

---

## Step 1: Create GitHub Repository

### Option A: Web Interface (Easiest)

1. Go to https://github.com/new
2. Enter repository details:
   - **Repository name:** `LaafStyl-Marketplace`
   - **Description:** "LaafStyl - Multi-vendor marketplace with Stripe + Payfast"
   - **Privacy:** Private (recommended)
   - **Initialize:** Do NOT check "Add a README file"
   - **Do NOT** initialize with .gitignore or license

3. Click "Create repository"

4. You'll see a page with:
   ```
   Quick setup — if you've done this kind of thing before
   ```

---

### Option B: GitHub CLI (If installed)

```bash
gh repo create LaafStyl-Marketplace \
  --private \
  --source=. \
  --remote=origin \
  --push
```

---

## Step 2: Get Repository URL

After creating the repo on GitHub, you'll see:

```
https://github.com/BrydonRodgers/LaafStyl-Marketplace.git
```

Copy this URL for the next step.

---

## Step 3: Push Code from Local

### Check Current Status

```bash
cd /home/brydon-rodgers/.openclaw/workspace/shop-laafstyl

# Verify current state
git status
# Expected: "nothing to commit, working tree clean"

git log --oneline -5
# Expected: Shows recent commits with Day 6-7 testing guides
```

### Add GitHub Remote & Push

```bash
cd /home/brydon-rodgers/.openclaw/workspace/shop-laafstyl

# Remove old remote if exists (this should be safe)
git remote remove origin 2>/dev/null || true

# Add new remote to GitHub
git remote add origin https://github.com/BrydonRodgers/LaafStyl-Marketplace.git

# Verify remote is set
git remote -v
# Expected output:
# origin	https://github.com/BrydonRodgers/LaafStyl-Marketplace.git (fetch)
# origin	https://github.com/BrydonRodgers/LaafStyl-Marketplace.git (push)

# Push to GitHub (with -u to track upstream)
git branch -M main
git push -u origin main

# This will prompt for credentials:
# Username: BrydonRodgers
# Password: [Your GitHub Personal Access Token or password]
```

### Verify Push Success

```bash
# Check that all commits are pushed
git log --oneline -5
# Should show commits like:
# ac68cc4 Add Day 6-7 completion checklist
# ae6fd5e Day 6-7: Add comprehensive testing and launch guide
# 7d692ce Add Day 5 final report - deployment setup complete
# ...

# Verify remote is tracking
git branch -a
# Should show:
# * main
#   remotes/origin/main

# Check if push was successful
git log origin/main --oneline -5
# Should match local history
```

---

## Step 4: Verify on GitHub

1. Go to https://github.com/BrydonRodgers/LaafStyl-Marketplace
2. You should see:
   - [x] Main branch with all commits
   - [x] All files visible in repo
   - [x] README.md displayed
   - [x] package.json and deployment configs
   - [x] Day 6-7 testing guides

3. Click on "Code" tab → click breadcrumb "main"
4. Verify you see files:
   - app/ (Next.js pages)
   - lib/ (utilities)
   - public/ (assets)
   - .github/workflows/ (CI/CD)
   - package.json
   - Dockerfile
   - DAYS_6_7_TESTING_LAUNCH.md
   - DAY6_7_COMPLETION_CHECKLIST.md
   - etc.

---

## Step 5: Configure GitHub Secrets (For CI/CD)

**Important:** These secrets are needed for GitHub Actions to deploy to Railway.

1. Go to your repository: https://github.com/BrydonRodgers/LaafStyl-Marketplace
2. Click "Settings" (top right)
3. Left sidebar → "Secrets and variables" → "Actions"
4. Click "New repository secret"

### Add Each Secret

**Secret 1: SUPABASE_URL**
- Name: `SUPABASE_URL`
- Value: `https://[your-project-id].supabase.co`
- Get from: Supabase Dashboard → Settings → API
- Click "Add secret"

**Secret 2: SUPABASE_ANON_KEY**
- Name: `SUPABASE_ANON_KEY`
- Value: Your anon public key from Supabase
- Get from: Supabase Dashboard → Settings → API → Public key
- Click "Add secret"

**Secret 3: STRIPE_PUBLISHABLE_KEY**
- Name: `STRIPE_PUBLISHABLE_KEY`
- Value: `pk_test_...` (test key)
- Get from: Stripe Dashboard → Developers → API Keys
- Click "Add secret"

**Secret 4: STRIPE_SECRET_KEY**
- Name: `STRIPE_SECRET_KEY`
- Value: `sk_test_...` (test key)
- Get from: Stripe Dashboard → Developers → API Keys
- Click "Add secret"

**Secret 5: RAILWAY_TOKEN**
- Name: `RAILWAY_TOKEN`
- Value: Generate new token in Railway
- Get from:
  1. Go to https://railway.app
  2. Click profile icon (top right)
  3. Settings → API Tokens
  4. Generate new token
  5. Copy and paste here
- Click "Add secret"

### Verification

After adding all secrets:
- Go back to Settings → Secrets and variables → Actions
- You should see 5 secrets listed:
  - [x] SUPABASE_URL
  - [x] SUPABASE_ANON_KEY
  - [x] STRIPE_PUBLISHABLE_KEY
  - [x] STRIPE_SECRET_KEY
  - [x] RAILWAY_TOKEN

**Important:** These values are encrypted and won't be visible after saving. They'll only be available to GitHub Actions workflows.

---

## Step 6: Test GitHub Actions

### Trigger Workflow

Make a small test commit to verify CI/CD works:

```bash
cd /home/brydon-rodgers/.openclaw/workspace/shop-laafstyl

# Create a test file
echo "# Testing GitHub Actions" > TESTING.md

# Add and commit
git add TESTING.md
git commit -m "Test: Trigger GitHub Actions workflow"

# Push to GitHub
git push origin main
```

### Monitor Workflow

1. Go to GitHub repo → "Actions" tab
2. You should see a workflow running:
   - Name: "Node.js CI" or similar
   - Status: In progress (yellow circle)

3. Click on the workflow to see logs
4. Wait for it to complete (3-5 minutes)
5. Verify all jobs pass:
   - [x] Build job succeeds
   - [x] Lint completes (may have warnings)
   - [x] Artifacts created
   - [x] Deploy step completes (if Railway connected)

### Expected Workflow Steps

1. **Setup Node.js 18**
   - Installs Node.js runtime
   - Sets up npm cache

2. **Install Dependencies**
   - `npm install` (cached if possible)

3. **Run Linter**
   - `npm run lint`
   - May show warnings but shouldn't fail

4. **Build**
   - `npm run build`
   - Creates production bundle
   - Should complete in 1-2 minutes

5. **Deploy to Railway** (if configured)
   - Runs `railway up` using RAILWAY_TOKEN
   - Deploys to Railway.app
   - Takes 3-5 minutes

### If Workflow Fails

**Common failures and fixes:**

1. **"Secret not found" or "undefined environment variable"**
   - Solution: Verify all GitHub secrets are added correctly
   - Check: Settings → Secrets and variables → Actions

2. **"Build fails with NextJS errors"**
   - Solution: Check build log for specific error
   - Common: Missing environment variable
   - Fix: Add to GitHub secrets or .env.example

3. **"Lint errors"**
   - Solution: These are often non-blocking
   - Check: Next.js eslint config
   - Fix locally: `npm run lint -- --fix`

4. **"Railway deployment failed"**
   - Solution: Verify RAILWAY_TOKEN is correct
   - Check: Token not expired in Railway dashboard
   - Fix: Generate new token and update GitHub secret

---

## Step 7: Connect Railway to GitHub (For Auto-Deploy)

**Prerequisites:**
- GitHub repo created ✓
- Railway account created
- RAILWAY_TOKEN generated and added to GitHub Secrets ✓

### Option A: Railway Auto-Deploy

1. Go to https://railway.app/dashboard
2. Click on LaafStyl-Marketplace project
3. Go to "Settings" or "Deploy" section
4. Look for "GitHub Integration" or "Auto Deploy"
5. If already connected:
   - Branch: should be "main"
   - Auto-deploy: should be enabled
6. If not connected:
   - Click "Connect GitHub"
   - Authenticate with your GitHub account
   - Select repository: `BrydonRodgers/LaafStyl-Marketplace`
   - Branch: `main`
   - Enable auto-deploy on main branch push

### Option B: Manual Deployment (Fallback)

If auto-deploy not working:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login
# Opens browser for authentication

# Link project
cd /home/brydon-rodgers/.openclaw/workspace/shop-laafstyl
railway link
# Select LaafStyl-Marketplace project

# Deploy
railway up
# Builds and deploys from local code

# Check status
railway status
```

---

## Step 8: Verify Complete Setup

### Checklist

- [ ] GitHub repository created at https://github.com/BrydonRodgers/LaafStyl-Marketplace
- [ ] All code pushed to main branch
- [ ] Repository contains:
  - [ ] app/ directory (Next.js pages)
  - [ ] lib/ directory (utilities)
  - [ ] .github/workflows/deploy.yml (CI/CD)
  - [ ] Dockerfile (Railway build)
  - [ ] package.json
  - [ ] DAYS_6_7_TESTING_LAUNCH.md
  - [ ] DAY6_7_COMPLETION_CHECKLIST.md
- [ ] All 5 GitHub Secrets added:
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_ANON_KEY
  - [ ] STRIPE_PUBLISHABLE_KEY
  - [ ] STRIPE_SECRET_KEY
  - [ ] RAILWAY_TOKEN
- [ ] GitHub Actions workflow runs successfully
- [ ] Railway project deploys automatically on push

### Quick Test

```bash
# Make a small change
echo "# Updated at: $(date)" >> README.md

# Commit and push
git add README.md
git commit -m "Update: Test workflow trigger"
git push origin main

# Monitor
# 1. Go to GitHub Actions tab
# 2. Watch workflow run
# 3. Go to Railway dashboard
# 4. Verify deployment completes

# Total time: ~5 minutes for full CI/CD
```

---

## Next Steps

After GitHub and Railway are connected:

1. **Day 6:** Execute E2E testing suite (see DAYS_6_7_TESTING_LAUNCH.md)
2. **Day 7:** Set up custom domain and go live
3. **First test:** Deploy and test on Railway domain before custom domain

---

## Troubleshooting

### GitHub authentication fails
```bash
# Clear Git credentials
git credential reject https://github.com

# Try again
git push origin main

# If password prompts: Use GitHub Personal Access Token instead
# Create at: https://github.com/settings/tokens
# Select scopes: repo, workflow
```

### Secrets not available to workflow
```bash
# Wait 1-2 minutes after adding secrets
# Secrets don't immediately appear in existing workflow runs
# Trigger a new push to get fresh workflow
git commit --allow-empty -m "Retry workflow with secrets"
git push origin main
```

### Railway deployment fails
```bash
# Check Railway logs
railway logs --service main

# If build fails:
# 1. Check environment variables in Railway
# 2. Verify Dockerfile exists
# 3. Try local build: docker build -t test .

# If deploy fails:
# 1. Check disk space on Railway
# 2. Verify port 3000 not conflicting
# 3. Check start command: npm start
```

### Can't connect Railway to GitHub
```bash
# Try manual connection:
# 1. Go to Railway Settings → Integrations
# 2. Click "Connect GitHub"
# 3. Authorize GitHub app
# 4. Re-select repository

# Or use CLI:
railway link
railway up
```

---

## Resources

- **GitHub Docs:** https://docs.github.com
- **GitHub Secrets:** https://docs.github.com/en/actions/security-guides/encrypted-secrets
- **Railway Docs:** https://docs.railway.app
- **Next.js Deploy:** https://nextjs.org/docs/deployment

---

## Summary

**This guide covers:**
1. Creating GitHub repository
2. Pushing local code to GitHub
3. Adding GitHub Secrets for CI/CD
4. Testing GitHub Actions workflow
5. Connecting Railway for auto-deploy
6. Verifying complete setup

**Expected time:** 15-20 minutes

**After completion:** Ready for E2E testing (Day 6) and domain setup (Day 7)

---

**Status: READY FOR GITHUB SETUP**

Follow steps 1-8 above, then return to DAYS_6_7_TESTING_LAUNCH.md for testing procedures.
