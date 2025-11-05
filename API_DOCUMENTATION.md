# API Documentation

## Base URL
\`\`\`
http://localhost:5000/api
\`\`\`

## Authentication
All protected endpoints require JWT token in header:
\`\`\`
Authorization: Bearer <token>
\`\`\`

## Response Format
Success (200):
\`\`\`json
{
  "success": true,
  "data": { ... }
}
\`\`\`

Error (400+):
\`\`\`json
{
  "success": false,
  "message": "Error message"
}
\`\`\`

---

## Auth Endpoints

### Register
\`\`\`
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
\`\`\`

### Login
\`\`\`
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response:
{
  "token": "jwt-token",
  "user": { ... }
}
\`\`\`

### Get Profile
\`\`\`
GET /auth/profile
Authorization: Bearer <token>
\`\`\`

---

## Goals Endpoints

### List Goals
\`\`\`
GET /goals
Authorization: Bearer <token>
\`\`\`

### Create Goal
\`\`\`
POST /goals
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Learn React",
  "description": "Master React hooks and context",
  "dueDate": "2025-12-31",
  "status": "active"
}
\`\`\`

### Update Goal
\`\`\`
PUT /goals/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Learn React Advanced",
  "progress": 50
}
\`\`\`

### Delete Goal
\`\`\`
DELETE /goals/:id
Authorization: Bearer <token>
\`\`\`

### Get Statistics
\`\`\`
GET /goals/stats
Authorization: Bearer <token>
\`\`\`

---

## Logs Endpoints

### List Logs
\`\`\`
GET /logs
Authorization: Bearer <token>

Query parameters:
- startDate: ISO date
- endDate: ISO date
- goalId: filter by goal
\`\`\`

### Create Log
\`\`\`
POST /logs
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Today I learned about React hooks...",
  "learnings": "Key takeaway about useState",
  "mood": "productive",
  "goalId": "goal-id-optional"
}
\`\`\`

### Get Statistics
\`\`\`
GET /logs/stats
Authorization: Bearer <token>
\`\`\`

---

## Skills Endpoints

### List Skills
\`\`\`
GET /skills
Authorization: Bearer <token>
\`\`\`

### Create Skill
\`\`\`
POST /skills
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "React",
  "level": "advanced",
  "yearsOfExperience": 3
}
\`\`\`

### Update Skill
\`\`\`
PUT /skills/:id
Authorization: Bearer <token>

{
  "level": "expert",
  "yearsOfExperience": 4
}
\`\`\`

---

## Portfolio Endpoints

### Get Portfolio
\`\`\`
GET /portfolio
Authorization: Bearer <token>
\`\`\`

### Create Entry
\`\`\`
POST /portfolio
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "E-commerce Platform",
  "description": "Built an e-commerce platform with React and Node.js",
  "skills": ["React", "Node.js", "MongoDB"],
  "link": "https://github.com/user/project",
  "startDate": "2024-01-01",
  "endDate": "2024-06-30",
  "public": true
}
\`\`\`

### Get Public Portfolio
\`\`\`
GET /portfolio/public/:username
(No authentication required)
\`\`\`

---

## Error Codes

- \`400\` - Bad Request
- \`401\` - Unauthorized (missing/invalid token)
- \`403\` - Forbidden (not allowed)
- \`404\` - Not Found
- \`409\` - Conflict (duplicate email, etc.)
- \`500\` - Server Error
\`\`\`
