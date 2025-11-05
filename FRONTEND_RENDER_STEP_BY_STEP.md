# Frontend Deployment - Step by Step Visual Guide

## 🎬 Phase 1: Local Preparation (5 minutes)

### Step 1.1: Navigate to Frontend Directory

**Windows PowerShell:**
```powershell
cd 'c:\Users\user\OneDrive\ドキュメント\a06 msd\frontend\vite'
```

**Expected Output:**
```
PS C:\Users\user\OneDrive\ドキュメント\a06 msd\frontend\vite>
```

### Step 1.2: Install Dependencies

```powershell
pnpm install
```

**Expected Output:**
```
✔ Locked lockfile is up-to-date, resolution step is skipped
Packages in global store are up-to-date, nothing to inject
packages in this project:
- react 19.2.0
- vite 6.1.0
- axios latest
✔ All packages up-to-date
```

### Step 1.3: Build for Production

```powershell
pnpm run build
```

**Expected Output:**
```
vite v6.1.0 building for production...
✓ 1234 modules transformed.
dist/index.html                    0.42 kB │ gzip:  0.20 kB
dist/assets/main-xxx.js       234.56 kB │ gzip: 45.23 kB
dist/assets/vendor-xxx.js     123.45 kB │ gzip: 34.12 kB
✓ build complete.
```

### Step 1.4: Verify Build Output

```powershell
ls dist/
```

**Expected Output:**
```
Directory: C:\...\frontend\vite\dist

Mode         LastWriteTime        Length Name
----         --------             ------ ----
d----   11/5/2025  2:30 PM               assets
-a---   11/5/2025  2:30 PM      5432 index.html
```

---

## 🌐 Phase 2: GitHub Preparation (3 minutes)

### Step 2.1: Navigate to Project Root

```powershell
cd 'c:\Users\user\OneDrive\ドキュメント\a06 msd'
```

### Step 2.2: Check Git Status

```powershell
git status
```

**Expected Output:**
```
On branch main
Your branch is up to date with 'origin/main'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        frontend/vite/server.js
        render-frontend.yaml
        FRONTEND_RENDER_DEPLOYMENT.md
        FRONTEND_RENDER_QUICK_REFERENCE.md

nothing added to commit but untracked files present (working directory)
```

### Step 2.3: Stage All Files

```powershell
git add -A
```

### Step 2.4: Commit Changes

```powershell
git commit -m "Add frontend deployment setup files"
```

**Expected Output:**
```
[main xxx] Add frontend deployment setup files
 4 files changed, 456 insertions(+)
 create mode 100644 FRONTEND_RENDER_DEPLOYMENT.md
 create mode 100644 FRONTEND_RENDER_QUICK_REFERENCE.md
 create mode 100644 frontend/vite/server.js
 create mode 100644 render-frontend.yaml
```

### Step 2.5: Push to GitHub

```powershell
git push origin main
```

**Expected Output:**
```
Enumerating objects: 7, done.
Counting objects: 100% (7/7), done.
Delta compression using up to 8 threads
Compressing objects: 100% (4/4), done.
Writing objects: 100% (4/4), 456 bytes | 456.00 B/s, done.
Total 4 (delta 1), reused 0
remote: Resolving deltas: 100% (1/1), done.
To https://github.com/Rakeshrocky330/msd-project.git
   abcd123..efgh456  main -> main
```

---

## 🚀 Phase 3: Render Deployment (10 minutes)

### Step 3.1: Go to Render Dashboard

**URL:** https://dashboard.render.com/

**Screenshot Steps:**
1. Click "Sign In" if not logged in
2. Enter your credentials
3. You should see your existing `msd-project-c39k` backend service

### Step 3.2: Create New Service

**On Dashboard:**
1. Look for "+ New" button (top right area)
2. Click it
3. Select "Web Service"

**Result:** You see blank service form

### Step 3.3: Connect GitHub Repository

**On Service Creation Form:**

1. Find "GitHub" section
2. Click "Search repositories"
3. Search for: `msd-project`
4. Click: `Rakeshrocky330/msd-project`

**Expected:** Repository is selected ✅

### Step 3.4: Fill in Service Details

**Basic Information:**
```
Name:               msd-project-frontend
Region:             Ohio
Branch:             main
Runtime:            Node
Plan:               Free (or Starter for production)
```

**Build Command:**
```
cd frontend/vite && pnpm install --frozen-lockfile && pnpm run build
```

**Start Command:**
```
cd frontend/vite && pnpm start
```

### Step 3.5: Add Environment Variables

**Click:** "Add Environment Variable" button

**Variable 1:**
```
Key:    NODE_ENV
Value:  production
```
Click "Add"

**Variable 2:**
```
Key:    VITE_API_URL
Value:  https://msd-project-c39k.onrender.com
```
Click "Add"

**Variable 3:**
```
Key:    VITE_SOCKET_URL
Value:  https://msd-project-c39k.onrender.com
```
Click "Add"

**Variable 4:**
```
Key:    PORT
Value:  3000
```
Click "Add"

**Result:** All 4 variables shown in list ✅

### Step 3.6: Deploy

1. Scroll to bottom
2. Click "Create Web Service"
3. **IMPORTANT:** Do NOT refresh page during deployment
4. Render starts building automatically

**Expected Timeline:**
```
0 min:  Build starts
2 min:  Dependencies installed
4 min:  Build complete
6 min:  Server starting
7 min:  "Backend URL: https://msd-project-frontend.onrender.com"
```

---

## ✅ Phase 4: Verification (5 minutes)

### Step 4.1: Check Build Status

**On Render Dashboard:**

