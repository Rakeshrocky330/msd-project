# Career Tracker - Project Structure

## Overview
This is a monorepo with a clear separation between backend (Express) and frontend (React).

\`\`\`
project-root/
├── backend/                        # Express.js API Server
│   ├── src/
│   │   ├── routes/                # API route handlers
│   │   │   ├── auth.js
│   │   │   ├── logs.js
│   │   │   ├── goals.js
│   │   │   ├── skills.js
│   │   │   ├── portfolio.js
│   │   │   ├── user.js
│   │   │   ├── admin.js
│   │   │   └── ai.js
│   │   ├── models/                # MongoDB Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Goal.js
│   │   │   ├── Log.js
│   │   │   ├── Skill.js
│   │   │   ├── Portfolio.js
│   │   │   ├── EmailVerification.js
│   │   │   └── PasswordReset.js
│   │   ├── middleware/            # Express middleware
│   │   │   └── auth.js
│   │   ├── controllers/           # Business logic layer
│   │   │   ├── authController.js
│   │   │   ├── goalController.js
│   │   │   ├── logController.js
│   │   │   ├── skillController.js
│   │   │   └── portfolioController.js
│   │   ├── utils/                 # Utility services
│   │   │   ├── emailService.js
│   │   │   └── nlpService.js
│   │   ├── config/                # Configuration files
│   │   │   ├── database.js
│   │   │   └── constants.js
│   │   └── index.js              # Server entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/                       # React Client (Vite)
│   ├── src/
│   │   ├── pages/                # Page components
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Goals.jsx
│   │   │   ├── Logs.jsx
│   │   │   ├── Skills.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── VerifyEmail.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── PublicPortfolio.jsx
│   │   │   └── 404.jsx
│   │   ├── components/           # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── GoalForm.jsx
│   │   │   ├── GoalList.jsx
│   │   │   ├── LogForm.jsx
│   │   │   ├── LogList.jsx
│   │   │   ├── SkillForm.jsx
│   │   │   ├── SkillList.jsx
│   │   │   ├── PortfolioEditor.jsx
│   │   │   ├── PortfolioPreview.jsx
│   │   │   ├── AnalyticsCharts.jsx
│   │   │   ├── AIInsights.jsx
│   │   │   ├── AICoach.jsx
│   │   │   └── StreakCalendar.jsx
│   │   ├── styles/               # CSS files
│   │   │   ├── index.css        # Global styles
│   │   │   ├── App.css
│   │   │   ├── Dashboard.css
│   │   │   ├── Landing.css
│   │   │   └── [component-specific].css
│   │   ├── hooks/                # Custom React hooks
│   │   │   └── useAuth.js        # Authentication hook
│   │   ├── context/              # React context (if used)
│   │   │   └── AuthContext.jsx
│   │   ├── services/             # API services
│   │   │   ├── api.js           # Axios instance and defaults
│   │   │   ├── authService.js
│   │   │   ├── goalService.js
│   │   │   └── [other-services].js
│   │   ├── utils/                # Frontend utilities
│   │   │   └── constants.js
│   │   ├── App.jsx              # Main App component
│   │   └── main.jsx             # Entry point
│   ├── public/                   # Static assets
│   │   ├── feature-analytics.svg
│   │   ├── feature-goals.svg
│   │   ├── feature-logs.svg
│   │   ├── landing-hero.svg
│   │   └── [images]
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── postcss.config.mjs
│
├── docs/                         # Documentation
│   ├── API.md                   # API documentation
│   ├── SETUP.md                 # Setup instructions
│   ├── DEPLOYMENT.md            # Deployment guide
│   └── DATABASE.md              # Database schema
│
├── scripts/                      # Utility scripts
│   ├── setup-db.js
│   ├── seed-db.js
│   └── migrate.js
│
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json                 # Root package (monorepo)
├── pnpm-lock.yaml              # Lock file
├── README.md                    # Main readme
└── netlify.toml                # Netlify config
\`\`\`

## Backend (Express.js - Port 5000)
- Entry point: `backend/src/index.js`
- API routes mounted at `/api/*`
- MongoDB as primary database
- JWT authentication
- Email verification and password reset flows

## Frontend (React + Vite - Port 3000)
- Entry point: `frontend/src/main.jsx`
- Client-side routing with React Router
- Axios for HTTP requests (proxied to backend at port 5000)
- Tailwind CSS for styling
- React Toastify for notifications

## Running the Application

### Development
\`\`\`bash
# From root directory
npm run dev              # Runs both server and client concurrently
\`\`\`

### Individual Development
\`\`\`bash
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend
npm run client
\`\`\`

### Build & Production
\`\`\`bash
npm run build           # Build client
npm start              # Start server in production
\`\`\`

## Environment Variables

### Backend (.env)
\`\`\`
MONGODB_URI=mongodb://localhost:27017/ai-career-tracker
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
\`\`\`

### Frontend (.env.local)
\`\`\`
VITE_API_URL=http://localhost:5000
\`\`\`

## Key Features by Module

### Authentication
- User registration and login
- Email verification
- Password reset flow
- JWT token management

### Career Tracking
- Daily learning logs
- Career goals with status
- Skills inventory
- Portfolio management

### Analytics
- Progress tracking
- Streak calculations
- Performance insights
- AI coaching recommendations

## Technology Stack

### Backend
- Node.js 18+
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Nodemailer
- bcryptjs

### Frontend
- React 19.2
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- React Toastify
