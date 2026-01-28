# ⚡ QUICK REFERENCE - MARKETPLACE FRONTEND

## 🚀 Get Started in 5 Minutes

### Step 1: Install & Setup
```bash
cd marketplace-frontend
npm install
cp .env.example .env.local
```

### Step 2: Configure Firebase
1. Go to https://firebase.google.com
2. Create a new project
3. Enable Email/Password and Google Sign-In
4. Copy config and paste into `.env.local`

### Step 3: Run Development
```bash
npm run dev
# Open http://localhost:3000
```

### Step 4: Deploy to Vercel
```bash
git add .
git commit -m "Initial commit"
git push origin main
# Go to https://vercel.com and import
```

---

## 📁 Key Files Overview

| File | Purpose | Location |
|------|---------|----------|
| `layout.tsx` | Root layout with Auth | `src/app/` |
| `Hero3D.tsx` | 3D animated section | `src/components/` |
| `AuthModal.tsx` | Login/signup modal | `src/components/` |
| `ProductCard.tsx` | Product display | `src/components/` |
| `CustomerDashboard.tsx` | Customer panel | `src/components/` |
| `VendorDashboard.tsx` | Vendor analytics | `src/components/` |
| `AdminDashboard.tsx` | Admin panel | `src/components/` |
| `firebase.ts` | Firebase config | `src/lib/` |
| `auth-context.tsx` | Auth provider | `src/lib/` |
| `globals.css` | Animations & styles | `src/styles/` |

---

## 🔑 Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 📊 Page Routes

| Route | Component | Access |
|-------|-----------|--------|
| `/` | Home page | Public |
| `/dashboard` | Customer dashboard | Auth required |
| `/vendor-dashboard` | Vendor dashboard | Vendor only |
| `/admin-dashboard` | Admin dashboard | Admin only |

---

## 🎨 Color Codes

```
Purple:  #a855f7 (Primary)
Pink:    #ec4899 (Secondary)
Green:   #10b981 (Success)
Yellow:  #f59e0b (Warning)
Red:     #ef4444 (Error)
Gray:    #6b7280 (Neutral)
White:   #ffffff (Background)
```

---

## 🔌 API Integration

```typescript
// Example API call
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/products`
);
const data = await response.json();
```

---

## 🔐 Authentication Flow

```
User clicks "Sign In"
       ↓
AuthModal opens
       ↓
Choose login method (Email or Google)
       ↓
Firebase authentication
       ↓
User data stored in context
       ↓
Role check (Admin/Vendor/Customer)
       ↓
Redirect to dashboard
```

---

## 📱 Components

### Navigation
```tsx
<Navigation />
// Includes: Logo, menu, cart, user profile, auth button
```

### Hero 3D
```tsx
<Hero3D />
// Includes: 3D sphere, gradient blobs, CTA buttons
```

### Product Card
```tsx
<ProductCard 
  id="1"
  name="Product"
  image="url"
  price={999}
  rating={4.5}
  reviews={128}
  vendor="Vendor"
  inStock={true}
/>
```

### Dashboards
```tsx
<CustomerDashboard />  // For customers
<VendorDashboard />    // For vendors
<AdminDashboard />     // For admins
```

---

## 🚢 Deployment Checklist

- [ ] Firebase project created
- [ ] Environment variables set
- [ ] Local testing done (`npm run dev`)
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment vars added to Vercel
- [ ] Build successful
- [ ] Live URL working
- [ ] Auth tested
- [ ] Performance checked

---

## 🐛 Common Issues

### Firebase not connecting
- Check `.env.local` has all variables
- Verify Firebase project settings
- Ensure auth methods are enabled

### 3D hero not rendering
- Check WebGL support
- Clear browser cache
- Verify Three.js installed

### Build errors
- Delete `node_modules`
- Run `npm install` again
- Check TypeScript errors: `npm run type-check`

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `DEPLOYMENT_GUIDE.md` | Full deployment steps |
| `FINAL_OUTPUT_PREVIEW.md` | Feature showcase |
| `README_NEW.md` | Project documentation |
| `PROJECT_INDEX.md` | Complete file index |
| `VISUAL_SHOWCASE.md` | ASCII mockups |
| `../FRONTEND_TRANSFORMATION_SUMMARY.md` | Summary |

---

## 💻 Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm start                # Start prod server

# Quality
npm run lint             # Check for linting errors
npm run type-check       # TypeScript validation
```

---

## 🔍 Useful Links

- [Firebase Console](https://firebase.google.com)
- [Vercel Dashboard](https://vercel.com)
- [GitHub Repository](https://github.com)
- [Next.js Documentation](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)

---

## 📞 Support

1. **Documentation**: Check relevant `.md` files
2. **Code**: Review component source files
3. **Firebase**: Check Firebase console
4. **Vercel**: Check deployment logs
5. **Browser Console**: Check for JavaScript errors

---

## ✨ Features Summary

✅ 3D animated hero section
✅ Firebase authentication
✅ Admin dashboard
✅ Vendor dashboard
✅ Customer dashboard
✅ Responsive design
✅ Modern UI/UX
✅ Ready for deployment

---

## 🎯 Next Steps

1. Read `DEPLOYMENT_GUIDE.md`
2. Set up Firebase project
3. Configure `.env.local`
4. Run `npm run dev`
5. Test all features
6. Deploy to Vercel

---

**Status**: ✅ Ready to Deploy
**Last Updated**: Jan 28, 2026

---

For more details, see the comprehensive documentation files. Happy coding! 🚀
