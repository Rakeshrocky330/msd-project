# Quick Start Guide - Real-Time Integration

## 🚀 Get Started in 3 Steps

### 1. Install & Start
```bash
# Install all dependencies
pnpm install

# Start both backend and frontend
pnpm dev
```

### 2. Access the App
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- WebSocket: ws://localhost:5000 (automatic)

### 3. Use in Your Components
```javascript
import { useSocket } from './hooks/useSocket'
import { useActivities } from './hooks/useActivities'
import { useAnalytics } from './hooks/useAnalytics'
import { useNotifications } from './hooks/useNotifications'

function Dashboard({ userId }) {
  // Enable WebSocket connection
  useSocket(userId)
  
  // Get real-time data
  const { activities, unreadCount: actUnread } = useActivities(userId)
  const { analytics, updateLearningHours } = useAnalytics(userId)
  const { notifications, unreadCount } = useNotifications(userId)
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Activities: {actUnread} unread</p>
      <p>Learning Hours: {analytics?.totalLearningHours}</p>
      <p>Notifications: {unreadCount} unread</p>
      <button onClick={() => updateLearningHours(2)}>Log 2 Hours</button>
    </div>
  )
}
```

---

## 📚 Key Files

### Backend
| File | Purpose |
|------|---------|
| `backend/server/index.js` | Express + Socket.io server |
| `backend/server/models/*` | MongoDB schemas (Activity, Analytics, Notification) |
| `backend/server/controllers/*` | Business logic |
| `backend/server/routes/*` | API endpoints |

### Frontend
| File | Purpose |
|------|---------|
| `frontend/vite/src/services/socketService.js` | WebSocket management |
| `frontend/vite/src/services/realtimeService.js` | REST API client |
| `frontend/vite/src/hooks/useSocket.js` | Initialize connection |
| `frontend/vite/src/hooks/useActivities.js` | Activity real-time hook |
| `frontend/vite/src/hooks/useAnalytics.js` | Analytics real-time hook |
| `frontend/vite/src/hooks/useNotifications.js` | Notifications real-time hook |

---

## 🔌 Core APIs

### Create Activity
```javascript
import { activityService } from './services/realtimeService'

await activityService.createActivity(userId, 'login', 'User Login', 'User logged in', {})
```

### Update Analytics
```javascript
import { analyticsService } from './services/realtimeService'

// Update hours
await analyticsService.updateLearningHours(userId, 2)

// Increment stats
await analyticsService.incrementStat(userId, 'logsCreated', 1)
await analyticsService.incrementStat(userId, 'goalsCompleted', 1)

// Update streak
await analyticsService.updateStreak(userId, 5, 10) // current=5, longest=10
```

### Send Notification
```javascript
import { notificationService } from './services/realtimeService'

await notificationService.createNotification(
  userId,
  'achievement',
  'Goal Completed!',
  'You completed your weekly learning goal',
  '/achievements'
)
```

---

## 🔄 Real-Time Events

### Backend → Frontend (WebSocket)
```javascript
socket.on('activity:created', (activity) => { /* new activity */ })
socket.on('notification:received', (notification) => { /* new notification */ })
socket.on('analytics:updated', (data) => { /* updated analytics */ })
socket.on('users:status', (data) => { /* active users changed */ })
```

### Frontend → Backend (WebSocket)
```javascript
socket.emit('user:login', userId)
socket.emit('activity:create', { userId, type: 'login' })
socket.emit('data:request', 'activities')
```

---

## 📊 Example: Activity Feed Component

```javascript
import React from 'react'
import { useActivities } from '../hooks/useActivities'

export function ActivityFeed({ userId }) {
  const { activities, unreadCount, markAsRead, loading, error } = useActivities(userId)
  
  if (loading) return <div>Loading activities...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div className="activity-feed">
      <h2>Activities ({unreadCount} unread)</h2>
      <ul>
        {activities.map(activity => (
          <li key={activity._id} className={activity.read ? '' : 'unread'}>
            <h4>{activity.title}</h4>
            <p>{activity.description}</p>
            <p>Type: {activity.type}</p>
            <p>{new Date(activity.timestamp).toLocaleString()}</p>
            {!activity.read && (
              <button onClick={() => markAsRead(activity._id)}>Mark as Read</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

---

## 📈 Example: Analytics Dashboard

```javascript
import React from 'react'
import { useAnalytics } from '../hooks/useAnalytics'