1. Select `msd-project-frontend` service
2. Check top right corner - shows deployment status:
   - 🟡 **In Progress:** Still building
   - 🟢 **LIVE:** Ready!
   - 🔴 **Failed:** Check logs

### Step 4.2: View Deployment Logs

**On Service Page:**

1. Click "Logs" tab
2. Look for these messages:
   ```
   ✅ Frontend server running on port 3000
   📡 API Server: https://msd-project-c39k.onrender.com
   🔌 Socket URL: https://msd-project-c39k.onrender.com
   ```

### Step 4.3: Test Frontend URL

**In Browser:**

1. Find your frontend URL on Render (top of service page)
   - Format: `https://msd-project-frontend-xxx.onrender.com`
2. Open in new tab
3. Should see your React app loading
4. Check browser console (F12):
   - No CORS errors
   - Socket.io trying to connect

### Step 4.4: Test Backend Connection

**In Browser Console (F12):**

```javascript
// Test API connection
fetch('https://msd-project-c39k.onrender.com/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend OK:', d))
  .catch(e => console.error('❌ Backend Error:', e))
```

**Expected Output:**
```
✅ Backend OK: {status: "Server is running"}
```

### Step 4.5: Test User Registration

**On Your Frontend:**

1. Navigate to Register page
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: Test@123
3. Click Register
4. Should see success message or redirect to login

---

## 🎉 Phase 5: Success Indicators

### ✅ Frontend Deployed Successfully When:

1. ✅ Render shows "LIVE" status
2. ✅ Logs show "✅ Frontend server running on port 3000"
3. ✅ Frontend URL loads your React app
4. ✅ No 404 errors on routes
5. ✅ Browser console shows Socket.io connecting (or connected)
6. ✅ Backend health check returns success
7. ✅ User registration works end-to-end

### 🎯 Final Status:

```
Frontend:  https://msd-project-frontend.onrender.com  ✅ LIVE
Backend:   https://msd-project-c39k.onrender.com      ✅ LIVE
Database:  MongoDB Atlas                               ✅ LIVE (after fix)
```

---

## 🆘 Troubleshooting

### Issue: Build Fails

**Error Message:**
```
ERR_MODULE_NOT_FOUND: Cannot find module 'vite'
```

**Solution:**
1. In Render logs, look for specific error
2. Usually means `pnpm install` failed
3. Common fixes:
   - Increase build timeout
   - Check package-lock isn't corrupting install
   - Clear Render cache and redeploy

**Manual Fix:**
```powershell
# Locally, force clean install
cd frontend/vite
rm -r node_modules
rm pnpm-lock.yaml
pnpm install
pnpm run build
git add -A
git commit -m "Rebuild dependencies"
git push origin main
```

### Issue: App Shows Blank Page

**Debug Steps:**
1. Press F12 (Developer Tools)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Check Render logs

**Common Causes:**
- Build didn't complete successfully
- `server.js` not configured correctly
- Start command pointing to wrong location

**Fix:**
```bash
# Verify server.js exists
ls frontend/vite/server.js

# Verify start script in package.json
grep '"start":' frontend/vite/package.json
```

### Issue: 404 on Page Refresh

**Cause:** SPA routing not configured - `server.js` not serving index.html for all routes

**Verify Server.js Has:**
```javascript
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
```

### Issue: Socket.io Not Connecting

**Check:**
1. Browser console shows WebSocket errors
2. VITE_SOCKET_URL environment variable set correctly
3. Backend service is running

**Fix Environment Variables:**
1. Go to Render dashboard
2. Select `msd-project-frontend`
3. Click "Environment" tab
4. Verify VITE_SOCKET_URL = `https://msd-project-c39k.onrender.com`
5. Click "Save" (triggers redeploy)

### Issue: CORS Errors

**Error:**
```
Access to XMLHttpRequest at 'https://msd-project-c39k.onrender.com...' 
from origin 'https://msd-project-frontend.onrender.com' has been blocked by CORS policy
```

**Solution:**
1. Go to Backend on Render
2. Go to Environment variables
3. Add/update: `CLIENT_URL = https://msd-project-frontend.onrender.com`
4. Save (triggers backend redeploy)

---

## 📝 Quick Command Reference

| What | Command |
|------|---------|
| Navigate to frontend | `cd 'c:\Users\user\OneDrive\ドキュメント\a06 msd\frontend\vite'` |
| Install deps | `pnpm install` |
| Build | `pnpm run build` |
| Test locally | `pnpm start` |
| Git commit | `git commit -m "message"` |
| Git push | `git push origin main` |
| Check status | `git status` |

---

## 🎓 Next Steps After Deployment

1. **[ ] Test Frontend**
   - Visit: https://msd-project-frontend.onrender.com
   - Try logging in/registering
   - Check Socket.io connection

2. **[ ] Fix Backend MongoDB** (if not already done)
   - Go to: https://dashboard.render.com
   - Select: msd-project-c39k (backend)
   - Environment tab
   - Update MONGODB_URI with %40 encoding
   - Save

3. **[ ] Test End-to-End**
   - Register on frontend
   - Check backend logs for user created
   - Create activity on frontend
   - Verify real-time updates

4. **[ ] Set Up Custom Domain** (optional)
   - Upgrade plan to Starter
   - Go to service settings
   - Add custom domain

5. **[ ] Monitor Performance**
   - Watch Render metrics
   - Monitor error logs
   - Set up alerts

---

## 🏁 Deployment Complete!

Your full-stack application is now deployed:

- **Frontend:** Render (Node.js service)
- **Backend:** Render (Express.js service)
- **Database:** MongoDB Atlas
- **Real-Time:** Socket.io
- **CI/CD:** Auto-deploy from GitHub

**Total Cost:** $7/month (both services on Starter plan)
