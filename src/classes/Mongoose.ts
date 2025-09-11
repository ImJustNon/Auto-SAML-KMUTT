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
            return;
        }

        try {
            const db = await mongoose.connect(this.uri, {
                bufferCommands: false,
                serverSelectionTimeoutMS: 30000, 
            });

            isConnected = db.connections[0].readyState === 1;
            console.log("[Log] MongoDB connected");
        } catch (error) {
            console.error("[Error] MongoDB connection error:", error);
            throw error;
        }
    }
}
