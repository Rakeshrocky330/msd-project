# 🚀 RENDER DEPLOYMENT GUIDE - Step by Step

## DEPLOYMENT CONFIGURATION FOR RENDER

Your backend (Express.js + Socket.io) will be deployed on Render with the following specifications:

---

## 📋 RENDER SERVICE CONFIGURATION

### Basic Settings

| Setting | Value |
|---------|-------|
| **Service Name** | `msd-project` |
| **Language/Runtime** | Node |
| **Branch** | main |
| **Region** | Oregon (US West) |
| **Instance Type** | Free (or Starter for production) |
| **Root Directory** | (leave empty - uses repository root) |

---

## 🔧 BUILD & START COMMANDS

### Build Command
```bash
pnpm install --frozen-lockfile; pnpm run build
```

**What it does:**
- Installs dependencies using pnpm with exact versions
- `--frozen-lockfile` ensures reproducible builds
- `pnpm run build` prepares the application (if needed)

### Start Command
```bash
pnpm run start
```

**What it does:**
- Runs the start script from package.json
- Starts the Express server on the configured PORT
- Initializes Socket.io server
- Connects to MongoDB Atlas

---

## 🌍 ENVIRONMENT VARIABLES TO SET

Add these in Render dashboard → Environment Variables:

### 1. Core Configuration
```
PORT
Value: 5000
```

### 2. Database Connection
```
MONGODB_URI
Value: mongodb+srv://231fa04a06:rakesh@123@cluster0.as0oqft.mongodb.net/?appName=Cluster0
```

### 3. Security
```
JWT_SECRET
Value: [Generate a strong random string, min 32 characters]
Example: aB3$xK9mL#pQ2wE7rT5yU8oI4uJ6fH1gD0cV4nB2xZ

Note: Generate using: openssl rand -base64 32
Or use: https://www.random.org/strings/
```

### 4. Environment Mode
```
NODE_ENV
Value: production
```

### 5. Frontend URL (CORS)
```
CLIENT_URL
Value: https://msd-project-frontend.vercel.app
Note: Update after deploying frontend on Vercel
```

### 6. Email Configuration (Optional)
```
EMAIL_USER
Value: [Your email address for notifications]

EMAIL_PASSWORD
Value: [App-specific password for Gmail or similar]
Note: Only if you want email features enabled
```

### Summary of All Variables
```
PORT=5000
MONGODB_URI=mongodb+srv://231fa04a06:rakesh@123@cluster0.as0oqft.mongodb.net/?appName=Cluster0
JWT_SECRET=[strong-random-32-char-string]
NODE_ENV=production
CLIENT_URL=https://msd-project-frontend.vercel.app
EMAIL_USER=[optional]
EMAIL_PASSWORD=[optional]
```

---

## 💾 INSTANCE TYPE SELECTION

### Free Tier (Recommended for testing)
- **Cost**: $0/month
- **RAM**: 512 MB
- **CPU**: 0.1 CPU
- **Limitations**: Spins down after 15 minutes of inactivity
- **Best for**: Development, testing, low-traffic apps
- **Socket.io**: ✅ Supported
- **WebSocket**: ✅ Supported

### Starter Tier (Recommended for production)
- **Cost**: $7/month
- **RAM**: 512 MB
- **CPU**: 0.5 CPU
- **Features**: Always running, auto-restart on crash
- **Best for**: Small production apps, hobby projects
- **Socket.io**: ✅ Full support
- **WebSocket**: ✅ Full support

### Standard+ Tiers
- For higher traffic and professional apps
- More RAM and CPU
- Priority support
- Custom scaling options

**Recommendation**: Start with **Free tier** for testing, upgrade to **Starter** ($7/month) for production use.

---

## 🚀 STEP-BY-STEP DEPLOYMENT PROCESS

### Step 1: Prepare Your Repository
```bash
# Ensure code is pushed to GitHub
cd "c:\Users\user\OneDrive\ドキュメント\a06 msd"
git status
git push origin main
```

### Step 2: Create Render Account
- Go to https://render.com
- Sign up with GitHub account (easiest)
- Authorize GitHub access

### Step 3: Create New Web Service
1. Click **"New +"** button
2. Select **"Web Service"**
3. Click **"Connect a repository"**
4. Find and select: `Rakeshrocky330/msd-project`
5. Click **"Connect"**

### Step 4: Configure Service

Fill in the form with these values:

```
Name:                     msd-project
Environment:              Node
Region:                   Oregon
Branch:                   main
Root Directory:           (leave empty)
Build Command:            pnpm install --frozen-lockfile; pnpm run build
Start Command:            pnpm run start
Instance Type:            Free (for testing) or Starter (for production)
```

### Step 5: Add Environment Variables

Click **"Add Environment Variable"** for each:

```
1. PORT = 5000
2. MONGODB_URI = mongodb+srv://231fa04a06:rakesh@123@cluster0.as0oqft.mongodb.net/?appName=Cluster0
3. JWT_SECRET = [your-32-char-random-string]
4. NODE_ENV = production
5. CLIENT_URL = (leave empty for now, update after Vercel deployment)
6. EMAIL_USER = (optional - leave empty if not using)
7. EMAIL_PASSWORD = (optional - leave empty if not using)
```

### Step 6: Deploy
- Click **"Deploy Web Service"**
- Watch the deployment logs
- Wait for "Your service is live!" message (5-10 minutes)
- Note the URL: `https://msd-project.onrender.com`

### Step 7: Verify Deployment
```bash
# Test the health endpoint
curl https://msd-project.onrender.com/health

# Expected response:
# {"status": "Server is running"}
```

---

## 📊 RENDER DASHBOARD REFERENCE

### Monitor Your Service

