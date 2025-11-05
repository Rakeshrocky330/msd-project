# 🚀 RENDER BACKEND DEPLOYMENT - QUICK START

## DEPLOY BACKEND ONLY ON RENDER

This guide covers deploying **only the backend** (Express.js + Socket.io) on Render.

---

## ✅ PREREQUISITES

- [x] GitHub account with `Rakeshrocky330/msd-project` repository
- [x] MongoDB Atlas connection string configured
- [x] Code pushed to GitHub (main branch)
- [ ] Render account (create at render.com)

---

## 🎯 STEP-BY-STEP DEPLOYMENT

### Step 1: Create Render Account (2 minutes)

1. Go to https://render.com
2. Click **"Sign Up"**
3. Choose **"Sign up with GitHub"** (easiest)
4. Authorize GitHub access
5. Complete registration

---

### Step 2: Create Web Service (1 minute)

1. In Render dashboard, click **"New +"**
2. Click **"Web Service"**
3. Click **"Connect a repository"**
4. Search for: `Rakeshrocky330/msd-project`
5. Click **"Connect"** next to your repository

---

### Step 3: Configure Service (2 minutes)

Fill in these fields:

| Field | Value |
|-------|-------|
| **Name** | `msd-project` |
| **Environment** | `Node` |
| **Region** | `Oregon` (or closest to you) |
| **Branch** | `main` |
| **Root Directory** | (leave blank) |
| **Build Command** | `pnpm install --frozen-lockfile; pnpm run build` |
| **Start Command** | `pnpm run start` |
| **Instance Type** | `Free` (for testing) or `Starter` ($7/month for production) |

---

### Step 4: Add Environment Variables (3 minutes)

Click **"Add Environment Variable"** and enter each one:

**Variable 1: PORT**
```
KEY: PORT
VALUE: 5000
```

**Variable 2: MONGODB_URI**
```
KEY: MONGODB_URI
VALUE: mongodb+srv://231fa04a06:rakesh@123@cluster0.as0oqft.mongodb.net/?appName=Cluster0
```

**Variable 3: JWT_SECRET**
```
KEY: JWT_SECRET
VALUE: [Generate strong random string]
Example: aB3$xK9mL#pQ2wE7rT5yU8oI4uJ6fH1gD0cV4nB2xZ

Generate using:
- Windows PowerShell: [System.Convert]::ToBase64String([System.Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes(32))
- macOS/Linux: openssl rand -base64 32
- Online: https://www.random.org/strings/
```

**Variable 4: NODE_ENV**
```
KEY: NODE_ENV
VALUE: production
```

**Variable 5: CLIENT_URL**
```
KEY: CLIENT_URL
VALUE: http://localhost:3000
Note: If you deploy frontend later, update this to the Vercel URL
```

**Variable 6: EMAIL_USER (Optional)**
```
KEY: EMAIL_USER
VALUE: [your-email@gmail.com]
Note: Only if using email features
```

**Variable 7: EMAIL_PASSWORD (Optional)**
```
KEY: EMAIL_PASSWORD
VALUE: [app-specific-password]
Note: Only if using email features
```

---

### Step 5: Deploy (1 click)

1. Click **"Deploy Web Service"**
2. Watch the deployment logs
3. Wait for **"Your service is live!"** message
4. This takes 5-10 minutes

---

### Step 6: Get Your Backend URL

Once deployed, you'll see a URL like:
```
https://msd-project.onrender.com
```

**Copy this URL** - you'll need it for the frontend!

---

## ✅ VERIFY DEPLOYMENT

### Test 1: Health Check

Open in browser or terminal:
```bash
curl https://msd-project.onrender.com/health
```

Should return:
```json
{"status": "Server is running"}
```

### Test 2: API Test

