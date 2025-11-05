# Backend Deployment on Render - Complete Guide

## Overview
Deploy your Express.js backend API on Render with MongoDB Atlas and Socket.io real-time features.

---

## Prerequisites

✅ **What You Need:**
- GitHub repository pushed with backend code
- Render account (free tier available)
- Backend code in `backend/server/` folder
- MongoDB Atlas cluster (already configured)
- Node.js >=18 <23

---

## Step 1: Prepare Your Backend Locally

### Navigate to Backend Directory
```bash
cd backend/server
```

### Install Dependencies
```bash
npm install
# or
pnpm install
```

### Verify Environment Variables
```bash
# Check .env file exists
Test-Path .env
cat .env
```

Expected `.env` content:
```properties
MONGODB_URI=mongodb+srv://231fa04a06:rakesh%40123@cluster0.as0oqft.mongodb.net/?appName=Cluster0
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
PORT=5000
EMAIL_USER=
EMAIL_PASSWORD=
CLIENT_URL=http://localhost:3000
```

### Test Locally
```bash
npm start
# or
pnpm start
```

Expected output:
```
✅ Server running on http://localhost:5000
✅ MongoDB connected
✅ Socket.io initialized
```

---

## Step 2: Create Render Configuration

### Option A: Using render.yaml (Recommended)

Create file at root: `render.yaml`

```yaml
services:
  - type: web
    name: msd-project-c39k
    runtime: node
    plan: free
    region: ohio
    branch: main
    buildCommand: cd backend/server && npm install --production
    startCommand: cd backend/server && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: MONGODB_URI
        fromDatabase:
          name: msd-project-db
          property: connectionString
      - key: JWT_SECRET
        sync: false
      - key: CLIENT_URL
        value: https://msd-project-frontend.onrender.com
      - key: SOCKET_IO_CORS_ORIGIN
        value: https://msd-project-frontend.onrender.com
      - key: API_BASE_URL
        value: https://msd-project-c39k.onrender.com
```

### Option B: Manual Setup (if not using render.yaml)

Skip this section if using render.yaml above.

---

## Step 3: Deploy on Render Dashboard

### 3.1 Go to Render Dashboard
```
https://dashboard.render.com
```

### 3.2 Create New Web Service

**Steps:**
1. Click **"+ New"** button
2. Select **"Web Service"**
3. Connect GitHub:
   - Click **"Connect Repository"**
   - Search: `msd-project`
   - Click **"Connect"**

### 3.3 Configure Service Details

**Name:**
```
msd-project-c39k
```

**Region:**
```
Ohio (or closest to your location)
```

**Branch:**
```
main
```

**Runtime:**
```
Node
```

**Build Command:**
```bash
cd backend/server && npm install --production
```

**Start Command:**
```bash
cd backend/server && npm start
```

**Plan:**
```
Free (or Starter for better performance)
```

### 3.4 Add Environment Variables

Click **"Add Environment Variable"** for each:

#### Variable 1: NODE_ENV
```
Key:    NODE_ENV
Value:  production
```

#### Variable 2: PORT
```
Key:    PORT
Value:  5000
```

#### Variable 3: MONGODB_URI
```
Key:    MONGODB_URI
Value:  mongodb+srv://231fa04a06:rakesh%40123@cluster0.as0oqft.mongodb.net/?appName=Cluster0
```

#### Variable 4: JWT_SECRET
```
Key:    JWT_SECRET
Value:  change-this-to-a-strong-secret-key-in-production-at-least-32-characters
```

#### Variable 5: CLIENT_URL
```
Key:    CLIENT_URL
Value:  https://msd-project-frontend.onrender.com
```

#### Variable 6: SOCKET_IO_CORS_ORIGIN
```
Key:    SOCKET_IO_CORS_ORIGIN
Value:  https://msd-project-frontend.onrender.com
```

#### Variable 7: API_BASE_URL
```
Key:    API_BASE_URL
Value:  https://msd-project-c39k.onrender.com
```

### 3.5 Review and Deploy

1. **Verify all settings:**
   - ✅ Service name: `msd-project-c39k`
   - ✅ Region: `Ohio`
   - ✅ Branch: `main`
   - ✅ Build Command: `cd backend/server && npm install --production`
   - ✅ Start Command: `cd backend/server && npm start`
   - ✅ All 7 environment variables added

