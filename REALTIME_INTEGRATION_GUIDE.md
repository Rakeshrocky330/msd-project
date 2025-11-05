# Real-Time Data Integration Guide

## Overview
This document describes the complete real-time data integration between the Express backend and Vite/React frontend using Socket.io WebSockets and REST APIs.

## Architecture

### Backend Structure

#### 1. **Models** (`backend/server/models/`)
- **Activity.js** - Tracks user actions (login, log created, goal completed, etc.)
- **Analytics.js** - Stores aggregated user statistics (learning hours, streaks, counts)
- **Notification.js** - User notifications (achievements, reminders, system messages)

#### 2. **Controllers** (`backend/server/controllers/`)
- **activityController.js** - CRUD operations for activities
- **analyticsController.js** - Statistics and analytics management
- **notificationController.js** - Notification management

#### 3. **Routes** (`backend/server/routes/`)
- **activity.js** - `/api/activities/*` endpoints
- **analytics.js** - `/api/analytics/*` endpoints
- **notification.js** - `/api/notifications/*` endpoints

#### 4. **WebSocket Server** (`backend/server/index.js`)
- Uses Socket.io for real-time communication
- Events:
  - `user:login` - Register user as active
  - `activity:create` - Broadcast new activity to all users
  - `data:request` - Request real-time data updates
  - `users:status` - Broadcast active user count
  - `activity:created` - Notify user of new activity
  - `notification:received` - Push notification to user
  - `analytics:updated` - Update analytics in real-time

---

## Backend API Endpoints

### Activities API (`/api/activities`)

```
GET /api/activities/:userId
  Query: limit=20, skip=0
  Response: { activities, total, hasMore }

GET /api/activities/:userId/unread/count
  Response: { unreadCount }

POST /api/activities
  Body: { userId, type, title, description, data }
  Types: login, log_created, goal_completed, skill_added, portfolio_updated, email_sent
  Response: Activity object

PATCH /api/activities/:activityId/read
  Response: Updated activity

PATCH /api/activities/:userId/read-all
  Response: { modifiedCount }

DELETE /api/activities/:activityId
  Response: { message }
```

### Analytics API (`/api/analytics`)

```
GET /api/analytics/:userId
  Response: Analytics object

POST /api/analytics/:userId/init
  Response: Analytics object (creates if not exists)

PATCH /api/analytics/:userId/learning-hours
  Body: { hours }
  Response: Updated analytics

PATCH /api/analytics/:userId/streak
  Body: { currentStreak, longestStreak }
  Response: Updated analytics

PATCH /api/analytics/:userId/increment
  Body: { statName, incrementBy = 1 }
  StatNames: logsCreated, goalsCompleted, skillsAdded
  Response: Updated analytics

POST /api/analytics/:userId/weekly
  Body: { date, hoursLogged, logsCount }
  Response: Updated analytics

GET /api/analytics/leaderboard/all
  Query: limit=100, skip=0
  Response: { analytics, total, hasMore }
```

### Notifications API (`/api/notifications`)

```
GET /api/notifications/:userId
  Query: limit=50, skip=0
  Response: { notifications, total, unreadCount, hasMore }

GET /api/notifications/:userId/unread/count
  Response: { unreadCount }

POST /api/notifications
  Body: { userId, type, title, message, actionUrl }
  Types: achievement, milestone, reminder, system, social
  Response: Notification object

PATCH /api/notifications/:notificationId/read
  Response: Updated notification

PATCH /api/notifications/:userId/read-all
  Response: { modifiedCount }

DELETE /api/notifications/:notificationId
  Response: { message }

DELETE /api/notifications/:userId/clear-all
  Response: { deletedCount }
```

---

## Frontend Integration

### Services (`frontend/vite/src/services/`)

#### socketService.js
```javascript
import { initializeSocket, getSocket, disconnectSocket, on, off, emit } from './services/socketService'

// Initialize WebSocket when user logs in
initializeSocket(userId)

// Listen to events
on('activity:created', (activity) => { /* ... */ })
on('notification:received', (notification) => { /* ... */ })

// Emit events
emit('activity:create', { userId, type: 'login' })
```

#### realtimeService.js
```javascript
import { activityService, analyticsService, notificationService } from './services/realtimeService'

// Activities
await activityService.getActivities(userId, limit, skip)
await activityService.createActivity(userId, type, title, description, data)
await activityService.markAsRead(activityId)

// Analytics
await analyticsService.getAnalytics(userId)
await analyticsService.updateLearningHours(userId, hours)
await analyticsService.updateStreak(userId, currentStreak, longestStreak)
await analyticsService.incrementStat(userId, 'logsCreated', 1)

// Notifications
await notificationService.getNotifications(userId, limit, skip)
await notificationService.createNotification(userId, type, title, message, actionUrl)
await notificationService.markAsRead(notificationId)
```

### Hooks (`frontend/vite/src/hooks/`)

#### useSocket.js
Initializes and manages Socket.io connection per user
```javascript
import { useSocket } from './hooks/useSocket'

function App({ userId }) {
  useSocket(userId) // Connects on mount, disconnects on unmount
}
```

