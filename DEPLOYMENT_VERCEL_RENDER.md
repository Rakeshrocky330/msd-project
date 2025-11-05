# Deployment Guide: Vercel (Frontend) & Render (Backend)

## Overview
- **Frontend**: Vite React app deployed on **Vercel**
- **Backend**: Express.js + Socket.io deployed on **Render**
- **Database**: MongoDB Atlas (Cloud)
- **Real-time**: Socket.io WebSocket communication

---

## 🚀 BACKEND DEPLOYMENT ON RENDER

### Prerequisites
- Render.com account (free tier available)
- GitHub repository pushed (✅ Already done)
- MongoDB Atlas connection string (✅ Already configured)

### Step 1: Create Render Web Service

1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Select **"Deploy an existing repository"**
4. Connect your GitHub account and select: `Rakeshrocky330/msd-project`
5. Configure the service:

   | Setting | Value |
   |---------|-------|
   | **Name** | msd-project-backend |
   | **Environment** | Node |
   | **Region** | (Select closest to you) |
   | **Branch** | main |
   | **Build Command** | `npm install` (or leave blank) |
   | **Start Command** | `node backend/server/index.js` |

### Step 2: Set Environment Variables

In Render dashboard, add these environment variables:

```
MONGODB_URI=mongodb+srv://231fa04a06:rakesh@123@cluster0.as0oqft.mongodb.net/?appName=Cluster0
JWT_SECRET=your-production-secret-key-change-this
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-vercel-frontend-url.vercel.app
EMAIL_USER=(if using email features)
EMAIL_PASSWORD=(if using email features)
```

### Step 3: Enable WebSocket

Render automatically supports WebSocket for Express apps. Socket.io will work out of the box.

### Step 4: Deploy

- Click **"Deploy"**
- Wait for build to complete (5-10 minutes)
- You'll get a URL like: `https://msd-project-backend.onrender.com`

### Backend Deployment Checklist
- [ ] Render account created
- [ ] GitHub repository connected
- [ ] Web Service created
- [ ] Environment variables set
- [ ] Build successful
- [ ] Service URL noted (e.g., `https://msd-project-backend.onrender.com`)

---

## 🎨 FRONTEND DEPLOYMENT ON VERCEL

### Prerequisites
- Vercel.com account (free tier available)
- GitHub repository pushed (✅ Already done)
- Backend URL from Render

### Step 1: Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click **"Import Project"**
3. Select **"Import Git Repository"**
4. Enter: `https://github.com/Rakeshrocky330/msd-project`
5. Click **"Import"**

### Step 2: Configure Vercel Settings

In the import dialog:

| Setting | Value |
|---------|-------|
| **Project Name** | msd-project-frontend |
| **Framework** | Vite |
| **Root Directory** | `frontend/vite` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### Step 3: Set Environment Variables

In Vercel dashboard (Settings → Environment Variables), add:

```
VITE_API_URL=https://msd-project-backend.onrender.com
REACT_APP_API_URL=https://msd-project-backend.onrender.com
```

### Step 4: Deploy

- Click **"Deploy"**
- Wait for build to complete (2-5 minutes)
- You'll get a URL like: `https://msd-project-frontend.vercel.app`

### Frontend Deployment Checklist
- [ ] Vercel account created
- [ ] GitHub repository imported
- [ ] Root directory set to `frontend/vite`
- [ ] Environment variables set with backend URL
- [ ] Build successful
- [ ] Frontend URL noted (e.g., `https://msd-project-frontend.vercel.app`)

---

## 🔗 POST-DEPLOYMENT CONFIGURATION

### Update Backend Environment Variable

Once you have the Vercel frontend URL, update the Render backend:

1. Go to Render dashboard
2. Select your service (msd-project-backend)
3. Go to **Environment** section
4. Update `CLIENT_URL` to your Vercel URL:
   ```
   CLIENT_URL=https://msd-project-frontend.vercel.app
   ```
5. Click **"Save"** (service will redeploy)

### Update Frontend API URLs (if needed)

Create `.env.production` in `frontend/vite/`:

```env
VITE_API_URL=https://msd-project-backend.onrender.com
REACT_APP_API_URL=https://msd-project-backend.onrender.com
```

