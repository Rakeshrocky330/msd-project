import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

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
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const server = app.listen(PORT, HOST, () => {
  console.log(`\n✅ Frontend server running on ${HOST}:${PORT}`);
  console.log(`📡 API Server: ${process.env.VITE_API_URL || 'Not configured'}`);
  console.log(`🔌 Socket URL: ${process.env.VITE_SOCKET_URL || 'Not configured'}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
