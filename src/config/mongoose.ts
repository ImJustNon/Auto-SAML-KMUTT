import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auto-saml-app';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { 
      serverSelectionTimeoutMS: 30000,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};