Or set in Vercel dashboard after deployment.

---

## 📋 CONFIGURATION FILES NEEDED

### File 1: `render.yaml` (for Backend)
Create at root: `render.yaml`

### File 2: `vercel.json` (for Frontend)
Create/update: `vercel.json`

### File 3: Environment Files
- `backend/server/.env.production` (for production secrets)
- `frontend/vite/.env.production` (for production URLs)

---

## 🧪 Testing After Deployment

### Test Backend API
```bash
curl https://msd-project-backend.onrender.com/health
# Should return: {"status": "Server is running"}
```

### Test Frontend
1. Navigate to: `https://msd-project-frontend.vercel.app`
2. Try registering a new account
3. Login and verify features work
4. Check browser console for connection to backend

### Test Real-time Features
1. Open DevTools (F12)
2. Go to **Network** tab
3. Filter for **WS** (WebSocket)
4. You should see a Socket.io connection to the backend
5. Perform an action (create activity, etc.)
6. Verify real-time updates work across tabs

---

## 🛠️ TROUBLESHOOTING

### Frontend Can't Connect to Backend
**Problem**: CORS errors or connection timeout
**Solution**:
1. Verify `CLIENT_URL` in Render backend matches Vercel URL
2. Check backend URL in Vercel environment variables
3. Backend should have this CORS config:
   ```javascript
   const io = new Server(server, {
     cors: {
       origin: process.env.CLIENT_URL,
       methods: ["GET", "POST"]
     }
   })
   ```

### WebSocket Not Connecting
**Problem**: Socket.io connection fails
**Solution**:
1. Render supports WebSocket natively (no extra config needed)
2. Vercel supports WebSocket connections
3. Ensure `socket.io-client` version matches `socket.io` version on backend

### Database Connection Issues
**Problem**: MongoDB Atlas won't connect
**Solution**:
1. Add Render IPs to MongoDB Atlas network access:
   - Go to MongoDB Atlas → Network Access
   - Add IP: `0.0.0.0/0` (or specific Render IP)
   - Note: Less secure, but needed for serverless
2. Verify connection string format in `.env`

### Build Failures
**Problem**: Vercel/Render build fails
**Solution**:
1. Check build logs in dashboard
2. Ensure all dependencies in `package.json`
3. Verify Node version: `>=18 <23`
4. Check for typos in build/start commands

---

## 📊 DEPLOYMENT COMPARISON

| Feature | Vercel | Render |
|---------|--------|--------|
| **Frontend Hosting** | ✅ Excellent | ⚠️ Basic |
| **Backend Hosting** | ⚠️ Serverless | ✅ Excellent |
| **Free Tier** | ✅ Yes (limited) | ✅ Yes (limited) |
| **Auto Deploy** | ✅ Yes | ✅ Yes |
| **WebSocket** | ✅ Yes | ✅ Yes |
| **Database** | External | External |
| **Scaling** | Auto | Limited |

---

## 🔐 PRODUCTION SECURITY CHECKLIST

- [ ] Change `JWT_SECRET` to a strong, unique value
- [ ] Update `NODE_ENV=production` in Render
- [ ] Enable HTTPS (automatic on Vercel & Render)
- [ ] Add IP whitelist to MongoDB Atlas
- [ ] Use strong passwords for email (if enabled)
- [ ] Regularly rotate `JWT_SECRET`
- [ ] Monitor error logs in both platforms
- [ ] Set up email notifications for build failures

---

## 📞 SUPPORT LINKS

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Socket.io WebSocket**: https://socket.io/docs/v4/socket-io-protocol/
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/

---

## 🎯 NEXT STEPS

1. **Deploy Backend** on Render first
2. **Get Backend URL** from Render
3. **Deploy Frontend** on Vercel with backend URL
4. **Update Backend** with Frontend URL
5. **Test** all features end-to-end
6. **Monitor** logs and errors
7. **Scale** as needed (paid plans)

---

**Status**: Ready for deployment ✅
**Last Updated**: November 5, 2025
**Deployment Architecture**: Vercel (Frontend) → Express Backend (Render) ← MongoDB Atlas
