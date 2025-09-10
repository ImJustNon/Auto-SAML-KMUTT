"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: 3000,
    kmuttEmail: process.env.KMUTT_EMAIL,
    kmuttPassword: process.env.KMUTT_PASSWORD,
    isServerless: process.env.VERCEL === '1' || process.env.VERCEL === 'true' || false,
};
