# Frontend Deployment Troubleshooting Guide

## 🆘 Common Issues & Solutions

---

## 1. Build Fails - "ERR_PNPM_NO_MATCHING_VERSION"

### ❌ Error Message:
```
ERR_PNPM_NO_MATCHING_VERSION: The package "something@latest" doesn't exist in the registry
```

### 🔍 Diagnosis:
1. Check Render logs during build
2. Look for line showing which package failed
3. Usually means `pnpm-lock.yaml` is corrupted

### ✅ Fix:

**Option 1: Rebuild locally and push**
```powershell
cd 'c:\Users\user\OneDrive\ドキュメント\a06 msd\frontend\vite'

# Force clean install
rm -r node_modules
rm pnpm-lock.yaml

# Reinstall
pnpm install

# Rebuild
pnpm run build

# Push to GitHub
cd ..
cd ..
git add -A
git commit -m "Rebuild frontend dependencies"
git push origin main
```

**Option 2: Retry deployment on Render**
1. Go to Render dashboard
2. Select `msd-project-frontend`
3. Click "..." menu → "Manual Deploy"
4. Select "Redeploy latest commit"

---

## 2. Build Succeeds But App Shows Blank Page

### ❌ What You See:
- Deployment shows LIVE
- Logs show "✅ Frontend server running"
- But page is blank/white

### 🔍 Diagnosis:

**Step 1:** Press F12 to open DevTools
**Step 2:** Check Console tab for errors
**Step 3:** Look for messages like:
- `Cannot find module`
- `fetch failed`
- `Cannot read property of undefined`

### ✅ Common Fixes:

#### Fix A: Missing `dist` folder

**Symptom:** Error like "ENOENT: no such file or directory, open '...dist/index.html'"

**Cause:** Build command didn't run or failed

**Solution:**
1. Go to Render → Logs tab
2. Look for build errors
3. Scroll up to see npm/pnpm install errors
4. Usually `pnpm install` failed

**Manual Fix:**
```powershell
cd frontend/vite

# Check if dist exists
ls dist/

# If not, rebuild
pnpm run build

# Check again
ls dist/
```

#### Fix B: Wrong file in server.js

**Symptom:** "Cannot find module" error

**Cause:** `server.js` looking in wrong location

**Check:** Open `frontend/vite/server.js` and verify:
```javascript
app.use(express.static(path.join(__dirname, 'dist')));
```

Should reference `'dist'` (relative path)

#### Fix C: React not mounting

**Symptom:** No error in console, but page blank

**Cause:** React app didn't mount to DOM

**Check:** In browser console:
```javascript
document.getElementById('root')  // Should not be null
```

If null, check `index.html` has:
```html
<div id="root"></div>
```

---

## 3. 404 Page on Route Refresh

### ❌ What Happens:
1. Frontend loads at `/`
2. Click link to `/login`
3. Page refreshes
4. Get 404 error

### 🔍 Why:
Express server can't find `/login` route - no SPA fallback configured

### ✅ Fix:

**Verify `server.js` has:**
```javascript
// Add this AFTER static files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
```

**Order matters!**
```javascript
app.use(express.static(path.join(__dirname, 'dist')));  // Serve static files first
app.get('/health', ...);                                // Health check
app.get('*', (req, res) => {                           // SPA fallback LAST
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
```

---

## 4. Cannot Connect to Backend API

### ❌ Error in Console:
```
Failed to fetch: https://msd-project-c39k.onrender.com/...
TypeError: Failed to fetch
```

### 🔍 Diagnosis:

**Step 1:** Check backend is running
```bash
curl https://msd-project-c39k.onrender.com/health
```

Should return:
```json
{"status": "Server is running"}
```

**Step 2:** Check environment variables
1. Go to Render dashboard
2. Select `msd-project-frontend`
3. Click "Environment"
4. Verify VITE_API_URL is set correctly

**Step 3:** Check CORS

### ✅ Fixes:

#### Fix A: Backend service down

**Check:**
1. Go to Render → Backend service
2. Status should be "LIVE"
3. If not, click "Logs" to see why