export function AnalyticsDashboard({ userId }) {
  const { analytics, updateLearningHours, incrementStat, loading } = useAnalytics(userId)
  
  if (loading) return <div>Loading analytics...</div>
  
  return (
    <div className="analytics-dashboard">
      <div className="stat">
        <h3>Learning Hours</h3>
        <p className="value">{analytics?.totalLearningHours || 0}h</p>
        <button onClick={() => updateLearningHours(1)}>+1 Hour</button>
      </div>
      
      <div className="stat">
        <h3>Current Streak</h3>
        <p className="value">{analytics?.currentStreak || 0} days</p>
      </div>
      
      <div className="stat">
        <h3>Logs Created</h3>
        <p className="value">{analytics?.logsCreated || 0}</p>
        <button onClick={() => incrementStat('logsCreated', 1)}>New Log</button>
      </div>
      
      <div className="stat">
        <h3>Goals Completed</h3>
        <p className="value">{analytics?.goalsCompleted || 0}</p>
        <button onClick={() => incrementStat('goalsCompleted', 1)}>Complete Goal</button>
      </div>
      
      <div className="stat">
        <h3>Skills Added</h3>
        <p className="value">{analytics?.skillsAdded || 0}</p>
        <button onClick={() => incrementStat('skillsAdded', 1)}>Add Skill</button>
      </div>
    </div>
  )
}
```

---

## 🔔 Example: Notification Center

```javascript
import React from 'react'
import { useNotifications } from '../hooks/useNotifications'

export function NotificationCenter({ userId }) {
  const { notifications, unreadCount, markAsRead, deleteNotification } = useNotifications(userId)
  
  return (
    <div className="notification-center">
      <h2>Notifications ({unreadCount} unread)</h2>
      
      <div className="notification-list">
        {notifications.map(notif => (
          <div key={notif._id} className={`notification ${notif.type}`}>
            <div className="header">
              <h4>{notif.title}</h4>
              <span className="type">{notif.type}</span>
            </div>
            <p>{notif.message}</p>
            <div className="actions">
              {!notif.read && (
                <button onClick={() => markAsRead(notif._id)}>Mark as Read</button>
              )}
              <button onClick={() => deleteNotification(notif._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## ⚙️ Environment Setup

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://231fa04a06:rakesh@123@cluster0.as0oqft.mongodb.net/?appName=Cluster0
JWT_SECRET=your-secret-key-change-this
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 🧪 Test with cURL

```bash
# Get user analytics
curl http://localhost:5000/api/analytics/{userId}

# Create activity
curl -X POST http://localhost:5000/api/activities \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_id",
    "type": "login",
    "title": "Login",
    "description": "User logged in"
  }'

# Update learning hours
curl -X PATCH http://localhost:5000/api/analytics/{userId}/learning-hours \
  -H "Content-Type: application/json" \
  -d '{ "hours": 2 }'

# Get notifications
curl http://localhost:5000/api/notifications/{userId}
```

---

## 📖 Full Documentation

See `REALTIME_INTEGRATION_GUIDE.md` for:
- Complete API reference
- Database schema
- WebSocket events
- Deployment guidelines
- Troubleshooting

---

## 🎯 What You Can Do Now

✅ Track user activities in real-time
✅ Update and display analytics live
✅ Send and receive notifications instantly
✅ Build a complete activity feed
✅ Create analytics dashboards
✅ Implement notification centers
✅ Deploy to production with WebSockets

---

## 📞 Support

Check the documentation or server logs for:
- Connection issues: Look for "Socket connected/disconnected" messages
- API errors: Check HTTP response status and error message
- Data not updating: Verify user ID and WebSocket connection

**Both servers running?**
```bash
# Check backend
curl http://localhost:5000/api/health

# Check frontend (in browser)
# Open http://localhost:3000
```

---

Enjoy building real-time features! 🚀
