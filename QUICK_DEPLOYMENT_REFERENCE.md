# 🚀 QUICK DEPLOYMENT REFERENCE

## URL SUMMARY
After deployment, your services will be at:

```
Frontend:  https://msd-project-frontend.vercel.app
Backend:   https://msd-project-backend.onrender.com
Database:  MongoDB Atlas (Cloud)
```

---

## ENVIRONMENT VARIABLES NEEDED

### For Render (Backend)
```
MONGODB_URI               → mongodb+srv://231fa04a06:rakesh@123@cluster0.as0oqft.mongodb.net/?appName=Cluster0
JWT_SECRET                → [Generate strong secret]
NODE_ENV                  → production
PORT                      → 5000
CLIENT_URL                → https://msd-project-frontend.vercel.app
EMAIL_USER                → [Optional]
EMAIL_PASSWORD            → [Optional]
```

### For Vercel (Frontend)
```
VITE_API_URL              → https://msd-project-backend.onrender.com
REACT_APP_API_URL         → https://msd-project-backend.onrender.com
VITE_SOCKET_URL           → https://msd-project-backend.onrender.com
REACT_APP_SOCKET_URL      → https://msd-project-backend.onrender.com
```

---

## DEPLOYMENT COMMANDS (Local Testing)

```bash
# Test build locally
cd frontend/vite
npm run build

# Test backend locally
cd backend/server
node index.js

# Or from root
pnpm run server
pnpm run client
```

---

## RENDER DEPLOYMENT COMMANDS

### Via render.yaml
```bash
# Render uses render.yaml in root directory
# Just push to GitHub and Render will deploy automatically
git push origin main
```

### Manual Configuration
- Service: Web Service
- Environment: Node
- Region: oregon (or closest)
- Build: `npm install`
- Start: `node backend/server/index.js`
- Root: `/` (automatic)

---

## VERCEL DEPLOYMENT COMMANDS

### Via vercel.json
```bash
# Vercel uses vercel.json for configuration
# Environment variables set in Vercel dashboard
git push origin main
```

### Manual Configuration
- Framework: Vite
- Root: `frontend/vite`
- Build: `npm run build`
- Output: `dist`
- Install: `npm install`

---

## HEALTH CHECKS

```bash
# Check backend is running
curl https://msd-project-backend.onrender.com/health

# Expected response
{"status": "Server is running"}
```

---

## VERIFY DEPLOYMENT

### Frontend ✅
- [ ] Load https://msd-project-frontend.vercel.app
- [ ] Page renders (no 404)
- [ ] No CORS errors in console
- [ ] API requests go to correct backend URL

### Backend ✅
- [ ] Health endpoint returns 200
- [ ] Can make API calls from frontend
- [ ] Socket.io connects successfully
- [ ] Database queries work

### Real-time ✅
- [ ] Open DevTools → Network
- [ ] Filter for "WS" (WebSocket)
- [ ] Should see Socket.io connection
- [ ] Real-time updates work (create activity, see it appear)

---

## COMMON ISSUES & FIXES

| Issue | Solution |
|-------|----------|
| Frontend shows "API Error" | Check VITE_API_URL in Vercel environment variables |
| Socket.io connection fails | Update CLIENT_URL in Render to match Vercel URL |
| 404 on frontend routes | Check Root Directory is `frontend/vite` in Vercel |
| Backend build fails | Ensure `render.yaml` is in root directory |
| MongoDB won't connect | Add 0.0.0.0/0 to MongoDB Atlas network access |
| CORS errors | Check CORS config in backend/server/index.js |

---

## PRODUCTION CHECKLIST

- [ ] JWT_SECRET changed to strong random value
- [ ] NODE_ENV = production
- [ ] All environment variables set in both platforms
- [ ] No console.log() in production code
- [ ] Database backups enabled
- [ ] Error monitoring set up
- [ ] Performance monitoring enabled
- [ ] Auto-deploy from GitHub enabled

---

## FILES CREATED FOR DEPLOYMENT

✅ `DEPLOYMENT_VERCEL_RENDER.md` - Full guide
✅ `DEPLOYMENT_CHECKLIST.md` - Step-by-step checklist
✅ `render.yaml` - Render configuration
✅ `vercel.json` - Vercel configuration (updated)
✅ `backend/server/.env.production` - Backend production env
✅ `frontend/vite/.env.production` - Frontend production env
✅ `QUICK_DEPLOYMENT_REFERENCE.md` - This file

---

## DEPLOYMENT FLOW

```
1. Push to GitHub (main branch)
   ↓
2. Deploy backend on Render
   - Select GitHub repo
   - Set environment variables
   - Deploy (5-10 min)
   ↓
3. Get backend URL: https://msd-project-backend.onrender.com
   ↓
4. Deploy frontend on Vercel
   - Import GitHub repo
   - Set root directory: frontend/vite
   - Set backend URL in environment
   - Deploy (2-5 min)
   ↓
5. Get frontend URL: https://msd-project-frontend.vercel.app
   ↓
6. Update backend CLIENT_URL in Render
   - Add frontend URL
   - Redeploy (2-3 min)
   ↓
7. Test all features
   - Register, login
   - Create activities
   - Check real-time updates
   ✅ LIVE!
```

---

## MONITORING DASHBOARDS

- **Render**: https://dashboard.render.com
- **Vercel**: https://vercel.com/dashboard
- **MongoDB Atlas**: https://cloud.mongodb.com
- **GitHub**: https://github.com/Rakeshrocky330/msd-project

---

## SCALE RECOMMENDATIONS

### When Free Tier Isn't Enough

**Render**:
- Free: 0.5 vCPU, 512 MB RAM, ~1 request/sec
- Upgrade when: High traffic, slow response times
- Plan: Pro ($7-15/month)

**Vercel**:
- Free: Unlimited bandwidth, 100 deployments/month
- Upgrade when: Need faster builds, priority support
- Plan: Pro ($20/month)

**MongoDB Atlas**:
- Free: 512 MB storage, no backup
- Upgrade when: More storage needed, backups required
- Plan: $9/month or higher

---

**Ready to Deploy?** ✅
Start with the DEPLOYMENT_CHECKLIST.md file for step-by-step instructions.

**Questions?** Check DEPLOYMENT_VERCEL_RENDER.md for detailed information.