Using Postman or curl, test the register endpoint:
```bash
curl -X POST https://msd-project.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

Should return:
```json
{"message": "User registered successfully", "token": "..."}
```

### Test 3: Check Logs

1. Go to Render dashboard
2. Select your service
3. Click **"Logs"** tab
4. Should see: `Server running on port 5000`

---

## 🔄 AUTO-DEPLOY

After deployment, Render will automatically redeploy when you:

1. Push code to `main` branch on GitHub
2. Update environment variables in Render dashboard

**To disable auto-deploy:**
- Settings → Auto-Deploy: Off

---

## 📊 MONITORING

### View Logs
1. Render Dashboard → Your Service → Logs
2. Scroll to see real-time server output
3. Look for errors in red

### View Metrics
1. Render Dashboard → Your Service → Metrics
2. Monitor CPU, Memory, Network usage
3. Check uptime percentage

### View Events
1. Render Dashboard → Your Service → Events
2. See deployment history
3. See restarts and updates

---

## 🛠️ TROUBLESHOOTING

### Build Fails
**Error**: `Build failed`

**Solution**:
1. Check build log for specific error
2. Ensure `pnpm run start` works locally:
   ```bash
   cd backend/server
   node index.js
   ```
3. Check all environment variables are set correctly

### Service Won't Start
**Error**: `Service exited with code 1`

**Solution**:
1. Check Logs tab for error message
2. Verify MongoDB connection:
   - MONGODB_URI is correct
   - Add IP 0.0.0.0/0 to MongoDB Atlas Network Access
3. Verify PORT is set to 5000

### Cannot Connect from Frontend
**Error**: `CORS error` or `Connection refused`

**Solution**:
1. Ensure CLIENT_URL in Render is correct
2. Check frontend is accessing correct backend URL
3. Verify CORS headers in backend code:
   ```javascript
   const io = new Server(server, {
     cors: {
       origin: process.env.CLIENT_URL,
       methods: ["GET", "POST"]
     }
   })
   ```

### MongoDB Connection Failed
**Error**: `MongoDB connection error`

**Solution**:
1. Go to MongoDB Atlas → Network Access
2. Add IP: `0.0.0.0/0`
3. Wait 5 minutes for change to take effect
4. Redeploy service in Render

---

## 📈 PERFORMANCE

### Startup Time
- Cold start: 30-60 seconds
- Warm start: 5-10 seconds

### Response Time
- API responses: < 200ms
- WebSocket: < 50ms latency

### Uptime
- Free tier: 99% (spins down after inactivity)
- Starter+: 99.9%

---

## 💰 PRICING

| Plan | Cost | RAM | CPU | Best For |
|------|------|-----|-----|----------|
| Free | $0/month | 512 MB | 0.1 | Testing & development |
| Starter | $7/month | 512 MB | 0.5 CPU | Small production apps |
| Standard | $25/month | 2 GB | 1 CPU | Medium production apps |

**Recommendation**: Start with Free, upgrade to Starter ($7/month) for production.

---

## 🔗 USEFUL LINKS

- **Render Dashboard**: https://dashboard.render.com
- **Render Docs**: https://render.com/docs
- **Node on Render**: https://render.com/docs/deploy-node-express-app
- **Your Service URL**: https://msd-project.onrender.com
- **GitHub Repo**: https://github.com/Rakeshrocky330/msd-project

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Render account created
- [ ] GitHub repository selected
- [ ] Service name: `msd-project`
- [ ] Environment: Node
- [ ] Region: Oregon
- [ ] Build Command: `pnpm install --frozen-lockfile; pnpm run build`
- [ ] Start Command: `pnpm run start`
- [ ] PORT environment variable set
- [ ] MONGODB_URI environment variable set
- [ ] JWT_SECRET environment variable set
- [ ] NODE_ENV = production
- [ ] Deployment started
- [ ] Deployment completed (5-10 minutes)
- [ ] Health check passed
- [ ] Backend URL: https://msd-project.onrender.com
- [ ] Saved URL for frontend configuration

---

## 🎉 DONE!

Your backend is now deployed on Render!

**Your Backend URL:**
```
https://msd-project.onrender.com
```

**Next Steps:**
1. Use this URL in your frontend deployment (if deploying frontend)
2. Update `CLIENT_URL` in Render if deploying frontend later
3. Monitor logs and metrics regularly

---

**Estimated Time**: 15-20 minutes total
**Cost**: $0 (free tier) or $7/month (starter)
**Status**: ✅ Ready to use!