**Solution:**
```bash
# Check backend is accessible
curl https://msd-project-c39k.onrender.com/health

# If fails, backend service has issue
# Go to Render and check MongoDB connection
```

#### Fix B: Wrong VITE_API_URL

**Check:**
```javascript
// In browser console
console.log(import.meta.env.VITE_API_URL)
```

Should show full URL like:
```
https://msd-project-c39k.onrender.com
```

If not, variables aren't set.

**Solution:**
1. Go to Render Environment tab
2. Add VITE_API_URL = https://msd-project-c39k.onrender.com
3. Save (auto-redeploy)

#### Fix C: CORS blocked

**Error:**
```
Access to XMLHttpRequest at 'https://...' from origin 
'https://msd-project-frontend.onrender.com' has been blocked 
by CORS policy: No 'Access-Control-Allow-Origin' header
```

**Solution:** Update backend CORS

1. Go to Render → Backend service
2. Click Environment
3. Update CLIENT_URL = https://msd-project-frontend.onrender.com
4. Save
5. Wait 2 minutes for redeploy

---

## 5. Socket.io Not Connecting

### ❌ Symptoms:
- Real-time features don't work
- Console shows Socket.io trying to connect but failing
- Activities not syncing in real-time

### 🔍 Diagnosis:

**Check 1:** Socket.io client is loading
```javascript
// Browser console
typeof io  // Should be 'function', not 'undefined'
```

**Check 2:** Correct URL configured
```javascript
// Should match backend
import.meta.env.VITE_SOCKET_URL
```

**Check 3:** Connection status
```javascript
// If you have socket object
socket.connected  // Should be true
socket.disconnected  // Should be false
```

### ✅ Fixes:

#### Fix A: Wrong VITE_SOCKET_URL

**Check:**
```javascript
console.log('Socket URL:', import.meta.env.VITE_SOCKET_URL)
```

**Fix:**
1. Go to Render Environment
2. Verify VITE_SOCKET_URL = https://msd-project-c39k.onrender.com
3. **Same as VITE_API_URL**

#### Fix B: Backend doesn't have Socket.io

**Check:**
1. Render → Backend logs
2. Look for: "Socket server ready"

If not there, backend might not have Socket.io running.

**Fix:**
- Check `backend/server/index.js` has Socket.io setup
- Redeploy backend

#### Fix C: WebSocket blocked by network

**Symptom:** Works on desktop, not on corporate network

**Reason:** Corporate firewall blocks WebSocket

**Solution:**
- Use Socket.io fallback (polling mode)
- No code change needed - Socket.io auto-fallbacks
- Just slower than WebSocket

---

## 6. Free Tier Service Spins Down

### ❌ Symptoms:
- First request takes 30+ seconds
- Service shows "Spinning up..."
- User experience delayed

### 🔍 Why:
Render free tier auto-spins down after 15 minutes of inactivity

### ✅ Solutions:

#### Option 1: Upgrade to Starter ($7/month)
1. Go to Render → Service settings
2. Click "Upgrade Plan"
3. Select "Starter"
4. Pay $7/month - keeps service always running

#### Option 2: Keep Free Tier (accept delays)
- Service spins up automatically
- First request waits ~30 seconds
- Subsequent requests fast
- Good for development/hobby projects

#### Option 3: Ping service every 15 minutes
```javascript
// In frontend code
setInterval(async () => {
  try {
    await fetch(import.meta.env.VITE_API_URL + '/health');
  } catch (e) {
    // Ignore errors
  }
}, 14 * 60 * 1000); // Every 14 minutes
```

---

## 7. Deployment Stuck or Taking Too Long

### ❌ Status:
- Render shows "In Progress" for >15 minutes
- No updates in logs

### 🔍 Likely Cause:
- Large dependencies being installed
- Network timeout
- Build tool issue

### ✅ Fix:

**Option 1: Wait longer**
- Some first deployments take 20-30 minutes
- Check logs for activity
- Don't cancel

**Option 2: Cancel and retry**
1. Render → Service menu
2. Click "..." → "Cancel deployment"
3. Scroll down, click "Redeploy latest commit"
4. Try again