**Logs Tab**:
- Real-time server logs
- Error tracking
- Connection status
- Database queries

**Metrics Tab**:
- CPU usage
- Memory usage
- Request/response times
- Uptime percentage

**Events Tab**:
- Deployment history
- Auto-restart events
- Environment variable changes

**Settings Tab**:
- Modify configuration
- Update environment variables
- Change instance type
- Add custom domains

---

## 🔄 AUTO-DEPLOY CONFIGURATION

Render automatically deploys when you push to GitHub:

1. Push code to `main` branch
2. Render detects the push
3. Automatically builds and deploys
4. Updates your service (no downtime with Starter plan)

**To disable auto-deploy**:
- Go to Settings tab
- Toggle "Auto-deploy on push"

---

## 🧪 TESTING AFTER DEPLOYMENT

### Test 1: Health Check
```bash
curl https://[your-render-url]/health
# Should respond with: {"status": "Server is running"}
```

### Test 2: API Endpoints
```bash
# Example: Register endpoint (from Postman or similar)
POST https://[your-render-url]/api/auth/register
Body:
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "TestPassword123"
}
```

### Test 3: Socket.io Connection
- Deploy frontend on Vercel
- Open frontend in browser
- Open DevTools (F12)
- Check Network tab for WebSocket connections
- Should see `wss://[your-render-url]/socket.io` connection

### Test 4: Database Connection
- Create a new account via frontend
- Should appear in MongoDB Atlas collection
- Confirms database connectivity works

---

## 🚨 TROUBLESHOOTING

### Issue: Service won't start
**Cause**: Command error or missing dependencies

**Fix**:
1. Check logs for error messages
2. Ensure `package.json` has correct scripts:
   ```json
   "start": "node backend/server/index.js"
   ```
3. Try build command locally:
   ```bash
   pnpm install --frozen-lockfile
   npm run build  # or equivalent
   ```

### Issue: WebSocket connection fails
**Cause**: Socket.io not properly configured or CORS issue

**Fix**:
1. Verify `CLIENT_URL` matches your Vercel frontend URL
2. Check backend code has proper CORS:
   ```javascript
   const io = new Server(server, {
     cors: {
       origin: process.env.CLIENT_URL,
       methods: ["GET", "POST"]
     }
   })
   ```
3. Ensure environment variable is set in Render

### Issue: Cannot connect to MongoDB
**Cause**: Network access not configured or wrong connection string

**Fix**:
1. Go to MongoDB Atlas
2. Network Access → Add IP Address
3. Add: `0.0.0.0/0` (allows all IPs)
4. Verify connection string in Render environment

### Issue: "Free tier spinning down" after deployment
**Cause**: Free tier spins down after 15 minutes of inactivity

**Fix**:
- Upgrade to Starter tier ($7/month)
- Or accept brief spin-up time on first request after inactivity

---

## 📈 SCALING RECOMMENDATIONS

### When to Upgrade Instance Type

| Metric | Recommendation |
|--------|-----------------|
| High CPU usage (>80%) | Upgrade to Starter or higher |
| Frequent out-of-memory errors | Upgrade to Standard (2GB RAM) |
| Slow response times | Upgrade or optimize code |
| 502 Bad Gateway errors | Increase instance type or fix code errors |
| Handling >1000 requests/min | Move to Standard or Pro |

### Upgrade Process
1. Go to Service Settings
2. Click "Change Instance Type"
3. Select new tier
4. Confirm upgrade
5. Service redeploys with new resources

---

## 🔐 SECURITY BEST PRACTICES

- ✅ Use strong JWT_SECRET (32+ characters, random)
- ✅ Never commit `.env` files to Git
- ✅ Mark sensitive variables as "Secret" in Render
- ✅ Use HTTPS only (Render provides this automatically)
- ✅ Enable CORS only for your frontend domain
- ✅ Regularly rotate secrets
- ✅ Monitor logs for suspicious activity
- ✅ Keep dependencies updated

---

## 💰 PRICING SUMMARY

**Free Tier**: $0/month
- Perfect for development and testing
- 512 MB RAM, 0.1 CPU
- Spins down after 15 min inactivity

**Starter Tier**: $7/month
- Good for small production apps
- 512 MB RAM, 0.5 CPU
- Always running, auto-restart
- **Recommended for your project**

**Pro Tiers**: $25-$450/month
- For growing traffic
- More RAM and CPU
- Advanced features and support

---

## 📞 NEXT STEPS

1. ✅ Prepare: Push code to GitHub
2. ▶️ Create Render account and service
3. ▶️ Configure with settings from this guide
4. ▶️ Add environment variables
5. ▶️ Deploy and wait for completion
6. ▶️ Get your Render URL
7. ▶️ Deploy frontend on Vercel
8. ▶️ Update CLIENT_URL in Render
9. ▶️ Test all features

---

## 📚 ADDITIONAL RESOURCES

- **Render Docs**: https://render.com/docs
- **Node.js on Render**: https://render.com/docs/deploy-node-express-app
- **Environment Variables**: https://render.com/docs/environment-variables
- **WebSocket Support**: https://render.com/docs/websocket-support
- **Custom Domains**: https://render.com/docs/custom-domains

---

**You're ready to deploy!** 🎉

### Your Configuration Summary:
- **Service**: msd-project
- **Runtime**: Node
- **Build**: `pnpm install --frozen-lockfile; pnpm run build`
- **Start**: `pnpm run start`
- **Region**: Oregon (US West)
- **Instance**: Free/Starter
- **Database**: MongoDB Atlas
- **Socket.io**: ✅ Enabled

**Estimated Deployment Time**: 5-10 minutes
**Cost**: $0 (free tier) or $7/month (starter)
