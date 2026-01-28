# Frontend Deployment & Setup Guide

## 🚀 Project Overview

This is a modern, 3D-enhanced e-commerce marketplace frontend with:
- **3D Animated Hero Section** using Three.js and React Three Fiber
- **Firebase Authentication** with support for multiple user roles
- **Modern UI/UX** with Tailwind CSS and Framer Motion animations
- **Admin Dashboard** for platform management
- **Vendor Dashboard** for shop management
- **Customer Dashboard** for order tracking and preferences
- **Responsive Design** for all devices

## 📋 Prerequisites

Before deploying, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- Firebase project created
- Vercel account (for deployment)
- Git for version control

## 🔧 Local Development Setup

### 1. Install Dependencies

```bash
cd marketplace-frontend
npm install
```

### 2. Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication methods:
   - Email/Password
   - Google Sign-In
3. Create a Firestore database
4. Create Storage bucket
5. Copy your Firebase config

### 3. Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout with AuthProvider
│   ├── page.tsx             # Home page (old)
│   ├── page-new.tsx         # New enhanced home page
│   ├── dashboard/           # Customer dashboard
│   ├── vendor-dashboard/    # Vendor dashboard
│   └── admin-dashboard/     # Admin dashboard
├── components/
│   ├── Navigation.tsx       # Main navigation with auth
│   ├── Hero3D.tsx          # 3D hero section
│   ├── AuthModal.tsx       # Firebase auth modal
│   ├── ProductCard.tsx     # Product card component
│   ├── CustomerDashboard.tsx
│   ├── VendorDashboard.tsx
│   ├── AdminDashboard.tsx
│   ├── Header.tsx          # Old header
│   └── Footer.tsx          # Old footer
├── lib/
│   ├── firebase.ts         # Firebase config
│   ├── auth-context.tsx    # Auth context provider
│   ├── api-client.ts       # API client
│   └── stores.ts           # Zustand stores
└── styles/
    └── globals.css         # Global styles with animations
```

## 🎨 Key Features

### 1. 3D Hero Section
- Uses Three.js for 3D rendering
- Animated distort sphere with OrbitControls
- Gradient blob animations in background
- Responsive and performance-optimized

### 2. Authentication
- Firebase Email/Password authentication
- Google Sign-In support
- Role-based access control (Admin, Vendor, Customer)
- Persistent sessions

### 3. Dashboards
- **Customer Dashboard**: Order tracking, wishlist, saved addresses
- **Vendor Dashboard**: Sales analytics, product management, revenue tracking
- **Admin Dashboard**: User management, platform analytics, vendor oversight

### 4. Modern UI Components
- Animated product cards with 3D hover effects
- Glass-morphism navigation bar
- Smooth page transitions
- Responsive grid layouts
- Gradient backgrounds and text

## 🚢 Vercel Deployment

### 1. Prepare for Deployment

```bash
# Build locally to test
npm run build
```

### 2. Push to GitHub

```bash
git add .
git commit -m "Enhanced frontend with 3D, Firebase auth, and dashboards"
git push origin main
```

### 3. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select `marketplace-frontend` folder as root

### 4. Environment Variables in Vercel

In Vercel dashboard, add these environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_STRIPE_PUBLIC_KEY
```

### 5. Deploy

Click "Deploy" - Vercel will automatically:
- Install dependencies
- Run `npm run build`
- Start the Next.js server

Your site will be live at `https://your-project.vercel.app`

## 🔐 Firebase Security Rules

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Products collection (public read, vendor write)
    match /products/{document=**} {
      allow read: if true;
      allow write: if request.auth.token.vendor == true;
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /product-images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.vendor == true;
    }
    
    match /user-profiles/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

## 📊 Performance Optimization

- Images lazy loaded from Unsplash CDN
- Three.js 3D rendering optimized
- Tailwind CSS for minimal CSS bundle
- Next.js image optimization
- Framer Motion for efficient animations

## 🔗 API Integration

The frontend is configured to connect to the backend at:
- Development: `http://localhost:3001/api`
- Production: Set via `NEXT_PUBLIC_API_URL`

### Example API calls:

```typescript
// Get products
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);

// Create order
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderData),
});
```

## 🐛 Troubleshooting

### 3D Hero Not Rendering
- Check if Three.js is installed: `npm install three @react-three/fiber @react-three/drei`
- Clear browser cache and rebuild

### Firebase Not Connecting
- Verify environment variables are set correctly
- Check Firebase project settings
- Ensure authentication methods are enabled

### Build Errors
- Delete `node_modules` and `.next`
- Run `npm install` again
- Run `npm run build`

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Three.js](https://threejs.org/)
- [Vercel Documentation](https://vercel.com/docs)

## 🎯 Next Steps

1. Update page.tsx to use page-new.tsx content
2. Set up Firebase project with authentication
3. Configure environment variables
4. Test locally with `npm run dev`
5. Push to GitHub
6. Deploy to Vercel
7. Monitor performance in Vercel dashboard

## 📞 Support

For issues or questions:
1. Check the component documentation in each file
2. Review Firebase console for auth/database issues
3. Check Vercel deployment logs
4. Test backend API connectivity

---

**Happy deploying! 🚀**
