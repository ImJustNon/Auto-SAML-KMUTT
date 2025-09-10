import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: 3000,
    kmuttEmail: process.env.KMUTT_EMAIL,
    kmuttPassword: process.env.KMUTT_PASSWORD,
};