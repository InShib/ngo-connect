import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import apiRoutes from './routes/apiRoutes';
import { errorHandler } from './middleware/errorHandler';
import { seedDatabase } from './utils/seed';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Socket.io Realtime Events
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`[Socket.io] Socket ${socket.id} joined room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'NGO CONNECT API Engine',
    timestamp: new Date(),
    version: '1.0.0',
  });
});

// API Routes
app.use('/api/v1', apiRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedDatabase();

  server.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 NGO CONNECT API Engine running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/v1/health`);
    console.log(`==================================================`);
  });
};

startServer();

export { app, server, io };
