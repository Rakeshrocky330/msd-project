# Environment Variables Configuration - Frontend Deployment

## 📋 Frontend Environment Variables for Render

### Frontend: `msd-project-frontend`

All variables to add in Render dashboard:

```
NODE_ENV = production
VITE_API_URL = https://msd-project-c39k.onrender.com
VITE_SOCKET_URL = https://msd-project-c39k.onrender.com
PORT = 3000
```

---

## 🔧 What Each Variable Does

| Variable | Value | Purpose | Where Used |
|----------|-------|---------|-----------|
| `NODE_ENV` | `production` | Build mode - optimizes for production | Vite build process |
| `VITE_API_URL` | `https://msd-project-c39k.onrender.com` | Backend REST API endpoint | API calls in React |
| `VITE_SOCKET_URL` | `https://msd-project-c39k.onrender.com` | WebSocket server URL | Real-time Socket.io connection |
| `PORT` | `3000` | Server port (Render may override) | Express server startup |

---

## 🌍 Environment File Example

### Local Development: `frontend/vite/.env.local`

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### Production Build: `frontend/vite/.env.production`

```env
VITE_API_URL=https://msd-project-c39k.onrender.com
VITE_SOCKET_URL=https://msd-project-c39k.onrender.com
```

---

## 📍 Step-by-Step: Add Variables in Render

### 1. Go to Render Dashboard
https://dashboard.render.com

### 2. Select Frontend Service
Click `msd-project-frontend`

### 3. Click "Environment" Tab
Located in top menu

### 4. Add Each Variable

**For each variable below, click "Add Environment Variable":**

#### Variable 1:
```
Key:    NODE_ENV
Value:  production
Click:  Add
```

#### Variable 2:
```
Key:    VITE_API_URL
Value:  https://msd-project-c39k.onrender.com
Click:  Add
```

#### Variable 3:
```
Key:    VITE_SOCKET_URL
Value:  https://msd-project-c39k.onrender.com
Click:  Add
```

#### Variable 4:
```
Key:    PORT
Value:  3000
Click:  Add
```

### 5. Verify All Variables Are Listed

You should see all 4 variables in the list:
- ✅ NODE_ENV = production
- ✅ VITE_API_URL = https://msd-project-c39k.onrender.com
- ✅ VITE_SOCKET_URL = https://msd-project-c39k.onrender.com
- ✅ PORT = 3000

### 6. Trigger Redeploy

After adding variables:
- Go back to "Overview" tab
- Render automatically detects the change
- Service redeploys in 1-2 minutes
- Watch "Deploy log" for completion

---

## 🔐 Backend: Recommended Additional Variables

### Backend: `msd-project-c39k`

**If not already set**, add these too (for CORS):

```
CLIENT_URL = https://msd-project-frontend.onrender.com
```

**Steps:**
1. Go to Render dashboard
2. Select `msd-project-c39k` (backend)
3. Click "Environment"
4. Add/update CLIENT_URL
5. Click Save

This ensures frontend requests aren't blocked by CORS.

---

## ✅ Verification Checklist

- [ ] Go to Render dashboard
- [ ] Select `msd-project-frontend`
- [ ] Click "Environment" tab
- [ ] See all 4 variables listed
- [ ] Values match URLs exactly (copy-paste to avoid typos)
- [ ] Backend service also has variables set
- [ ] Service shows "LIVE" status
- [ ] Logs show successful redeploy

---

## 🧪 Test Variables Are Working

### In Browser Console:

```javascript
// Check if variables are available in frontend
console.log('API URL:', import.meta.env.VITE_API_URL)
console.log('Socket URL:', import.meta.env.VITE_SOCKET_URL)
console.log('Node Env:', import.meta.env.NODE_ENV)
```

**Expected Output:**
```
API URL: https://msd-project-c39k.onrender.com
Socket URL: https://msd-project-c39k.onrender.com
Node Env: production
```

### Test API Connection:

```javascript
fetch(import.meta.env.VITE_API_URL + '/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend connected:', d))
  .catch(e => console.error('❌ Error:', e.message))
```

**Expected Output:**
```
✅ Backend connected: {status: "Server is running", ...}
```

---

## 🚨 Common Issues with Variables

### ❌ "Cannot read property of undefined"

**Cause:** Variables not set in Render

**Fix:**
1. Go to Environment tab
2. Add all 4 variables
3. Save (triggers redeploy)
4. Wait 2-3 minutes

### ❌ CORS/Socket.io Not Connecting

**Cause:** Wrong URL in VITE_SOCKET_URL

**Check:**
- Verify URL is exactly: `https://msd-project-c39k.onrender.com`
- No trailing slash
- No `http://` (must be `https://`)
- No port number included

### ❌ API calls fail with 404

**Cause:** Wrong VITE_API_URL

**Check:**
- Verify backend service name in URL
- Render URL format: `https://service-name.onrender.com`
- Check backend service is still LIVE

---

## 📝 Variable Reference for Copy-Paste

### Exact Values to Copy:

**If backend is:** `msd-project-c39k.onrender.com`

Then use:
```
VITE_API_URL=https://msd-project-c39k.onrender.com
VITE_SOCKET_URL=https://msd-project-c39k.onrender.com
```

**If backend is different name:**

Replace `msd-project-c39k` with your backend service name

---

## 🔄 If You Change Backend URL

1. Update frontend environment variables in Render
2. Go to Environment tab
3. Update both VITE_API_URL and VITE_SOCKET_URL
4. Save (auto-redeploy)
5. Frontend will use new backend URL

---

## 💡 Pro Tips

1. **Always use `https://`** for production Render URLs
2. **No trailing slash** at end of URLs
3. **Use exact same URL** for VITE_API_URL and VITE_SOCKET_URL (both point to backend)
4. **Test with curl** to verify backend is accessible:
   ```bash
   curl https://msd-project-c39k.onrender.com/health
   ```

---

## 📚 Reference

- **Vite Env Variables:** https://vitejs.dev/guide/env-and-mode.html
- **Render Environment:** https://render.com/docs/environment-variables
- **Backend Service:** https://msd-project-c39k.onrender.com
- **Frontend Service:** https://msd-project-frontend.onrender.com
