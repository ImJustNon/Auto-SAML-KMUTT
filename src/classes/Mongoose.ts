import mongoose from "mongoose";

export class Mongoose {
    private uri: string;

    constructor(uri: string){
        this.uri = uri;
    }

    async connect() {
        try {
            await mongoose.connect(this.uri, {
                bufferCommands: false, // avoid queuing queries in serverless
                serverSelectionTimeoutMS: 30000, // wait longer than default 10s
            });
            console.log('[Log] MongoDB connected');
        } catch (error) {
            console.error('[Error] MongoDB connection error:', error);
            process.exit(1);
        }
    }
}