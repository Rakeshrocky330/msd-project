# Frontend Project Structure

## Overview
React + Vite frontend for the AI Career Tracker application.

## Directory Structure

\`\`\`
frontend/
├── src/
│   ├── pages/              # Page components (routes)
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Goals.jsx
│   │   ├── Logs.jsx
│   │   ├── Skills.jsx
│   │   ├── Portfolio.jsx
│   │   ├── Analytics.jsx
│   │   ├── Profile.jsx
│   │   ├── VerifyEmail.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── PublicPortfolio.jsx
│   │   └── 404.jsx
│   │
│   ├── components/         # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── PrivateRoute.jsx
│   │   ├── GoalForm.jsx
│   │   ├── GoalList.jsx
│   │   ├── LogForm.jsx
│   │   ├── LogList.jsx
│   │   ├── SkillForm.jsx
│   │   ├── SkillList.jsx
│   │   ├── PortfolioEditor.jsx
│   │   ├── PortfolioPreview.jsx
│   │   ├── AnalyticsCharts.jsx
│   │   ├── AIInsights.jsx
│   │   ├── AICoach.jsx
│   │   ├── StreakCalendar.jsx
│   │   └── [other components].jsx
│   │
│   ├── services/           # API services
│   │   ├── api.js         # Axios instance with interceptors
│   │   ├── authService.js
│   │   ├── goalService.js
│   │   ├── logService.js
│   │   ├── skillService.js
│   │   └── portfolioService.js
│   │
│   ├── hooks/              # Custom React hooks
│   │   └── useAuth.js
│   │
│   ├── styles/             # CSS files
│   │   ├── index.css
│   │   ├── App.css
│   │   ├── Dashboard.css
│   │   ├── Landing.css
│   │   └── [component-specific].css
│   │
│   ├── utils/              # Utility functions
│   │   └── constants.js
│   │
│   ├── context/            # React context (if used)
│   │   └── AuthContext.jsx
│   │
│   ├── App.jsx            # Main App component
│   └── main.jsx           # Entry point
│
├── public/                # Static assets
│   ├── feature-*.svg
│   ├── landing-hero.svg
│   └── [images]
│
├── index.html
├── vite.config.js
├── postcss.config.mjs
├── package.json
└── .env.local
\`\`\`

## Key Patterns

### API Services
All API calls go through service layer in \`src/services/\`:
- \`api.js\` - Base axios instance with interceptors
- \`authService.js\` - Auth-related calls
- \`goalService.js\` - Goal-related calls
- etc.

### Custom Hooks
- \`useAuth.js\` - Authentication state management

### Constants
- \`utils/constants.js\` - Centralized constants

### Components
- Page components in \`pages/\` (route-level)
- Reusable components in \`components/\`

## Development

\`\`\`bash
npm run dev              # Start dev server (port 3000)
npm run build           # Build for production
npm run preview         # Preview production build
\`\`\`

## Environment Variables

\`\`\`
VITE_API_URL=http://localhost:5000
\`\`\`
\`\`\`
