# 🛍️ Marketplace Frontend

A modern, 3D-enhanced e-commerce marketplace frontend with Firebase authentication, real-time analytics, and role-based dashboards.

## ✨ Features

### 🎨 **Modern UI/UX**
- Beautiful 3D animated hero section with Three.js
- Smooth animations with Framer Motion
- Responsive design for all devices
- Glass-morphism effects
- Gradient text and backgrounds

### 🔐 **Authentication**
- Firebase Email/Password authentication
- Google Sign-In support
- Role-based access control
- Persistent user sessions
- Secure token management

### 📊 **Dashboards**
- **Customer Dashboard**: Order tracking, wishlist, saved addresses
- **Vendor Dashboard**: Sales analytics, product management, revenue tracking
- **Admin Dashboard**: User management, platform analytics, vendor oversight

### 🎯 **Key Pages**
- Home page with featured products
- Product listing and filtering
- Vendor profiles
- User profiles
- Cart and checkout
- Order tracking

### ⚡ **Performance**
- Next.js optimized builds
- Image lazy loading
- Code splitting
- Efficient animations
- Database indexing ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project
- Vercel account (optional, for deployment)

### Local Development

1. **Clone and Install**
```bash
cd marketplace-frontend
npm install
```

2. **Configure Firebase**
- Create Firebase project at firebase.google.com
- Enable Authentication (Email/Password, Google)
- Copy Firebase config

3. **Set Environment Variables**
```bash
cp .env.example .env.local
# Update .env.local with your Firebase config
```

4. **Start Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page (legacy)
│   ├── page-new.tsx       # New enhanced home page
│   ├── dashboard/         # Customer dashboard
│   ├── vendor-dashboard/  # Vendor dashboard
│   └── admin-dashboard/   # Admin dashboard
├── components/            # React components
│   ├── Navigation.tsx
│   ├── Hero3D.tsx
│   ├── AuthModal.tsx
│   ├── ProductCard.tsx
│   ├── CustomerDashboard.tsx
│   ├── VendorDashboard.tsx
│   ├── AdminDashboard.tsx
│   └── [other components]
├── lib/                   # Utility functions & hooks
│   ├── firebase.ts       # Firebase configuration
│   ├── auth-context.tsx  # Auth provider
│   ├── api-client.ts     # API client
│   └── stores.ts         # Zustand stores
└── styles/               # Global styles
    └── globals.css
```

## 🎨 Design System

### Colors
- **Primary**: Purple to Pink gradient
- **Background**: White to Gray-50
- **Text**: Gray-900 to Gray-600
- **Accents**: Green, Blue, Red

### Typography
- **Headings**: Bold, 4xl-5xl
- **Body**: Regular, base-lg
- **Accent**: Gradient text

### Components
- **Cards**: Rounded-2xl with shadow
- **Buttons**: Gradient with hover effects
- **Forms**: Clean, minimal design
- **Modals**: Center-aligned with backdrop

## 🔑 Key Technologies

| Technology | Purpose | Version |
|-----------|---------|---------|
| Next.js | Framework | 14.0 |
| React | UI Library | 18.2 |
| Tailwind CSS | Styling | 3.3 |
| Framer Motion | Animations | 10.16 |
| Three.js | 3D Graphics | r158 |
| Firebase | Backend Services | 10.7 |
| Zustand | State Management | 4.4 |
| Recharts | Charts | 2.10 |
| Lucide React | Icons | 0.295 |

## 📝 Environment Variables

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Optional: Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_key
```

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy on Vercel**
- Go to vercel.com
- Import GitHub repository
- Add environment variables
- Click Deploy

3. **Monitor**
- Check Vercel dashboard for builds
- Monitor performance metrics
- View logs for errors

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Detailed deployment instructions
- [Final Output Preview](./FINAL_OUTPUT_PREVIEW.md) - Visual preview of all features
- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com)

## 🔒 Security

- Firebase security rules configured
- Environment variables for sensitive data
- XSS protection with React's built-in safety
- CSRF protection with Next.js
- Secure headers configured
- Input validation on forms

## ⚙️ Available Scripts

```bash
# Development
npm run dev          # Start dev server on :3000

# Production
npm run build        # Build for production
npm start            # Start production server

# Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

## 🐛 Troubleshooting

### 3D Hero Not Rendering
- Ensure Three.js is installed
- Check browser WebGL support
- Clear browser cache

### Firebase Connection Error
- Verify Firebase config in .env.local
- Check Firebase project settings
- Ensure auth methods are enabled

### Build Fails
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear `.next` folder

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For issues or questions:
1. Check documentation files
2. Review component source code
3. Check Firebase console
4. Contact the development team

---

**Built with ❤️ for modern e-commerce**
