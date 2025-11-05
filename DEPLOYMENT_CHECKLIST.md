# 🚀 STEP-BY-STEP DEPLOYMENT GUIDE

## DEPLOYMENT PLAN
- **Frontend**: React (Vite) → **Vercel**
- **Backend**: Express.js + Socket.io → **Render**
- **Database**: MongoDB Atlas (already configured)

---

## PHASE 1: BACKEND DEPLOYMENT ON RENDER

### Step 1.1: Create Render Account
- [ ] Go to https://render.com
- [ ] Click "Sign Up"
- [ ] Use GitHub account (Recommended) or email
- [ ] Complete registration

### Step 1.2: Deploy Backend Service
- [ ] In Render dashboard, click **"New +"** → **"Web Service"**
- [ ] Select **"Connect a repository"**
- [ ] Authorize GitHub and select `Rakeshrocky330/msd-project`
- [ ] Configure service:
  - **Name**: `msd-project-backend`
  - **Environment**: `Node`
  - **Region**: Select closest to your users (or `oregon`)
  - **Branch**: `main`
  - **Build Command**: Leave blank or `npm install`
  - **Start Command**: `node backend/server/index.js`
- [ ] Click **"Deploy Web Service"**
- [ ] Wait for deployment (5-10 minutes)

### Step 1.3: Set Environment Variables
- [ ] In Render service dashboard, go to **"Environment"** tab
- [ ] Add each environment variable:

```
KEY: MONGODB_URI
VALUE: mongodb+srv://231fa04a06:rakesh@123@cluster0.as0oqft.mongodb.net/?appName=Cluster0

KEY: JWT_SECRET
VALUE: [Generate a strong 32+ character secret]

KEY: NODE_ENV
VALUE: production

KEY: PORT
VALUE: 5000

KEY: CLIENT_URL
VALUE: [Leave empty for now, update after Vercel deployment]

KEY: EMAIL_USER
VALUE: [Optional - leave empty if not using email]

KEY: EMAIL_PASSWORD
VALUE: [Optional - leave empty if not using email]
```

- [ ] Click "Save Changes" (service will redeploy)
- [ ] Wait for deployment to complete
- [ ] Copy the backend URL (format: `https://msd-project-backend.onrender.com`)

### Step 1.4: Verify Backend Deployment
- [ ] Open browser and navigate to: `https://[your-backend-url]/health`
- [ ] Should see: `{"status": "Server is running"}`
- [ ] ✅ Backend deployment complete!

---

## PHASE 2: FRONTEND DEPLOYMENT ON VERCEL

### Step 2.1: Create Vercel Account
- [ ] Go to https://vercel.com
- [ ] Click "Sign Up"
- [ ] Use GitHub account (Recommended)
- [ ] Complete registration

### Step 2.2: Import Project
- [ ] In Vercel dashboard, click **"Import Project"**
- [ ] Select **"Import Git Repository"**
- [ ] Enter: `https://github.com/Rakeshrocky330/msd-project`
- [ ] Click **"Import"**

### Step 2.3: Configure Build Settings
- [ ] **Project Name**: `msd-project-frontend`
- [ ] **Framework**: `Vite`
- [ ] **Root Directory**: `frontend/vite`
- [ ] **Build Command**: `npm run build`
- [ ] **Install Command**: `npm install`
- [ ] **Output Directory**: `dist`

### Step 2.4: Set Environment Variables
- [ ] Click **"Environment Variables"**
- [ ] Add these variables:

```
KEY: VITE_API_URL
VALUE: https://[your-backend-url-from-step-1.4]

KEY: REACT_APP_API_URL
VALUE: https://[your-backend-url-from-step-1.4]

KEY: VITE_SOCKET_URL
VALUE: https://[your-backend-url-from-step-1.4]

KEY: REACT_APP_SOCKET_URL
VALUE: https://[your-backend-url-from-step-1.4]
```

- [ ] Click **"Deploy"**
- [ ] Wait for deployment (2-5 minutes)
- [ ] Copy the frontend URL (format: `https://msd-project-frontend.vercel.app`)

### Step 2.5: Verify Frontend Deployment
- [ ] Navigate to: `https://[your-frontend-url]`
- [ ] Page should load without errors
- [ ] Check browser console (F12) for errors
- [ ] ✅ Frontend deployment complete!

---

## PHASE 3: POST-DEPLOYMENT CONFIGURATION

### Step 3.1: Update Backend with Frontend URL
- [ ] Go back to Render dashboard
- [ ] Select `msd-project-backend` service
- [ ] Go to **"Environment"** tab
- [ ] Find `CLIENT_URL` variable
- [ ] Update value to: `https://[your-frontend-url-from-step-2.4]`
- [ ] Click "Save Changes"
- [ ] Wait for backend to redeploy (2-3 minutes)

### Step 3.2: Test Connection Between Services
- [ ] Go to frontend URL in browser
- [ ] Open DevTools (F12)
- [ ] Go to **Console** tab
- [ ] Look for messages like:
  ```
  Socket connected: ...
  User connected: ...
  ```
- [ ] If no errors, connection is working! ✅

---

## PHASE 4: FULL TESTING

