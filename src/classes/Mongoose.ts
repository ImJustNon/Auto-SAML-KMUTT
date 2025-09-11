import mongoose from "mongoose";
import { config } from "../config/config";

export class Mongoose {
    private uri: string;

    constructor(uri: string){
        this.uri = uri;
    }

    async connect() {
        try {
            await mongoose.connect(this.uri, {});
            console.log('[Log] MongoDB connected');
        } catch (error) {
            console.error('[Error] MongoDB connection error:', error);
            process.exit(1);
        }
    }
}