2. **Click:** **"Create Web Service"**

3. **Wait:** 5-10 minutes for deployment

---

## Step 4: Verify Deployment

### Check Deployment Status

1. Go to Render Dashboard: https://dashboard.render.com
2. Select service: `msd-project-c39k`
3. Watch status:
   - 🟡 Building... (2-3 minutes)
   - 🟡 Deploying... (2-3 minutes)
   - 🟢 Live (success!)

### Check Logs

1. Click **"Logs"** tab
2. Look for:
   ```
   ✅ Server running on http://0.0.0.0:5000
   ✅ MongoDB connected
   ✅ Socket.io initialized
   ```

### Test Backend API

#### Test 1: Health Check
```bash
curl https://msd-project-c39k.onrender.com/health
```

Expected response:
```json
{
  "status": "Server is running",
  "timestamp": "2025-11-05T09:30:00.000Z"
}
```

#### Test 2: In Browser Console
```javascript
fetch('https://msd-project-c39k.onrender.com/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend connected:', d))
  .catch(e => console.error('❌ Error:', e.message))
```

#### Test 3: Check Environment
```javascript
fetch('https://msd-project-c39k.onrender.com/api/config')
  .then(r => r.json())
  .then(d => console.log('Config:', d))
```

---

## Step 5: Environment Variables Reference

### All Backend Variables Explained

| Variable | Value | Purpose |
|----------|-------|---------|
| `NODE_ENV` | `production` | Build optimization |
| `PORT` | `5000` | Server port |
| `MONGODB_URI` | `mongodb+srv://...` | Database connection string |
| `JWT_SECRET` | `strong-secret-key` | Session/token encryption |
| `CLIENT_URL` | `https://frontend-url.onrender.com` | Frontend URL (CORS) |
| `SOCKET_IO_CORS_ORIGIN` | `https://frontend-url.onrender.com` | WebSocket CORS origin |
| `API_BASE_URL` | `https://backend-url.onrender.com` | Self-reference for redirects |

### Development vs Production

**Development (.env):**
```properties
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
SOCKET_IO_CORS_ORIGIN=http://localhost:3000
```

**Production (Render Environment):**
```properties
NODE_ENV=production
PORT=5000
CLIENT_URL=https://msd-project-frontend.onrender.com
SOCKET_IO_CORS_ORIGIN=https://msd-project-frontend.onrender.com
```

---

## Step 6: Fix CORS Configuration

### Update backend/server/index.js

Ensure CORS is configured correctly:

```javascript
import cors from 'cors';

const corsOptions = {
  origin: [
    'http://localhost:3000',      // Local development
    'http://localhost:5173',      // Vite frontend dev
    'https://msd-project-frontend.onrender.com',  // Production frontend
    'https://msd-project-c39k.onrender.com'       // Production backend
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### Update Socket.io Configuration

```javascript
import { Server } from 'socket.io';

const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://msd-project-frontend.onrender.com',
      'https://msd-project-c39k.onrender.com'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});
```

---

## Step 7: Monitor Backend

### View Real-time Logs

```
Render Dashboard → Services → msd-project-c39k → Logs
```

### Check Error Logs

```
Render Dashboard → Services → msd-project-c39k → Logs → Filter: "error"
```

### Monitor Performance

```
Render Dashboard → Services → msd-project-c39k → Metrics
```

---

## Common Issues & Solutions

### Issue 1: Build Fails - "npm ERR!"

**Cause:** Missing dependencies or build tools

**Solution:**
```bash
# Update build command to include npm ci
cd backend/server && npm ci --production
```

### Issue 2: Port Already in Use

**Cause:** Port 5000 conflict

**Solution:** Update PORT variable in Render to `8080`:
```
PORT = 8080
```

### Issue 3: MongoDB Connection Fails

**Cause:** URL encoding or network issues

**Solution:**
1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Check IP whitelist includes `0.0.0.0/0`
3. Verify connection string format
4. Use encoded credentials: `user:pass%40123`

### Issue 4: CORS Errors from Frontend

**Cause:** Frontend URL not in CORS whitelist

**Solution:**
1. Get frontend URL from Render dashboard
2. Add to backend environment variables:
   ```
   CLIENT_URL = https://actual-frontend-url.onrender.com
   ```
3. Update `index.js` CORS config
4. Redeploy backend

### Issue 5: Socket.io Connection Fails

**Cause:** WebSocket URL mismatch

**Solution:**
1. Verify `SOCKET_IO_CORS_ORIGIN` matches backend URL
2. Ensure frontend uses same backend URL for Socket.io
3. Check browser console for connection errors
4. Test: 
   ```javascript
   fetch('https://msd-project-c39k.onrender.com/health')
   ```

---

## Git Workflow

### Prepare for Deployment

```bash
# Navigate to project root
cd 'c:\Users\user\OneDrive\ドキュメント\a06 msd'

