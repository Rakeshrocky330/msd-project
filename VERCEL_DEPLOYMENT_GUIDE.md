# 🎨 VERCEL DEPLOYMENT GUIDE - Frontend (Vite React)

## DEPLOYMENT CONFIGURATION FOR VERCEL

Your frontend (React + Vite) will be deployed on Vercel with the following specifications:

---

## 📋 VERCEL PROJECT CONFIGURATION

### Basic Settings

| Setting | Value |
|---------|-------|
| **Project Name** | `msd-project-frontend` |
| **Framework** | Vite |
| **Root Directory** | `frontend/vite` |
| **Node Version** | 18.x or higher |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

---

## 🔧 BUILD CONFIGURATION

### Build Command
```bash
npm run build
```

**What it does:**
- Bundles React components with Vite
- Optimizes JavaScript and CSS
- Creates production-ready files in `dist/` folder
- Minifies and tree-shakes unused code

### Install Command
```bash
npm install
```

**What it does:**
- Installs all dependencies from `frontend/vite/package.json`
- Prepares environment for build

### Output Directory
```
dist
```

**Location**: `frontend/vite/dist` (relative to root directory)

---

## 🌍 ENVIRONMENT VARIABLES TO SET

Add these in Vercel dashboard → Settings → Environment Variables:

### 1. Backend API URL (CORS)
```
VITE_API_URL
Value: https://msd-project.onrender.com
Note: Update with your actual Render backend URL after deployment
```

### 2. React App API URL (Alternative)
```
REACT_APP_API_URL
Value: https://msd-project.onrender.com
Note: Used by some services as fallback
```

### 3. Socket.io Server URL
```
VITE_SOCKET_URL
Value: https://msd-project.onrender.com
Note: Must match backend URL for real-time features
```

### 4. Socket.io Fallback URL
```
REACT_APP_SOCKET_URL
Value: https://msd-project.onrender.com
Note: Fallback for Socket.io connection
```

### 5. Environment Mode
```
VITE_ENV
Value: production
```

### 6. Node Environment
```
NODE_ENV
Value: production
```

### Summary of All Variables
```
VITE_API_URL=https://msd-project.onrender.com
REACT_APP_API_URL=https://msd-project.onrender.com
VITE_SOCKET_URL=https://msd-project.onrender.com
REACT_APP_SOCKET_URL=https://msd-project.onrender.com
VITE_ENV=production
NODE_ENV=production
```

---

## 🚀 STEP-BY-STEP DEPLOYMENT PROCESS

### Step 1: Prepare Your Repository
```bash
# Ensure code is pushed to GitHub
cd "c:\Users\user\OneDrive\ドキュメント\a06 msd"
git status
git push origin main
```

### Step 2: Create Vercel Account
- Go to https://vercel.com
- Click "Sign Up"
- Use GitHub account (recommended)
- Authorize GitHub access
- Wait for redirect to Vercel dashboard

### Step 3: Import Project
1. Click **"Add New"** → **"Project"**
2. Click **"Import Git Repository"**
3. Search for: `Rakeshrocky330/msd-project`
4. Select it from the list
5. Click **"Import"**

### Step 4: Configure Project Settings

When Vercel shows the import dialog, fill in:

```
Project Name:              msd-project-frontend
Framework Preset:          Vite
Root Directory:            frontend/vite
Build Command:             npm run build
Output Directory:          dist
Install Command:           npm install
Development Command:       npm run dev
```

Vercel should auto-detect these, but verify:

1. **Root Directory**: Click **"Edit"** next to "frontend/vite"
   - Ensure it shows: `frontend/vite`
   - This tells Vercel where to find the app

2. **Build Settings**: Should show:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Step 5: Add Environment Variables

Click **"Environment Variables"** and add each:

```
1. VITE_API_URL = https://msd-project.onrender.com
2. REACT_APP_API_URL = https://msd-project.onrender.com
3. VITE_SOCKET_URL = https://msd-project.onrender.com
4. REACT_APP_SOCKET_URL = https://msd-project.onrender.com
5. VITE_ENV = production
6. NODE_ENV = production
```

**Important**: Vercel shows environment variables to all visitors!
- ✅ Safe to share: API URLs, public config
- ❌ Never share: API keys, secrets, passwords

