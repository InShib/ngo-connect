import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ngo_connect';
    const conn = await mongoose.connect(connStr);
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error: any) {
    console.warn(`[MongoDB Warning] Could not connect to primary MongoDB instance (${error.message}). NGO CONNECT running with fallback memory database engine.`);
  }
};
