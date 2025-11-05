# Deployment Guide

## Overview
This application consists of:
- **Backend**: Express.js server (Node.js)
- **Frontend**: React + Vite application

## Backend Deployment

### Option 1: Render / Railway / Fly.io (Recommended)

1. Push code to GitHub
2. Connect repository to deployment platform
3. Set environment variables:
   - \`MONGODB_URI\` - MongoDB Atlas connection string
   - \`JWT_SECRET\` - Random secret key
   - \`SMTP_HOST\`, \`SMTP_USER\`, \`SMTP_PASS\` - Email config
   - \`NODE_ENV=production\`

4. Set build command: \`npm install\`
5. Set start command: \`npm start\`

### Option 2: Vercel (API Routes)
Not recommended for full Express server. Consider Vercel API Routes instead.

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Set environment variables:
   - \`VITE_API_URL=https://your-backend-url.com\`
3. Build command: \`npm run build\`
4. Output directory: \`dist\`

### Option 2: Netlify

1. Connect GitHub repository
2. Build settings:
   - Build command: \`npm run build\`
   - Publish directory: \`dist\`
3. Set environment variables:
   - \`VITE_API_URL=https://your-backend-url.com\`

## Database Setup

### MongoDB Atlas

1. Create account at mongodb.com/cloud/atlas
2. Create a cluster
3. Create database user
4. Get connection string
5. Add to environment: \`MONGODB_URI\`

## Environment Variables

### Backend (.env)
\`\`\`
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ai-career-tracker
JWT_SECRET=very-secure-random-key-here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@careertracker.com
NODE_ENV=production
PORT=5000
\`\`\`

### Frontend (.env.production)
\`\`\`
VITE_API_URL=https://your-backend-api.com
\`\`\`

## Health Checks

Both services have health check endpoints:
- Backend: \`GET /api/health\`
- Frontend: Accessible at deployment URL

## SSL/HTTPS

- Backend: Enable on deployment platform
- Frontend: Automatic with Vercel/Netlify

## Performance Optimization

### Frontend
- Run \`npm run build\` to create production bundle
- Assets are minified and optimized by Vite
- Static files cached with far-future expires

### Backend
- Use MongoDB indexes on frequently queried fields
- Cache common queries with Redis (optional)
- Implement rate limiting for API endpoints

## Monitoring

Recommend setting up:
- Error tracking: Sentry, Datadog
- Performance monitoring: New Relic, Datadog
- Uptime monitoring: UptimeRobot, Pingdom

## Rollback Strategy

1. Keep previous deployment running
2. Test new deployment thoroughly before switch
3. Can revert by deploying previous commit
4. Set up CI/CD for automated testing
\`\`\`
