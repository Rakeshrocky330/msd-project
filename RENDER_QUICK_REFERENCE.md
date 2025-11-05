# 🚀 RENDER BACKEND DEPLOYMENT - QUICK REFERENCE CARD

## CONFIGURATION AT A GLANCE

```
┌─────────────────────────────────────────────────────┐
│          RENDER BACKEND DEPLOYMENT CONFIG           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Service Name:      msd-project                     │
│  Runtime:           Node                            │
│  Region:            Oregon (US West)                │
│  Branch:            main                            │
│  Instance:          Free or Starter                 │
│                                                     │
├─────────────────────────────────────────────────────┤
│  BUILD & START                                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Build:  pnpm install --frozen-lockfile             │
│          pnpm run build                             │
│                                                     │
│  Start:  pnpm run start                             │
│                                                     │
├─────────────────────────────────────────────────────┤
│  ENVIRONMENT VARIABLES                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  PORT=5000                                          │
│  NODE_ENV=production                                │
│  MONGODB_URI=mongodb+srv://231fa04a06:rakesh@1... │
│  JWT_SECRET=[32-char-random-string]                │
│  CLIENT_URL=http://localhost:3000                  │
│                                                     │
├─────────────────────────────────────────────────────┤
│  RESULT                                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  URL: https://msd-project.onrender.com             │
│  Health: /health endpoint                          │
│  Socket.io: ✅ Enabled                             │
│  Status: 🟢 Live in 5-10 minutes                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## COPY-PASTE VALUES

### Build Command (Copy Exactly)
```
pnpm install --frozen-lockfile; pnpm run build
```

### Start Command (Copy Exactly)
```
pnpm run start
```

### Environment Variables (Copy and Modify)

**Copy this block and paste into Render environment variables:**

```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://231fa04a06:rakesh@123@cluster0.as0oqft.mongodb.net/?appName=Cluster0
JWT_SECRET=aB3$xK9mL#pQ2wE7rT5yU8oI4uJ6fH1gD0cV4nB2xZ
CLIENT_URL=http://localhost:3000
EMAIL_USER=[optional]
EMAIL_PASSWORD=[optional]
```

**⚠️ IMPORTANT**: Replace `JWT_SECRET` with your own value:
- Windows: `[System.Convert]::ToBase64String([System.Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes(32))`
- macOS/Linux: `openssl rand -base64 32`

---

## DEPLOYMENT STEPS (TL;DR)

1. Go to https://render.com
2. Sign up with GitHub
3. Create Web Service
4. Select `Rakeshrocky330/msd-project`
5. Name: `msd-project`
6. Environment: `Node`
7. Region: `Oregon`
8. Build: `pnpm install --frozen-lockfile; pnpm run build`
9. Start: `pnpm run start`
10. Add 5 environment variables (see above)
11. Click Deploy
12. Wait 5-10 minutes
13. **Done!** → `https://msd-project.onrender.com`

---

## VERIFICATION COMMANDS

### Check if Backend is Running
```bash
curl https://msd-project.onrender.com/health
# Should return: {"status": "Server is running"}
```

### Test API Endpoint
```bash
curl -X POST https://msd-project.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"Password123"}'
```

### Check Real-time (Socket.io)
- Open browser DevTools (F12)
- Go to Network tab
- Filter for "WS"
- Should see socket.io connection to backend

---

## COMMON ERRORS & FIXES

| Error | Fix |
|-------|-----|
| Build failed | Check build log, ensure pnpm installed locally |
| Service won't start | Check environment variables, verify MONGODB_URI |
| Cannot connect from frontend | Update CLIENT_URL to match frontend domain |
| MongoDB connection error | Add 0.0.0.0/0 to MongoDB Atlas Network Access |
| WebSocket fails | Ensure CLIENT_URL is set correctly in Render |

---

## AFTER DEPLOYMENT

### Your Backend URL
```
https://msd-project.onrender.com
```

### Use This URL For:
- Frontend API calls: `VITE_API_URL=https://msd-project.onrender.com`
- Socket.io connection: `https://msd-project.onrender.com`
- Testing APIs manually
- Health checks: `https://msd-project.onrender.com/health`

### Update Later If Needed:
- Environment variables → Render Dashboard
- Code changes → Push to GitHub (auto-redeploys)
- Instance type → Render Dashboard Settings

---

## PRICING QUICK REFERENCE

| Tier | Cost | RAM | CPU | Use |
|------|------|-----|-----|-----|
| **Free** | $0 | 512MB | 0.1 | Testing |
| **Starter** | $7/mo | 512MB | 0.5 | Production |
| **Standard** | $25/mo | 2GB | 1 | Heavy load |

**Pro tip**: Start free, upgrade to Starter ($7/month) for production use.

---

## CHECKLIST

- [ ] Render account created
- [ ] GitHub authorized
- [ ] Service created with name `msd-project`
- [ ] Build command copied correctly
- [ ] Start command copied correctly
- [ ] All 5 environment variables added
- [ ] JWT_SECRET generated and unique
- [ ] Deployment clicked
- [ ] Waiting for "Your service is live!"
- [ ] Tested health endpoint
- [ ] Backend URL noted: `https://msd-project.onrender.com`

---

## MONITORING

**View Logs:**
- Render Dashboard → Service → Logs tab
- Shows real-time server output

**View Metrics:**
- Render Dashboard → Service → Metrics tab
- CPU, Memory, Network usage

**View Events:**
- Render Dashboard → Service → Events tab
- Deployment history and restarts

---

**Status: ✅ Ready to Deploy**

Start at: https://render.com
Time Needed: 15-20 minutes
Cost: $0-7/month
