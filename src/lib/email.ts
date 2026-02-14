
import { Resend } from 'resend';

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
      subject: 'Welcome to OTT Box! 🎬',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #e50914;">OTT Box</h1>
          </div>
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
            <p style="font-size: 16px; color: #333;">Hi <strong>${name}</strong>,</p>
            <p style="font-size: 16px; color: #333;">Welcome to <strong>OTT Box</strong>! We're thrilled to have you on board.</p>
            
            ${password ? `
              <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #e50914;">
                <p style="margin: 0; font-size: 14px; color: #555;">Your Account Credentials:</p>
                <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #000;">Password: <span style="font-family: monospace; background: #ddd; padding: 2px 5px; rounded: 3px;">${password}</span></p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #777;">(We generated this secure password for you. You can change it anytime in your profile.)</p>
              </div>
            ` : ''}
            
            <p style="font-size: 16px; color: #333;">Get ready to explore a world of unlimited entertainment. From trending movies to exclusive series, it's all here.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}" style="background-color: #e50914; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Start Watching</a>
            </div>
          </div>
          <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
            <p>&copy; ${new Date().getFullYear()} OTT Box. All rights reserved.</p>
          </div>
        </div>
      `,
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