### Step 6: Deploy
1. Click **"Deploy"**
2. Watch the deployment logs (should take 2-5 minutes)
3. Wait for "Congratulations! Your project has been successfully deployed"
4. Copy your Vercel URL: `https://msd-project-frontend.vercel.app`

### Step 7: Update Backend with Frontend URL
1. Go to Render dashboard
2. Select your backend service
3. Go to Environment variables
4. Update `CLIENT_URL` to: `https://msd-project-frontend.vercel.app`
5. Render will redeploy (2-3 minutes)

---

## 📊 VERCEL DASHBOARD REFERENCE

### Deployments Tab
- View all past deployments
- Rollback to previous versions
- View deployment logs
- Check build time and performance

### Settings Tab
- **General**: Project name, framework, git settings
- **Environment Variables**: Set API URLs and config
- **Domains**: Add custom domain (optional)
- **Functions**: Configure serverless functions (advanced)
- **Analytics**: View performance metrics

### Logs Tab
- **Build**: See build output and errors
- **Runtime**: See errors during app execution
- **Edge**: CDN and edge function logs

### Analytics Tab
- Performance metrics
- Web Core Vitals
- Traffic patterns
- Error rates

---

## 🔄 AUTO-DEPLOY CONFIGURATION

Vercel automatically deploys when you push to GitHub:

1. Push code to `main` branch
2. Vercel detects the push
3. Automatically builds and deploys
4. Updates your site (zero downtime)
5. Shows deployment status in GitHub

**To disable auto-deploy**:
- Settings → Git Settings → Deploy on push (toggle off)

**To preview before production**:
- Push to a different branch (e.g., `develop`)
- Vercel creates preview URL automatically
- Merge to `main` when ready for production

---

## 🧪 TESTING AFTER DEPLOYMENT

### Test 1: Page Loads
```
1. Go to: https://msd-project-frontend.vercel.app
2. Should load without errors
3. Check browser console (F12) for errors
```

### Test 2: Check API Connection
```
1. Open DevTools (F12)
2. Go to Network tab
3. Try registering a new account
4. Should see API request to backend URL
5. Should complete without CORS errors
```

### Test 3: Socket.io Connection
```
1. Keep DevTools open
2. Go to Network tab
3. Filter for "WS" (WebSocket)
4. Should see socket.io connection from your backend
5. Connection URL should be your Render backend
```

### Test 4: Full Feature Test
```
1. Register a new account
2. Verify email (if enabled)
3. Login
4. Create an activity/log
5. Check that it appears immediately (real-time)
6. Go to analytics
7. Verify stats are showing
8. Check that everything updates in real-time
```

### Test 5: Mobile Responsiveness
```
1. Open in mobile browser or use mobile emulation (F12)
2. App should be responsive and usable
3. Touch interactions should work
```

---

## 🚨 TROUBLESHOOTING

### Issue: Build fails with "Module not found"
**Cause**: Missing dependency or wrong path

**Fix**:
1. Check `frontend/vite/package.json` has all dependencies
2. Check build log for specific error
3. Try building locally:
   ```bash
   cd frontend/vite
   npm install
   npm run build
   ```
4. If local build fails, fix the error and push to GitHub

### Issue: "Cannot reach backend" or CORS errors
**Cause**: Wrong API URL or backend not running

**Fix**:
1. Verify `VITE_API_URL` environment variable is set correctly
2. Test backend URL works:
   ```bash
   curl https://msd-project.onrender.com/health
   ```
3. If backend returns error, check Render logs
4. Ensure `CLIENT_URL` in Render matches frontend URL

### Issue: Socket.io won't connect
**Cause**: Backend URL wrong or WebSocket not enabled

**Fix**:
1. Check `VITE_SOCKET_URL` equals `VITE_API_URL`
2. Open DevTools → Network → WS filter
3. Should see socket.io connection attempt
4. If connection fails, check browser console for error
5. Verify backend is running and accessible

### Issue: Blank page or 404 error
**Cause**: Root directory set incorrectly

**Fix**:
1. Go to Vercel Settings
2. Check "Root Directory" is set to: `frontend/vite`
3. If wrong, update it
4. Trigger new deployment by pushing to GitHub

