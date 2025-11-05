# Quick Reference

## Commands

### Setup
\`\`\`bash
npm install              # Install all dependencies
npm run dev             # Start both server and client
\`\`\`

### Development
\`\`\`bash
npm run server          # Start backend only
npm run client          # Start frontend only
npm run build          # Build frontend
\`\`\`

### Production
\`\`\`bash
npm start              # Start server (production)
\`\`\`

## Ports

- Backend: 5000
- Frontend: 3000

## URLs

| Component | URL |
|-----------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:5000 |
| API | http://localhost:5000/api |
| Health | http://localhost:5000/api/health |

## Key Files

| File | Purpose |
|------|---------|
| backend/src/index.js | Server entry |
| backend/src/routes/ | API routes |
| backend/src/models/ | Database schemas |
| frontend/src/main.jsx | Frontend entry |
| frontend/src/App.jsx | Main app component |
| frontend/src/services/ | API layer |

## Environment Variables

### Backend (backend/.env)
- MONGODB_URI
- JWT_SECRET
- SMTP_* (email config)
- NODE_ENV
- PORT

### Frontend (frontend/.env.local)
- VITE_API_URL

## Common Issues

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Check MONGODB_URI, ensure MongoDB running |
| CORS error | Verify backend running, check API URL |
| Port in use | Find process: `lsof -i :5000` |
| Token invalid | Check JWT_SECRET matches |
| API calls fail | Verify token in localStorage |

## API Endpoints Quick Reference

\`\`\`
Auth
  POST   /api/auth/register
  POST   /api/auth/login
  GET    /api/auth/profile

Goals
  GET    /api/goals
  POST   /api/goals
  PUT    /api/goals/:id
  DELETE /api/goals/:id
  GET    /api/goals/stats

Logs
  GET    /api/logs
  POST   /api/logs
  PUT    /api/logs/:id
  DELETE /api/logs/:id

Skills
  GET    /api/skills
  POST   /api/skills
  PUT    /api/skills/:id

Portfolio
  GET    /api/portfolio
  POST   /api/portfolio
  GET    /api/portfolio/public/:username
\`\`\`

## Database Collections

- users
- goals
- logs
- skills
- portfolios
- email_verifications
- password_resets

## Frontend Structure

- pages/ - Route pages
- components/ - Reusable components
- services/ - API calls
- hooks/ - Custom hooks
- styles/ - CSS files
- utils/ - Utilities

## Backend Structure

- routes/ - API endpoints
- controllers/ - Business logic
- models/ - Mongoose schemas
- middleware/ - Express middleware
- utils/ - Utilities (email, NLP)
- config/ - Configuration

---

For more details:
- Setup: SETUP_INSTRUCTIONS.md
- Backend: backend/PROJECT_STRUCTURE.md
- Frontend: frontend/PROJECT_STRUCTURE.md
- API: API_DOCUMENTATION.md
- Deploy: DEPLOYMENT_GUIDE.md
\`\`\`