**Option 3: Reduce package size**
```powershell
# Check dependencies
cd frontend/vite
pnpm list

# Remove unnecessary packages
pnpm remove unused-package

# Rebuild
pnpm run build

# Push and redeploy
git add -A
git commit -m "Remove unnecessary dependencies"
git push origin main
```

---

## 8. Logs Show Errors But Service Is LIVE

### ❌ Symptoms:
- Service shows LIVE
- But logs have errors
- App might be broken

### ✅ Check:

**What errors can be safely ignored:**
```
// These are usually OK (logs but app still works)
"Cannot find module 'xyz'" - if caught by try/catch
"WARN: Some peer dependency missing" - warnings
"Timeout connecting to MongoDB" - if app handles gracefully
```

**What errors need fixing:**
```
// These break the app
"Error: Cannot find module 'express'" - missing dependency
"SyntaxError: Unexpected token" - code syntax error
"Cannot read property 'x' of undefined" - runtime crash
```

### To Fix:

1. Read full error message
2. If dependency missing: `pnpm install missing-package`
3. If syntax error: Fix code and push
4. If runtime error: Check server.js or error handler

---

## 9. Package Not Found in Lock File

### ❌ Error:
```
ERR_PNPM_FROZEN_LOCKFILE_WITH_UNSATISFIED_PEERS
```

### 🔍 Cause:
`pnpm-lock.yaml` out of sync with `package.json`

### ✅ Fix:

```powershell
cd frontend/vite

# Option 1: Update lock file
pnpm install

# Option 2: Force clean
rm pnpm-lock.yaml
pnpm install

# Then
pnpm run build

# Push
cd ../..
git add -A
git commit -m "Update pnpm lock file"
git push origin main
```

---

## 10. PORT Not Available or Wrong

### ❌ Error:
```
Error: listen EADDRINUSE :::3000
```

### 🔍 Cause:
Port 3000 already in use

### ✅ Fix:

**On Render** (should auto-assign):
1. Render dashboard
2. Environment variables
3. Make sure PORT not hardcoded to 3000
4. Remove PORT variable or leave as recommended

**Locally:**
```powershell
# Use different port
$env:PORT = 3001
pnpm start

# Or kill existing process
netstat -ano | findstr :3000
taskkill /PID <pid> /F
```

---

## 🔍 General Debugging Process

### Always follow this order:

1. **Check Status:** Is service showing LIVE?
2. **Check Logs:** What's the latest log message?
3. **Test Health:** `curl https://service-url/health`
4. **Check Env Vars:** Are they set correctly?
5. **Check Code:** Does server.js exist and look right?
6. **Test Locally:** `pnpm start` - does it work?
7. **Check Git:** Was code pushed successfully?

---

## 🆘 Still Stuck?

### Last Resort Options:

**Option 1: Delete and recreate service**
```
1. Render → Service → Settings
2. Scroll to bottom → "Delete Service"
3. Confirm
4. Go back to dashboard
5. "+ New" → "Web Service"
6. Recreate with same settings
```

**Option 2: Contact support**
- Render Support: https://render.com/support
- Include:
  - Service name
  - Error message
  - Screenshot
  - Steps to reproduce

**Option 3: Use alternative (Vercel)**
- Deploy frontend on Vercel instead
- Create `vercel.json` with build settings
- Connect GitHub
- Deploy

---

## 📋 Debugging Checklist

- [ ] Is service status LIVE?
- [ ] Can you reach the URL in browser?
- [ ] Are environment variables set?
- [ ] Do logs show errors?
- [ ] Does code work locally?
- [ ] Was code pushed to GitHub?
- [ ] Is backend accessible?
- [ ] Are CORS headers set?
- [ ] Is MongoDB connection working?

---

## 🎯 Prevention Tips

1. **Test locally first:** Always run `pnpm start` locally before pushing
2. **Check logs daily:** Monitor Render logs for warnings
3. **Pin dependencies:** Use exact versions in package.json, not `latest`
4. **Use .env files:** Don't hardcode URLs in code
5. **Backup configs:** Save Render settings somewhere
6. **Monitor uptime:** Set Render alerts for service down