### Issue: Build succeeds but app doesn't work
**Cause**: Environment variables not set

**Fix**:
1. Check Vercel Settings → Environment Variables
2. Verify all 6 environment variables are present:
   - VITE_API_URL ✓
   - REACT_APP_API_URL ✓
   - VITE_SOCKET_URL ✓
   - REACT_APP_SOCKET_URL ✓
   - VITE_ENV ✓
   - NODE_ENV ✓
3. Redeploy: Settings → Deployments → Redeploy latest

---

## 🎯 OPTIMIZATION TIPS

### Improve Performance

1. **Enable Compression**: Vercel does this automatically
2. **Minimize Bundle Size**: Vite already optimizes
3. **Use CDN**: Vercel provides global CDN
4. **Cache Static Assets**: Vercel caches by default

### Monitor Performance

1. Go to Analytics tab
2. Check Web Core Vitals:
   - **LCP** (Largest Contentful Paint): < 2.5s
   - **FID** (First Input Delay): < 100ms
   - **CLS** (Cumulative Layout Shift): < 0.1
3. If metrics are poor:
   - Optimize images
   - Code split components
   - Lazy load routes

---

## 🔐 SECURITY BEST PRACTICES

- ✅ Use HTTPS only (automatic with Vercel)
- ✅ Set API URL environment variables
- ✅ Never expose API keys in frontend
- ✅ Enable CORS on backend for your domain only
- ✅ Use secure session cookies
- ✅ Validate all user input
- ✅ Keep dependencies updated
- ✅ Monitor error logs for attacks

---

## 💰 VERCEL PRICING

**Hobby Plan**: $0/month
- Unlimited bandwidth
- 100 deployments/month
- Edge middleware
- **Perfect for your project**

**Pro Plan**: $20/month
- Everything in Hobby
- Priority support
- Advanced analytics
- Team collaboration

---

## 🎨 CUSTOM DOMAIN (Optional)

To use your own domain:

1. Go to Vercel Settings → Domains
2. Enter your domain (e.g., myapp.com)
3. Add DNS records (Vercel will show instructions)
4. Wait for DNS propagation (can take 24-48 hours)
5. Domain will be live in Vercel UI

---

## 📊 DEPLOYMENT COMPARISON

| Feature | Vercel | Alternatives |
|---------|--------|--------------|
| **Ease of Use** | ⭐⭐⭐⭐⭐ | GitHub Pages ⭐⭐⭐ |
| **Build Speed** | ⭐⭐⭐⭐⭐ | Netlify ⭐⭐⭐⭐ |
| **Global CDN** | ⭐⭐⭐⭐⭐ | AWS ⭐⭐⭐⭐ |
| **Free Tier** | ⭐⭐⭐⭐⭐ | GitHub Pages ⭐⭐⭐⭐⭐ |
| **Support** | ⭐⭐⭐⭐ | Netlify ⭐⭐⭐⭐⭐ |

---

## 📞 NEXT STEPS

1. ✅ Code pushed to GitHub
2. ✅ Backend deployed on Render
3. ✅ Got Render backend URL
4. ▶️ Create Vercel account
5. ▶️ Import GitHub project
6. ▶️ Set root directory to `frontend/vite`
7. ▶️ Add environment variables
8. ▶️ Deploy
9. ▶️ Get Vercel frontend URL
10. ▶️ Update backend CLIENT_URL
11. ▶️ Test all features

---

## 📚 ADDITIONAL RESOURCES

- **Vercel Docs**: https://vercel.com/docs
- **Vite Docs**: https://vitejs.dev/
- **React Docs**: https://react.dev/
- **Deployment Guides**: https://vercel.com/guides
- **Environment Variables**: https://vercel.com/docs/environment-variables
- **Custom Domains**: https://vercel.com/docs/concepts/projects/domains

---

**You're ready to deploy!** 🎉

### Your Configuration Summary:
- **Project**: msd-project-frontend
- **Framework**: Vite + React
- **Root Directory**: frontend/vite
- **Build**: `npm run build`
- **Output**: dist
- **Environment**: 6 variables (API URLs)
- **Region**: Global CDN

**Estimated Deployment Time**: 2-5 minutes
**Cost**: $0 (hobby plan)
**Redeploy Speed**: < 1 minute (auto on push)
