import { createTransport } from "nodemailer";
import dotenv from 'dotenv'
dotenv.config()

const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use true for port 465, false for port 587
    auth: {
        user: "sandeepbm886@gmail.com",
        pass: process.env.GMAIL_PASS,
    },
});

export async function sendMail({ email, subject, html, attachments = [] }) {
    await transporter.sendMail({
        from: '"SentinelAI" <sandeepbm886@gmail.com>',
        to: email,
        subject,
        html,
        attachments,
    });
}