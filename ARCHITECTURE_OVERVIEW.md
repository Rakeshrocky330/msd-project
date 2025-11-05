# Architecture Overview

## System Design

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Port 3000)                        │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  React Application (Vite)                           │  │
│  │  - Pages (Landing, Dashboard, Goals, Logs, etc)   │  │
│  │  - Components (Forms, Lists, Charts)              │  │
│  │  - Services (API calls)                           │  │
│  │  - Hooks (Auth, Custom state management)          │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │ HTTP/JSON
                           │ (Axios)
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    SERVER (Port 5000)                        │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Express.js Application                            │  │
│  │                                                     │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  Routes Layer                               │  │  │
│  │  │  - /api/auth, /api/goals, /api/logs, etc  │  │  │
│  │  │  - Request validation                      │  │  │
│  │  │  - Middleware (auth, cors)                 │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                    │                               │  │
│  │                    ↓                               │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  Controllers Layer                          │  │  │
│  │  │  - Business logic                           │  │  │
│  │  │  - Data transformation                      │  │  │
│  │  │  - Response formatting                      │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                    │                               │  │
│  │                    ↓                               │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  Models Layer (Mongoose)                    │  │  │
│  │  │  - User, Goal, Log, Skill, Portfolio      │  │  │
│  │  │  - Schema validation                       │  │  │
│  │  │  - Data persistence                        │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                    │                               │  │
│  │                    ↓                               │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  Utils/Services                             │  │  │
│  │  │  - Email service (Nodemailer)             │  │  │
│  │  │  - NLP service                            │  │  │
│  │  │  - Authentication (JWT)                   │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                                                     │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │ MongoDB Protocol
                           │
                           ↓
        ┌──────────────────────────────────┐
        │  MongoDB Database (Collections)  │
        │  - users                         │
        │  - goals                         │
        │  - logs                          │
        │  - skills                        │
        │  - portfolios                    │
        │  - email_verifications           │
        │  - password_resets               │
        └──────────────────────────────────┘
\`\`\`

## Data Flow

### Authentication Flow
\`\`\`
1. User → Register/Login (Frontend)
2. Frontend → POST /api/auth/register (Axios)
3. Server → authController.register() (Handle request)
4. Controller → User.create() (Save to DB)
5. Server → Return JWT token
6. Frontend → Store token (localStorage)
7. Future requests → Include token in Authorization header
\`\`\`

### Goal Management Flow
\`\`\`
1. User → Create Goal (Frontend form)
2. Frontend → POST /api/goals (With JWT token)
3. Middleware → Verify JWT token
4. Router → goalsController.create()
5. Controller → Goal.create() with userId
6. Database → Save goal document
7. Server → Return created goal
8. Frontend → Update UI with new goal
\`\`\`

### Learning Log Flow
\`\`\`
1. User → Write log (Frontend form)
2. Frontend → POST /api/logs (Content, mood, etc)
3. Server → Process with NLP service
4. NLP → Extract sentiments, keywords
5. Controller → Create log with analysis
6. Database → Save enriched log
7. Frontend → Display analysis results
8. Analytics → Update streak and stats
\`\`\`

## Component Hierarchy (Frontend)

\`\`\`
App
├── Router
│   ├── Landing (Public)
│   ├── Register (Public)
│   ├── Login (Public)
│   ├── Dashboard (Protected)
│   │   ├── Navbar
│   │   ├── Sidebar
│   │   └── Main Content
│   ├── Goals (Protected)
│   │   ├── GoalList
│   │   └── GoalForm
│   ├── Logs (Protected)
│   │   ├── LogList
│   │   └── LogForm
│   ├── Skills (Protected)
│   │   ├── SkillList
│   │   └── SkillForm
│   ├── Portfolio (Protected)
│   │   ├── PortfolioEditor
│   │   └── PortfolioPreview
│   ├── Analytics (Protected)
│   │   └── AnalyticsCharts
│   └── Profile (Protected)
└── AuthContext (Global state)
\`\`\`

## API Route Structure

\`\`\`
GET /api/health
  └─ Health check (no auth required)

POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile (requires auth)
POST /api/auth/verify-email
POST /api/auth/forgot-password
POST /api/auth/reset-password

GET /api/goals (requires auth)
GET /api/goals/:id (requires auth)
POST /api/goals (requires auth)
PUT /api/goals/:id (requires auth)
DELETE /api/goals/:id (requires auth)
GET /api/goals/stats (requires auth)

GET /api/logs (requires auth)
GET /api/logs/:id (requires auth)
POST /api/logs (requires auth)
PUT /api/logs/:id (requires auth)
DELETE /api/logs/:id (requires auth)
GET /api/logs/stats (requires auth)

GET /api/skills (requires auth)
POST /api/skills (requires auth)
PUT /api/skills/:id (requires auth)
DELETE /api/skills/:id (requires auth)

GET /api/portfolio (requires auth)
GET /api/portfolio/public/:username (no auth)
POST /api/portfolio (requires auth)
PUT /api/portfolio/:id (requires auth)
DELETE /api/portfolio/:id (requires auth)

GET /api/user/profile (requires auth)
PUT /api/user/profile (requires auth)

GET /api/admin/users (requires auth + admin)
DELETE /api/admin/users/:id (requires auth + admin)

POST /api/ai/insights (requires auth)
POST /api/ai/coaching (requires auth)
\`\`\`

## Database Schema Relationships

\`\`\`
User (1) ──→ (Many) Goal
User (1) ──→ (Many) Log
User (1) ──→ (Many) Skill
User (1) ──→ (Many) Portfolio

Goal (1) ──→ (Many) Log
(User can reference Goal in their Log)

EmailVerification → User
PasswordReset → User
\`\`\`

## Security Architecture

### Authentication
- Password hashing with bcryptjs
- JWT tokens for stateless auth
- Tokens stored in localStorage (frontend)
- Token included in Authorization header

### Authorization
- Middleware checks JWT on protected routes
- User ID from token to verify resource ownership
- Admin flag for admin-only endpoints

### Data Protection
- CORS enabled for frontend origin
- Input validation in controllers
- MongoDB injection prevention via Mongoose
- HTTPS in production

## Deployment Architecture

\`\`\`
                         CDN (Static Assets)
                              │
                              ↓
Internet ──→ Frontend (Vercel/Netlify) ──→ Backend (Render/Railway)
                       React SPA                Express API
                       (Port 443)               (Port 443)
                                                  │
                                                  ↓
                                        MongoDB Atlas (Cloud DB)
\`\`\`

## Scalability Considerations

### Current Scale
- Suitable for: Hundreds to low thousands of users
- Database: MongoDB Atlas free/shared tier
- Frontend hosting: Vercel/Netlify free tier
- Backend hosting: Render/Railway free tier

### Future Scaling
1. **Caching**: Implement Redis for session/data caching
2. **Database**: Move to MongoDB dedicated cluster
3. **Search**: Add Elasticsearch for advanced search
4. **Storage**: Use S3 for portfolio assets
5. **Workers**: Implement job queue for async tasks
6. **CDN**: Use Cloudflare for edge caching
\`\`\`
\`\`\`
