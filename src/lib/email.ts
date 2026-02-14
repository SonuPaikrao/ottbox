
import nodemailer from 'nodemailer';
import { getWelcomeEmailHtml } from './email-templates';

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD, // Your Gmail App Password
  },
});

export const sendWelcomeEmail = async (email: string, name: string, password?: string) => {
  // Check if credentials exist to avoid crashes
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('Missing GMAIL_USER or GMAIL_APP_PASSWORD. Email will not be sent.');
    return { success: false, error: 'Server configuration error: Missing Gmail credentials' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"OTT Box" <${process.env.GMAIL_USER}>`, // Sender address
      to: email, // Receiver address
      subject: 'Welcome to the Future of Streaming 🎬', // Subject line
      html: getWelcomeEmailHtml(name, password), // HTML body
    });

    console.log('Message sent: %s', info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
};
