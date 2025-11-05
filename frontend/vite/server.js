const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'Frontend server is running',
    timestamp: new Date().toISOString(),
    apiUrl: process.env.VITE_API_URL,
    socketUrl: process.env.VITE_SOCKET_URL
  });
});

// SPA fallback - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n✅ Frontend server running on port ${PORT}`);
  console.log(`📡 API Server: ${process.env.VITE_API_URL || 'Not configured'}`);
  console.log(`🔌 Socket URL: ${process.env.VITE_SOCKET_URL || 'Not configured'}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
