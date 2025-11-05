# Setup Instructions

## Prerequisites
- Node.js 18+ 
- npm or pnpm
- MongoDB (local or Atlas)
- Git

## Local Development Setup

### 1. Clone Repository
\`\`\`bash
git clone <repository-url>
cd ai-career-tracker
\`\`\`

### 2. Install Dependencies
\`\`\`bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
\`\`\`

### 3. Environment Setup

#### Backend (.env)
\`\`\`bash
cp backend/.env.example backend/.env
\`\`\`

Edit \`backend/.env\`:
\`\`\`
MONGODB_URI=mongodb://localhost:27017/ai-career-tracker
JWT_SECRET=your-secret-key-change-this
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@careertracker.com
NODE_ENV=development
PORT=5000
\`\`\`

#### Frontend (.env.local)
\`\`\`bash
cd frontend
cat > .env.local << EOF
VITE_API_URL=http://localhost:5000
EOF
cd ..
\`\`\`

### 4. Setup MongoDB

#### Option A: Local MongoDB
\`\`\`bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# Start MongoDB from Services
\`\`\`

#### Option B: MongoDB Atlas (Cloud)
1. Go to mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Create database user
5. Get connection string
6. Update \`MONGODB_URI\` in backend/.env

### 5. Start Development Servers

#### Option A: Both Servers (from root)
\`\`\`bash
npm run dev
\`\`\`
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

#### Option B: Individual Servers

Terminal 1 (Backend):
\`\`\`bash
npm run server
\`\`\`

Terminal 2 (Frontend):
\`\`\`bash
npm run client
\`\`\`

### 6. Verify Setup

1. Backend health check:
   \`\`\`bash
   curl http://localhost:5000/api/health
   \`\`\`

2. Frontend: Open http://localhost:3000

### 7. Testing

#### Register New Account
1. Go to http://localhost:3000/register
2. Create account with email and password
3. Verify email (check console in development)

#### Test API Endpoints
\`\`\`bash
# Login
curl -X POST http://localhost:5000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@example.com","password":"password"}'

# Get token from response, then:

# Get profile
curl -H "Authorization: Bearer <token>" \\
  http://localhost:5000/api/auth/profile
\`\`\`

## Troubleshooting

### MongoDB Connection Error
- Verify MongoDB is running
- Check \`MONGODB_URI\` in backend/.env
- For Atlas, verify IP whitelist

### Port Already in Use
\`\`\`bash
# Find process using port 5000
lsof -i :5000

# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
\`\`\`

### Environment Variables Not Loading
- Ensure .env files are in correct directory
- Restart servers after changing .env
- For frontend, variables must start with VITE_

### CORS Errors
- Verify backend is running
- Check VITE_API_URL in frontend .env.local
- Verify backend CORS settings allow frontend origin

## Next Steps

1. Read API_DOCUMENTATION.md
2. Review backend structure
3. Review frontend structure
4. Start building features!
\`\`\`