#### useActivities.js
Fetches and subscribes to activity updates
```javascript
import { useActivities } from './hooks/useActivities'

const { activities, unreadCount, markAsRead, deleteActivity, loadMore } = useActivities(userId)
```

#### useAnalytics.js
Fetches and updates analytics in real-time
```javascript
import { useAnalytics } from './hooks/useAnalytics'

const { analytics, updateLearningHours, updateStreak, incrementStat } = useAnalytics(userId)
```

#### useNotifications.js
Manages user notifications and real-time alerts
```javascript
import { useNotifications } from './hooks/useNotifications'

const { notifications, unreadCount, markAsRead, deleteNotification } = useNotifications(userId)
```

---

## Usage Examples

### 1. Track User Activity
```javascript
// Backend
await createActivity(userId, 'log_created', 'New Learning Log', 'Logged 2 hours', {
  hours: 2,
  topic: 'React'
})

// Frontend - will receive real-time update
useActivities(userId) // automatically receives the new activity
```

### 2. Update Analytics
```javascript
// Update learning hours
await analyticsService.updateLearningHours(userId, 2)

// Increment completed goals
await analyticsService.incrementStat(userId, 'goalsCompleted', 1)

// Listen for updates in real-time
const { analytics } = useAnalytics(userId)
```

### 3. Send Notifications
```javascript
// Backend
await notificationService.createNotification(
  userId,
  'achievement',
  'Milestone Reached!',
  'You completed 10 logs this week',
  '/achievements'
)

// Frontend receives real-time notification
const { notifications } = useNotifications(userId)
```

---

## Starting the Servers

### Install Dependencies
```bash
pnpm install
```

### Start Backend Only
```bash
pnpm run server
# Backend runs on http://localhost:5000
# WebSocket: ws://localhost:5000
```

### Start Frontend Only
```bash
pnpm run client
# Frontend runs on http://localhost:3000
```

### Start Both (Concurrent)
```bash
pnpm dev
# Backend: http://localhost:5000
# Frontend: http://localhost:3000
# WebSocket: ws://localhost:5000
```

---

## Environment Variables

### Backend (`.env`)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?appName=Cluster0
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
EMAIL_USER=
EMAIL_PASSWORD=
```

### Frontend (`.env`)
```
REACT_APP_API_URL=http://localhost:5000
```

---

## Database Collections

### Activity
```javascript
{
  userId: ObjectId,
  type: string,
  title: string,
  description: string,
  data: mixed,
  timestamp: date,
  read: boolean
}
```

### Analytics
```javascript
{
  userId: ObjectId,
  totalLearningHours: number,
  currentStreak: number,
  longestStreak: number,
  logsCreated: number,
  goalsCompleted: number,
  skillsAdded: number,
  weeklyData: [{ date, hoursLogged, logsCount }],
  monthlyData: [{ month, hoursLogged, logsCount }],
  updatedAt: date
}
```

### Notification
```javascript
{
  userId: ObjectId,
  type: string,
  title: string,
  message: string,
  read: boolean,
  actionUrl: string,
  createdAt: date,
  expiresAt: date (TTL index)
}
```

---

## Real-Time Flow Diagram

```
User Action (Frontend)
         ↓
API Call → Backend
         ↓
Database Update (MongoDB)
         ↓
WebSocket Event Broadcast
         ↓
Frontend Hook (useAnalytics, useActivities, useNotifications)
         ↓
State Update
         ↓
Component Re-render
```

---

## Testing

### Test Health Check
```bash
curl http://localhost:5000/api/health
```

### Test Activities API
```bash
curl -X POST http://localhost:5000/api/activities \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_id_here",
    "type": "login",
    "title": "User Login",
    "description": "User logged in",
    "data": {}
  }'
```

### Test WebSocket Connection
Use a WebSocket client or the frontend app to test real-time updates.

---

## Deployment

For production deployment:
1. Update `MONGODB_URI` to production database
2. Set `NODE_ENV=production`
3. Update `CLIENT_URL` to frontend domain
4. Use environment-specific `.env` files
5. Deploy backend and frontend separately (or use Docker)
6. Configure CORS properly for your domains

---

## Troubleshooting

**WebSocket Connection Failed**
- Check `CLIENT_URL` in backend `.env` matches frontend URL
- Ensure CORS is enabled on backend
- Check firewall/port availability

**API Returns 500**
- Check MongoDB connection (`.env` MONGODB_URI)
- Check server logs for stack trace
- Verify required fields in request body

**Real-Time Updates Not Showing**
- Ensure `useSocket()` hook is called
- Check browser console for connection errors
- Verify event names match between backend and frontend
- Check that user is logged in (userId available)

---

## Next Steps

1. Build frontend UI components for activities, analytics, and notifications
2. Add user authentication and authorization
3. Add testing (Jest, React Testing Library)
4. Deploy to production (Vercel, Render, Railway, etc.)
5. Add monitoring and error tracking (Sentry, DataDog, etc.)
6. Implement caching (Redis) for frequently accessed data
