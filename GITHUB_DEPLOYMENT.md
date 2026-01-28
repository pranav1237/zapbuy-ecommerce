# Deploy ZapBuy E-Commerce to GitHub & Vercel

## Step 1: Push to GitHub

### Create a new repository on GitHub:
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `zapbuy-ecommerce` (or your preferred name)
3. Description: "Multi-vendor e-commerce platform with Firebase auth"
4. Choose: Public (for Vercel to access)
5. Click "Create repository"

### Push your local code:

```bash
# Add GitHub remote
git remote add origin https://github.com/YOUR-USERNAME/zapbuy-ecommerce.git

# Rename branch to main if needed
git branch -M main

# Push to GitHub
git push -u origin main
```

**Copy this link for Step 2**: `https://github.com/YOUR-USERNAME/zapbuy-ecommerce`

---

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

1. **Go to [vercel.com](https://vercel.com)**
   - Sign in with GitHub account
   - Click "New Project"

2. **Import from Git**
   - Paste your GitHub repo URL
   - Select: "Next.js"
   - Click "Import"

3. **Configure Project**
   - Framework Preset: "Next.js"
   - Root Directory: "marketplace-frontend" (where package.json is)
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add all these vars:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDTfAo6xNvhktEBvIZtUzt1pFYOtWhNm0w
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=e-commerce-bd2c6.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=e-commerce-bd2c6
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=e-commerce-bd2c6.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=142824053194
   NEXT_PUBLIC_FIREBASE_APP_ID=1:142824053194:web:5aad5b2b2dcbc29eeed733
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ZXZ97DXSNZ
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Get your live URL: `https://zapbuy-xxxxx.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to project
cd d:\Documents\E-Commerce\marketplace-frontend

# Deploy
vercel

# Follow prompts and add env vars when asked
```

---

## Step 3: Test Your Live Deployment

After Vercel shows "✓ Production", visit:
- **Frontend**: `https://zapbuy-xxxxx.vercel.app`

Test:
- ✅ Homepage loads with animations
- ✅ Sign In button works
- ✅ Firebase authentication works (Google + Email)
- ✅ Dashboards accessible after login
- ✅ Mobile responsive

---

## Step 4: Auto-Deployments

From now on, whenever you push to GitHub:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel automatically deploys the new version!

---

## Frontend Structure for Vercel

```
marketplace-frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Homepage
│   │   ├── layout.tsx         # Root layout
│   │   └── dashboard/         # Customer dashboard
│   ├── components/            # UI components
│   ├── lib/                   # Firebase, auth config
│   └── styles/                # CSS
├── public/                    # Static assets
├── package.json              # Vercel reads this
├── tsconfig.json
├── next.config.js
├── .env.local               # For local dev only
└── vercel.json             # Vercel deployment config
```

---

## Important: Remove node_modules Before Final Push

```bash
cd d:\Documents\E-Commerce

# Remove node_modules to reduce repo size
rm -r marketplace-frontend/node_modules
rm -r marketplace-backend/node_modules

# Commit and push
git add .gitignore
git commit -m "Add .gitignore, remove node_modules"
git push origin main
```

Vercel will install dependencies automatically during build.

---

## Vercel Environment Variables Reference

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | From Firebase Console | Public - safe to expose |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | e-commerce-bd2c6.firebaseapp.com | Public - safe to expose |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | e-commerce-bd2c6 | Public - safe to expose |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | e-commerce-bd2c6.firebasestorage.app | Public - safe to expose |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | 142824053194 | Public - safe to expose |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | 1:142824053194:web:5aad... | Public - safe to expose |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | G-ZXZ97DXSNZ | Public - safe to expose |
| `NEXT_PUBLIC_API_URL` | Your backend URL | For API calls |

All `NEXT_PUBLIC_*` variables are automatically available in the browser.

---

## Troubleshooting Vercel Deployment

### Build fails with "Cannot find module"
- Check `root directory` is set to `marketplace-frontend`
- Ensure all imports use `@/` paths correctly
- Verify `tsconfig.json` has `baseUrl` and `paths` configured

### Environment variables not working
- Verify you added them in Vercel Dashboard (not just .env.local)
- For `NEXT_PUBLIC_*` variables, redeploy after adding
- Check they're visible in deployment logs

### Firebase auth not working
- Verify credentials match between `.env.local` and Vercel Dashboard
- Check Firebase Console → Settings → Web apps → App URL is allowed
- Add your Vercel domain to Firebase authorized domains

### CORS errors
- Backend needs CORS headers for your Vercel domain
- Add to backend: `https://zapbuy-xxxxx.vercel.app`

---

## Next Steps After Deployment

1. **Setup Backend**
   - Deploy NestJS backend to Railway, Render, or AWS
   - Get backend URL (e.g., `https://api.yourapp.com`)
   - Update `NEXT_PUBLIC_API_URL` in Vercel

2. **Setup Database**
   - Create PostgreSQL instance
   - Run Prisma migrations
   - Connect to backend

3. **Setup Custom Domain** (Optional)
   - In Vercel Dashboard → Settings → Domains
   - Add your custom domain
   - Update DNS records

4. **Enable Analytics**
   - Vercel Web Analytics automatically enabled
   - Firebase Analytics setup in `firebase.ts`

---

## GitHub + Vercel Workflow

```
Your Computer
      ↓
   git push
      ↓
  GitHub Repo
      ↓
Vercel (auto-detects)
      ↓
  Build & Deploy
      ↓
Live URL: https://zapbuy-xxxxx.vercel.app
```

Every push = automatic deployment! 🚀

---

## Commands Reference

```bash
# Local development
npm run dev:4848          # Start on port 4848

# Production build
npm run build             # Build for production
npm start                 # Run production server

# Git commands
git status                # Check git status
git add .                 # Stage all changes
git commit -m "message"   # Commit changes
git push origin main      # Push to GitHub

# Clean before pushing
rm -r node_modules
rm -r .next
npm install               # Fresh install
npm run build             # Test build locally
```

---

## Success Checklist

Before considering deployment complete:

- [ ] Code pushed to GitHub
- [ ] Vercel project connected
- [ ] Environment variables added
- [ ] Build completes successfully (~2-3 min)
- [ ] Deployment URL accessible
- [ ] Homepage loads with animations
- [ ] Firebase auth works (Google + Email)
- [ ] Can access customer/vendor/admin dashboards
- [ ] Mobile responsive
- [ ] Custom domain configured (optional)

---

## Support

If deployment fails:

1. **Check Vercel build logs**: Dashboard → Deployments → Failed → View Logs
2. **Verify environment variables**: Settings → Environment Variables
3. **Check root directory**: Root Directory must be `marketplace-frontend`
4. **Rebuild**: In Vercel Dashboard → → Redeploy

Your ZapBuy platform is now live! 🎉