# Check backend changes
git status

# Stage all changes
git add -A

# Commit changes
git commit -m "Backend deployment configuration for Render"
```

### Push to GitHub

```bash
# Push to main branch
git push origin main
```

### Trigger Render Deployment

```bash
# Render automatically detects push
# Check deployment status at:
# https://dashboard.render.com/services/msd-project-c39k
```

---

## Deployment Checklist

- [ ] Backend code in `backend/server/` pushed to GitHub
- [ ] `package.json` exists in `backend/server/`
- [ ] `index.js` or `server.js` is entry point
- [ ] `.env` file exists locally (not in git)
- [ ] All 7 environment variables added in Render
- [ ] Build command tested locally: `npm install --production`
- [ ] Start command tested locally: `npm start`
- [ ] CORS configured for frontend URL
- [ ] Socket.io CORS configured
- [ ] MongoDB connection string verified
- [ ] Service status shows "Live" in Render dashboard
- [ ] Health check endpoint responds
- [ ] Frontend can connect to backend API

---

## Quick Reference

### URLs

| Service | URL |
|---------|-----|
| Backend API | `https://msd-project-c39k.onrender.com` |
| Backend Health | `https://msd-project-c39k.onrender.com/health` |
| Render Dashboard | `https://dashboard.render.com` |
| MongoDB Atlas | `https://cloud.mongodb.com` |
| GitHub Repo | `https://github.com/Rakeshrocky330/msd-project` |

### Common Commands

```bash
# Local testing
npm install
npm start

# Build check
npm run build

# Test API locally
curl http://localhost:5000/health

# View Render logs
# Via dashboard → Services → Logs
```

### Environment Variables Summary

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://231fa04a06:rakesh%40123@cluster0.as0oqft.mongodb.net/?appName=Cluster0
JWT_SECRET=change-this-in-production
CLIENT_URL=https://msd-project-frontend.onrender.com
SOCKET_IO_CORS_ORIGIN=https://msd-project-frontend.onrender.com
API_BASE_URL=https://msd-project-c39k.onrender.com
```

---

## Post-Deployment Tests

### Test 1: Health Check
```bash
curl https://msd-project-c39k.onrender.com/health
```

### Test 2: Socket.io Connection
```javascript
// In frontend console
const socket = io('https://msd-project-c39k.onrender.com');
socket.on('connect', () => console.log('✅ Socket.io connected'));
socket.on('disconnect', () => console.log('❌ Socket.io disconnected'));
```

### Test 3: User Registration
1. Go to frontend: `https://msd-project-frontend.onrender.com`
2. Click "Register"
3. Create test account
4. Check MongoDB Atlas for new user document

### Test 4: API Calls
```javascript
// Test authentication
fetch('https://msd-project-c39k.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', password: 'pass' })
})
.then(r => r.json())
.then(d => console.log('Login response:', d))
```

---

## Pricing

- **Free Tier:** $0/month
  - 1 free web service (spins down after 15 min inactivity)
  - Limited compute resources
  - Good for development/testing

- **Starter Plan:** $7/month
  - Always-on service
  - Better performance
  - Recommended for production

---

## Support & Documentation

- **Render Docs:** https://render.com/docs
- **Render Support:** https://render.com/support
- **Backend Repository:** https://github.com/Rakeshrocky330/msd-project
- **MongoDB Docs:** https://docs.mongodb.com

---

## Next Steps

1. ✅ Deploy backend on Render
2. ✅ Verify health check endpoint
3. ✅ Test MongoDB connection
4. ✅ Configure frontend environment variables
5. ✅ Deploy frontend on Render
6. ✅ Test full-stack integration
7. ✅ Monitor logs and performance
8. ✅ Set up custom domain (optional)

