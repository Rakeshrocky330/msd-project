# Frontend Deployment on Render - Complete Guide

## Overview
Deploy your Vite React frontend on Render as a static site or Node.js service with real-time Socket.io integration.

---

## Prerequisites

✅ **What You Need:**
- GitHub repository pushed with code
- Render account (free tier available)
- Frontend code in `frontend/vite/` folder
- Package manager: pnpm
- Node.js >=18 <23

---

## Option 1: Deploy as Static Site (Recommended for Pure Frontend)

### Step 1: Prepare Your Frontend

```bash
cd frontend/vite
pnpm install
pnpm run build
```

This creates a `dist/` folder with optimized production build.

### Step 2: Create Render Configuration (render-frontend.yaml)

Create file at root: `render-frontend.yaml`

```yaml
services:
  - type: web
    name: msd-project-frontend
    env: static
    buildCommand: cd frontend/vite && pnpm install --frozen-lockfile && pnpm run build
    staticPublishPath: frontend/vite/dist
    envVars:
      - key: VITE_API_URL
        value: https://msd-project-c39k.onrender.com
      - key: VITE_SOCKET_URL
        value: https://msd-project-c39k.onrender.com
```

### Step 3: Deploy on Render Dashboard

1. **Go to Render Dashboard:** https://dashboard.render.com
2. **Click:** "+ New" → "Static Site"
3. **Connect GitHub:** Select repository `msd-project`
4. **Configure:**
   - **Name:** `msd-project-frontend`
   - **Branch:** `main`
   - **Build Command:** `cd frontend/vite && pnpm install --frozen-lockfile && pnpm run build`
   - **Publish Directory:** `frontend/vite/dist`
5. **Environment Variables:** (Add these)
   ```
   VITE_API_URL = https://msd-project-c39k.onrender.com
   VITE_SOCKET_URL = https://msd-project-c39k.onrender.com
   ```
6. **Click:** "Create Static Site"
7. **Wait:** 3-5 minutes for deployment

---

## Option 2: Deploy as Node.js Service (Recommended for Real-Time Features)

### Step 1: Create Render Configuration (render.yaml)

```yaml
services:
  - type: web
    name: msd-project-frontend
    runtime: node
    plan: free
    branch: main
    buildCommand: cd frontend/vite && pnpm install --frozen-lockfile && pnpm run build
    startCommand: cd frontend/vite && pnpm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: VITE_API_URL
        value: https://msd-project-c39k.onrender.com
      - key: VITE_SOCKET_URL
        value: https://msd-project-c39k.onrender.com
      - key: PORT
        value: 3000
```

### Step 2: Update package.json in frontend/vite

Add production start script:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start": "node -e \"const express = require('express'); const app = express(); app.use(express.static('dist')); app.get('*', (req,res) => res.sendFile(__dirname+'/dist/index.html')); app.listen(process.env.PORT || 3000, () => console.log('Server running on port', process.env.PORT || 3000));\" "
  }
}
```

Or better, create `server.js` in `frontend/vite/`:

```javascript
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback - all routes serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
  console.log(`API Server: ${process.env.VITE_API_URL}`);
  console.log(`Socket URL: ${process.env.VITE_SOCKET_URL}`);
});
```

Then update start script:

```json
"start": "node server.js"
```

### Step 3: Deploy on Render Dashboard

1. **Go to Render Dashboard:** https://dashboard.render.com
2. **Click:** "+ New" → "Web Service"
3. **Connect GitHub:** Select repository `msd-project`
4. **Configure:**
   - **Name:** `msd-project-frontend`
   - **Region:** `Ohio` (or closest to you)
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `cd frontend/vite && pnpm install --frozen-lockfile && pnpm run build`
   - **Start Command:** `cd frontend/vite && pnpm start`
   - **Plan:** `Free` or `Starter`
5. **Environment Variables:** (Add)
   ```
   NODE_ENV = production
   VITE_API_URL = https://msd-project-c39k.onrender.com
   VITE_SOCKET_URL = https://msd-project-c39k.onrender.com
   PORT = 3000
   ```
6. **Click:** "Create Web Service"
7. **Wait:** 5-10 minutes for deployment

---

## Step-by-Step Commands

### Local Preparation

```bash
# Navigate to project root
cd c:\Users\user\OneDrive\ドキュメント\a06 msd

# Navigate to frontend
cd frontend/vite

# Install dependencies
pnpm install

# Build for production
pnpm run build

# Verify build
ls dist/

# Test locally
pnpm preview
```

### Git Push to Trigger Deploy

```bash
# From project root
git add -A
git commit -m "Frontend deployment setup with Render configuration"
git push origin main
```

---

## Verify Deployment

### Check Render Logs

1. Go to https://dashboard.render.com
2. Select your service: `msd-project-frontend`
3. Click "Logs" tab
4. Look for: "Server running on port 3000"

### Test Frontend URL

```bash
curl https://your-frontend-url.onrender.com
```

Should return HTML content of your app.

### Test API Connection

Open browser and go to: `https://your-frontend-url.onrender.com`
- Should load React app
- Check browser console for Socket.io connection status
- Try registering/logging in

---

## Environment Variables Explanation

| Variable | Value | Purpose |
|----------|-------|---------|
| `VITE_API_URL` | `https://msd-project-c39k.onrender.com` | Backend API base URL |
| `VITE_SOCKET_URL` | `https://msd-project-c39k.onrender.com` | WebSocket server URL |
| `NODE_ENV` | `production` | Build optimization mode |
| `PORT` | `3000` | Server port (Render overrides) |

---

## Troubleshooting

### Issue: Build Fails

**Solution:**
```bash
# Increase timeout in render.yaml
buildCommand: cd frontend/vite && pnpm install --frozen-lockfile && pnpm run build --timeout=300000
```

### Issue: App Shows 404

**Solution:** Ensure `server.js` exists and all routes fallback to `index.html`

### Issue: Socket.io Not Connecting

**Solution:** Check environment variables match backend URL exactly

### Issue: CORS Errors

**Solution:** Add to backend `server/index.js`:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://your-frontend-url.onrender.com',
    'https://msd-project-c39k.onrender.com'
  ],
  credentials: true
};
app.use(cors(corsOptions));
```

---

## Production Checklist

- [ ] Frontend code pushed to GitHub
- [ ] `package.json` has correct build and start scripts
- [ ] Environment variables set in Render
- [ ] `server.js` or express setup for SPA routing
- [ ] Backend URL verified in environment variables
- [ ] CORS configured on backend
- [ ] Test user registration on deployed frontend
- [ ] Test Socket.io connection in browser console
- [ ] Check Render logs for errors

---

## Quick Links

- **Render Dashboard:** https://dashboard.render.com
- **Backend Service:** https://msd-project-c39k.onrender.com
- **Render Docs:** https://render.com/docs

---

## Next Steps After Deployment

1. ✅ Test frontend at deployed URL
2. ✅ Register a test user
3. ✅ Verify Socket.io connection (F12 → Console)
4. ✅ Test create activity / analytics
5. ✅ Update backend CLIENT_URL env var (optional, for CORS)
6. ✅ Set up custom domain (premium feature)

---

## Pricing

- **Free Tier:** $0/month (5 services, 50GB/month bandwidth)
- **Starter:** $7/month (better performance)
- **Note:** Free tier spins down after 15 min inactivity

---

## Support

For issues: https://render.com/support