### Test 4.1: Register New Account
- [ ] Go to frontend: `https://[your-frontend-url]`
- [ ] Click "Register"
- [ ] Fill in: Email, Password, Name
- [ ] Click "Register"
- [ ] Should see: "Registration successful" or similar
- [ ] ✅ Registration working

### Test 4.2: Login
- [ ] Click "Login"
- [ ] Enter email and password from Test 4.1
- [ ] Click "Login"
- [ ] Should redirect to Dashboard
- [ ] ✅ Login working

### Test 4.3: Create Activity (Real-time Test)
- [ ] From Dashboard, create a new activity/log
- [ ] Fill in required fields
- [ ] Submit
- [ ] Should appear immediately (real-time update)
- [ ] Open same app in another browser tab
- [ ] New activity should appear there too (if not refreshed)
- [ ] ✅ Real-time working

### Test 4.4: Check Analytics
- [ ] Go to Analytics page
- [ ] Should show stats from your activities
- [ ] Stats should update in real-time when you create new activities
- [ ] ✅ Analytics working

### Test 4.5: Monitor Console for Errors
- [ ] Keep DevTools open while testing
- [ ] Look for red error messages
- [ ] Network errors, CORS errors, or undefined references
- [ ] If errors appear, check:
  - Backend URL is correct in environment variables
  - MongoDB connection is working (check Render logs)
  - No typos in environment variables

---

## TROUBLESHOOTING CHECKLIST

### Issue: Frontend shows "Cannot reach backend"
- [ ] Check backend URL in Vercel environment variables
- [ ] Verify backend is still running (check Render dashboard)
- [ ] Try accessing backend health endpoint directly: `https://[backend-url]/health`
- [ ] Check browser console for exact error message

### Issue: Socket.io connection fails
- [ ] Ensure both frontend and backend are deployed
- [ ] Check `CLIENT_URL` in backend is correct
- [ ] Verify WebSocket is enabled (Render supports this by default)
- [ ] Check browser console network tab for WS connections

### Issue: Database errors (Cannot connect to MongoDB)
- [ ] Check `MONGODB_URI` is correct in Render
- [ ] Go to MongoDB Atlas → Network Access
- [ ] Make sure 0.0.0.0/0 is whitelisted (or add Render's IP)
- [ ] Test connection by creating account (should trigger DB write)

### Issue: Build fails on Vercel
- [ ] Check Vercel deployment logs (available in dashboard)
- [ ] Make sure root directory is set to `frontend/vite`
- [ ] Verify `npm run build` works locally: 
  ```bash
  cd frontend/vite && npm run build
  ```
- [ ] Check for TypeScript/JavaScript errors

### Issue: Build fails on Render
- [ ] Check Render deployment logs
- [ ] Ensure backend dependencies are in `package.json`
- [ ] Test locally:
  ```bash
  npm install
  node backend/server/index.js
  ```
- [ ] Verify all required environment variables are set

---

## MONITORING & MAINTENANCE

### Daily/Weekly Checks
- [ ] Check Render service logs for errors
- [ ] Check Vercel deployment logs
- [ ] Test login and core features
- [ ] Monitor MongoDB usage (in Atlas dashboard)

### Monthly Tasks
- [ ] Review and rotate JWT_SECRET
- [ ] Update dependencies (npm update)
- [ ] Check for security vulnerabilities
- [ ] Scale services if needed (upgrade plan)

### Logging & Debugging
- **Render Logs**: Dashboard → Service → Logs
- **Vercel Logs**: Dashboard → Project → Deployments
- **Browser Console**: F12 → Console tab
- **Network Tab**: F12 → Network tab (check requests)
- **MongoDB Logs**: MongoDB Atlas dashboard

---

## DEPLOYMENT SUMMARY

| Component | Status | URL |
|-----------|--------|-----|
| Frontend | ✅/❌ | https://[your-frontend-url] |
| Backend | ✅/❌ | https://[your-backend-url] |
| Database | ✅ | MongoDB Atlas |
| Real-time | ✅/❌ | Socket.io |

---

## PRODUCTION SECURITY CHECKLIST

- [ ] JWT_SECRET is strong (32+ characters, random)
- [ ] No hardcoded secrets in code
- [ ] CLIENT_URL matches actual frontend domain
- [ ] MONGODB_URI uses strong credentials
- [ ] HTTPS enabled (automatic on Vercel & Render)
- [ ] CORS properly configured
- [ ] Environment variables marked as sensitive in dashboards
- [ ] Git credentials removed from commits

---

## ROLLBACK PLAN

If something goes wrong:

1. **Render Dashboard**:
   - Go to "Deployments"
   - Select previous successful deployment
   - Click "Redeploy"

2. **Vercel Dashboard**:
   - Go to "Deployments"
   - Select previous successful deployment
   - Click "Redeploy"

3. **Database**:
   - MongoDB has automatic backups
   - Can restore from MongoDB Atlas if needed

---

## SUPPORT & RESOURCES

- **Render Support**: https://render.com/support
- **Vercel Support**: https://vercel.com/support
- **MongoDB Support**: https://www.mongodb.com/support
- **GitHub Issues**: https://github.com/Rakeshrocky330/msd-project/issues

---

**Last Updated**: November 5, 2025
**Status**: Ready for deployment
**Next Step**: Start Phase 1 deployment ↑
