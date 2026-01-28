Local development (port 4848)

1. Ensure dependencies are installed:

```powershell
Push-Location 'd:\Documents\E-Commerce\marketplace-frontend'
npm install
```

2. Run dev server on port 4848:

```powershell
npm run dev:4848
# or
npx next dev -p 4848
```

3. Open http://localhost:4848


Firebase Google Sign-In (setup)

1. In the Firebase Console -> Authentication -> Sign-in method, enable Google provider.
2. Add authorized domains: `localhost` and your `vercel` domain (e.g. `your-project.vercel.app`).
3. Set the following env vars in `.env.local` or Vercel dashboard:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

4. The frontend already uses the `GoogleAuthProvider` with `signInWithPopup`. No code changes needed; ensure the above env vars are set.


Deploy to Vercel

1. Commit your branch and push to GitHub/GitLab.
2. In Vercel, create a new project -> import your repository.
3. Set environment variables in Vercel project settings (use the same keys as in `.env.local`).
4. Use the default build command (`npm run build`) and output directory is handled by Next.js.
5. After deploy, add your Vercel domain to Firebase authorized domains.


Notes & Troubleshooting

- If `npm install` fails due to disk space, free space and retry.
- On Windows, to run port-specific dev server without the script, use:

```powershell
npx next dev -p 4848
```

- If you want sign-in to redirect back to dashboard routes, update `AuthModal` or add `onAuthStateChanged` logic to redirect after login.
