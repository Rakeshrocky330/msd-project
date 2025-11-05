# Frontend on Render - Quick Reference

## 🚀 Fastest Way to Deploy (10 minutes)

### Step 1: Local Build Test
```bash
cd c:\Users\user\OneDrive\ドキュメント\a06 msd\frontend\vite
pnpm install
pnpm run build
pnpm start
```
Open: http://localhost:3000

### Step 2: Push to GitHub
```bash
cd c:\Users\user\OneDrive\ドキュメント\a06 msd
git add -A
git commit -m "Add frontend deployment files for Render"
git push origin main
```

### Step 3: Deploy on Render (5 minutes)

1. **Open:** https://dashboard.render.com/
2. **Click:** "+ New" → "Web Service"
3. **Select:** msd-project repository
4. **Fill in:**
   - **Name:** `msd-project-frontend`
   - **Region:** `Ohio`
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `cd frontend/vite && pnpm install --frozen-lockfile && pnpm run build`
   - **Start Command:** `cd frontend/vite && pnpm start`
5. **Add Environment Variables:**
   ```
   NODE_ENV = production
   VITE_API_URL = https://msd-project-c39k.onrender.com
   VITE_SOCKET_URL = https://msd-project-c39k.onrender.com
   PORT = 3000
   ```
6. **Click:** "Create Web Service"
7. **Wait:** 5-10 minutes

### Step 4: Verify
- Check Render Logs: Should see "✅ Frontend server running on port 3000"
- Visit your URL (shown in Render dashboard)
- Test login/register

---

## 📋 All Required Files

### Already Created ✅
1. **server.js** - Express server for production
   - Location: `frontend/vite/server.js`
   - Auto-creates on deploy

2. **render-frontend.yaml** - Render config
   - Location: `render-frontend.yaml` (root)
   - Auto-detected by Render

3. **FRONTEND_RENDER_DEPLOYMENT.md** - Full guide
   - Location: Root directory
   - For reference

### Need to Update in package.json
Edit `frontend/vite/package.json`:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 🔧 PowerShell Commands (Windows)

### Build Locally
```powershell
cd 'c:\Users\user\OneDrive\ドキュメント\a06 msd\frontend\vite'
pnpm install
pnpm run build
```

### Test Locally
```powershell
cd 'c:\Users\user\OneDrive\ドキュメント\a06 msd\frontend\vite'
pnpm start
```

### Git Commit & Push
```powershell
cd 'c:\Users\user\OneDrive\ドキュメント\a06 msd'
git add -A
git commit -m "Frontend deployment setup"
git push origin main
```

---

## 🌐 URLs After Deployment

| Service | URL |
|---------|-----|
| Frontend | https://msd-project-frontend.onrender.com |
| Backend | https://msd-project-c39k.onrender.com |
| Health Check | https://msd-project-frontend.onrender.com/health |

---

## ✅ Deployment Checklist

- [ ] Run `pnpm install` in `frontend/vite/`
- [ ] Run `pnpm run build` locally
- [ ] Verify `dist/` folder created
- [ ] Verify `server.js` exists in `frontend/vite/`
- [ ] Update `package.json` with start script
- [ ] Git add all files
- [ ] Git push to origin main
- [ ] Create Web Service on Render
- [ ] Add environment variables
- [ ] Wait for deployment (5-10 min)
- [ ] Check Render logs for success
- [ ] Test frontend URL in browser
- [ ] Test API connection
- [ ] Test Socket.io in console

---

## 🆘 Common Issues & Fixes

### ❌ "Cannot find module 'dist/index.html'"
**Fix:** Run `pnpm run build` first, or rebuild on Render

### ❌ "CORS error from backend"
**Fix:** Check backend has correct CLIENT_URL env var

### ❌ "Socket.io not connecting"
**Fix:** Verify VITE_SOCKET_URL env var matches backend URL

### ❌ "Build failed"
**Fix:** 
```bash
cd frontend/vite
pnpm install --force
pnpm run build
```

### ❌ "Blank page loads"
**Fix:** Check browser console (F12) for errors, check Render logs

### ❌ "Free tier keeps sleeping"
**Fix:** Upgrade to Starter plan ($7/month) or use Vercel instead

---

## 📊 Monitoring

### Real-Time Logs
1. Go to Render dashboard
2. Select `msd-project-frontend`
3. Click "Logs"
4. Watch for errors

### Health Status
```bash
curl https://msd-project-frontend.onrender.com/health
```

### API Connection Test
Open browser DevTools and test:
```javascript
fetch('https://msd-project-c39k.onrender.com/health')
  .then(r => r.json())
  .then(d => console.log('Backend OK:', d))
  .catch(e => console.error('Backend Error:', e))
```

---

## 🎯 Next Steps After Frontend Deploy

1. ✅ Test user registration at frontend URL
2. ✅ Verify Socket.io WebSocket connects
3. ✅ Test create activity feature
4. ✅ Check analytics real-time updates
5. ✅ Set up custom domain (optional)
6. ✅ Monitor Render metrics

---

## 💰 Pricing

| Tier | Cost | Specs |
|------|------|-------|
| Free | $0 | 5 services, 50GB bandwidth, spins down after 15 min |
| Starter | $7 | 1 service, unlimited bandwidth, always on |

---

## 🔗 Useful Links

- **Render Dashboard:** https://dashboard.render.com/
- **Render Docs:** https://render.com/docs/
- **GitHub Repo:** https://github.com/Rakeshrocky330/msd-project
- **Backend API:** https://msd-project-c39k.onrender.com
- **Render Support:** https://render.com/support
