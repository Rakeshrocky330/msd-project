# 🔧 FIX MONGODB CONNECTION ERROR

## THE PROBLEM

Your Render deployment shows this error:
```
MongoDB connection error: Error: querySrv ENOTFOUND _mongodb._tcp.123
```

This means the MongoDB connection string is **incomplete or corrupted** in your Render environment variables.

---

## ✅ SOLUTION: UPDATE MONGODB_URI

### Step 1: Go to Render Dashboard

1. Go to https://dashboard.render.com
2. Click on your service: **msd-project**
3. Go to **Environment** tab

### Step 2: Find MONGODB_URI

Look for the environment variable named `MONGODB_URI`

**Current (WRONG):**
```
MONGODB_URI=mongodb+srv://231fa04a06:rakesh@123@cluster0.as0oqft.mongodb.net/?appName=Cluster0
```

**Problem**: The password contains `@123` which needs to be URL-encoded!

---

## 🔐 CORRECT MONGODB_URI

The password `rakesh@123` has special characters that need encoding.

Replace with this **EXACT** string:

```
MONGODB_URI=mongodb+srv://231fa04a06:rakesh%40123@cluster0.as0oqft.mongodb.net/?appName=Cluster0
```

**Key changes:**
- `@123` → `%40123` (@ symbol URL-encoded as %40)
- Everything else stays the same

---

## 📋 COMPLETE ENVIRONMENT VARIABLES

Update ALL your environment variables to these exact values:

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://231fa04a06:rakesh%40123@cluster0.as0oqft.mongodb.net/?appName=Cluster0` |
| `JWT_SECRET` | `your-32-character-random-string` |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | `http://localhost:3000` (or your frontend URL) |

---

## 🚀 HOW TO UPDATE IN RENDER

### Step-by-Step:

1. Go to https://dashboard.render.com
2. Click your service **msd-project**
3. Click **Environment** tab
4. Find **MONGODB_URI**
5. Click the **edit icon** (pencil)
6. Clear the current value
7. Paste this exact string:
   ```
   mongodb+srv://231fa04a06:rakesh%40123@cluster0.as0oqft.mongodb.net/?appName=Cluster0
   ```
8. Click **Save**
9. Wait for automatic redeploy (2-3 minutes)

---

## ✅ VERIFY THE FIX

### Check Logs

1. Go to your service
2. Click **Logs** tab
3. You should see:
   ```
   Server running on port 5000
   MongoDB connection successful ✅
   ```

### Instead of:
```
MongoDB connection error: Error: querySrv ENOTFOUND _mongodb._tcp.123 ❌
```

---

## 🧪 TEST CONNECTION

### Test 1: Health Check
```bash
curl https://msd-project-c39k.onrender.com/health
```

Should return:
```json
{"status": "Server is running"}
```

### Test 2: Register User
```bash
curl -X POST https://msd-project-c39k.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

Should return user data (not error).

---

## 📝 MONGODB_URI EXPLANATION

Breaking down the correct connection string:

```
mongodb+srv://231fa04a06:rakesh%40123@cluster0.as0oqft.mongodb.net/?appName=Cluster0
           ↑              ↑         ↑
        username       password   cluster
```

**Components:**
- **Username**: `231fa04a06` (your MongoDB user)
- **Password**: `rakesh%40123` (URL-encoded: `rakesh@123`)
- **Cluster**: `cluster0.as0oqft.mongodb.net` (your cluster)
- **Options**: `?appName=Cluster0` (connection options)

---

## 🔒 SECURITY NOTE

**Important**: The `%40` is just URL encoding for the `@` symbol.
- `@` in URLs must be encoded as `%40` to avoid confusion
- This is a standard URL encoding practice
- It doesn't change the actual password

---

## ⚡ QUICK FIX SUMMARY

**Before (BROKEN):**
```
MONGODB_URI=mongodb+srv://231fa04a06:rakesh@123@cluster0.as0oqft.mongodb.net/?appName=Cluster0
```

**After (FIXED):**
```
MONGODB_URI=mongodb+srv://231fa04a06:rakesh%40123@cluster0.as0oqft.mongodb.net/?appName=Cluster0
```

**Change**: Replace `@123` with `%40123`

---

## ✅ NEXT STEPS

1. Update `MONGODB_URI` in Render with correct URL-encoded password
2. Click Save (auto-redeploy starts)
3. Wait 2-3 minutes for redeploy
4. Check logs for "MongoDB connection successful"
5. Test health endpoint
6. Create test account to verify DB connection works
7. Done! ✅

---

**Status After Fix:**
- ✅ MongoDB connection works
- ✅ User registration works
- ✅ Real-time features enabled
- ✅ Backend ready for frontend integration

