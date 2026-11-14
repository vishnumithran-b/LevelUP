import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiRouter } from './routes/api.js';

dotenv.config();
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'LEVELUP Agentic AI Platform',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Main API Router
app.use('/api', apiRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 ==========================================`);
  console.log(`⚡ LEVELUP Agentic AI Server running on http://localhost:${PORT}`);
  console.log(`📡 Multi-Agent Orchestrator: Ready (8 Agents Active)`);
  console.log(`🎯 Seed Profile: Alex Chen (Full Stack Developer Path)`);
  console.log(`==========================================\n`);
});

