# AI Career Tracker

An intelligent career tracking application with daily learning logs, goal management, and AI-powered insights.

## Features

- User authentication and profiles
- Career goal tracking and management
- Daily learning logs with sentiment analysis
- Skills inventory management
- Portfolio showcase
- Analytics and progress tracking
- AI coaching and insights
- Public portfolio sharing

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm/pnpm

### Installation

1. **Clone repository**
   \`\`\`bash
   git clone <repository-url>
   cd ai-career-tracker
   npm install
   \`\`\`

2. **Setup environment variables**
   \`\`\`bash
   # Backend
   cp backend/.env.example backend/.env

   # Frontend
   cd frontend
   echo "VITE_API_URL=http://localhost:5000" > .env.local
   cd ..
   \`\`\`

3. **Start development servers**
   \`\`\`bash
   npm run dev
   \`\`\`

   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000

## Documentation

- **[Setup Instructions](SETUP_INSTRUCTIONS.md)** - Detailed setup guide
- **[Backend Structure](backend/PROJECT_STRUCTURE.md)** - Backend architecture
- **[Frontend Structure](frontend/PROJECT_STRUCTURE.md)** - Frontend architecture
- **[API Documentation](API_DOCUMENTATION.md)** - Complete API reference
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Production deployment

## Project Structure

\`\`\`
ai-career-tracker/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── routes/            # API endpoints
│   │   ├── controllers/       # Business logic
│   │   ├── models/            # Database schemas
│   │   ├── middleware/        # Express middleware
│   │   └── utils/             # Utilities
│   └── package.json
│
├── frontend/                  # React + Vite
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── services/          # API services
│   │   ├── hooks/             # Custom hooks
│   │   └── utils/             # Utilities
│   └── package.json
│
├── docs/                      # Documentation
├── scripts/                   # Utility scripts
├── README.md
└── package.json
\`\`\`

## Technology Stack

### Backend
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- JWT - Authentication
- Nodemailer - Email service
- Node.js 18+

### Frontend
- React 19.2
- Vite - Build tool
- React Router - Routing
- Axios - HTTP client
- Tailwind CSS - Styling
- React Toastify - Notifications

## API Overview

### Base URL
\`http://localhost:5000/api\`

### Main Endpoints
- \`POST /auth/register\` - Register
- \`POST /auth/login\` - Login
- \`GET /goals\` - List goals
- \`POST /goals\` - Create goal
- \`GET /logs\` - List learning logs
- \`POST /logs\` - Create log
- \`GET /skills\` - List skills
- \`GET /portfolio\` - Get portfolio

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for full details.

## Development Scripts

\`\`\`bash
npm run dev              # Start both servers
npm run server          # Start backend only
npm run client          # Start frontend only
npm run build          # Build frontend
npm start              # Start server (production)
\`\`\`

## Environment Variables

### Backend (.env)
\`\`\`
MONGODB_URI=mongodb://localhost:27017/ai-career-tracker
JWT_SECRET=your-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@careertracker.com
NODE_ENV=development
PORT=5000
\`\`\`

### Frontend (.env.local)
\`\`\`
VITE_API_URL=http://localhost:5000
\`\`\`

## Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for:
- Backend deployment (Render, Railway, Fly.io)
- Frontend deployment (Vercel, Netlify)
- Database setup (MongoDB Atlas)
- Environment configuration

## Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check MONGODB_URI in .env

**CORS Errors**
- Verify backend is running on port 5000
- Check VITE_API_URL in frontend .env.local

**Port Already in Use**
\`\`\`bash
lsof -i :5000  # Check port 5000
lsof -i :3000  # Check port 3000
\`\`\`

See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for more help.

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

MIT

## Support

For issues or questions, check:
1. Documentation files
2. API errors (check browser console)
3. Backend logs

---

**Ready to get started?** See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)
\`\`\`
