
import { Resend } from 'resend';
import { getWelcomeEmailHtml } from './email-templates';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.warn('Missing RESEND_API_KEY. Email operations will fail.');
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const sendWelcomeEmail = async (email: string, name: string, password?: string) => {
  if (!resend) {
    console.error('Resend client not initialized. Missing API Key.');
    return { success: false, error: 'Missing API Key' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'OTT Box <onboarding@resend.dev>', // Use resend's test domain for now
      to: [email],
      subject: 'Welcome to the Future of Streaming 🎬',
      html: getWelcomeEmailHtml(name, password),
    });

    if (error) {
      console.error('Email sending failed:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error };
  }
};
