import mongoose from "mongoose";
import { config } from "../config/config";

let isConnected = false; // 🔑 keep connection state across hot reloads

export class Mongoose {
  private uri: string;

  constructor(uri: string) {
    this.uri = uri;
  }

  async connect() {
    if (isConnected) {
      // ✅ already connected, just return
      return;
    }

    try {
      const db = await mongoose.connect(this.uri, {
        bufferCommands: false, // avoid queuing queries in serverless
        serverSelectionTimeoutMS: 30000, // wait longer than default 10s
      });

      isConnected = db.connections[0].readyState === 1;
      console.log("[Log] MongoDB connected");
    } catch (error) {
      console.error("[Error] MongoDB connection error:", error);
      throw error; // ❌ don't call process.exit(1) in serverless
    }
  }
}
