
export const getWelcomeEmailHtml = (email: string, name: string, password?: string, verificationLink?: string) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to OTT Box</title>
  <style>
    body { margin: 0; padding: 0; background-color: #000000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff; }
    .container { max-width: 600px; margin: 40px auto; background-color: #141414; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.5); border: 1px solid #222; }
    
    /* Header */
    .header { padding: 40px 0 20px; text-align: center; }
    .logo { width: 48px; height: 48px; border-radius: 8px; margin-bottom: 10px; }
    .brand-name { font-size: 24px; font-weight: 800; color: #e50914; margin: 0; letter-spacing: -0.5px; }
    
    /* Hero Icon */
    .hero-icon-container { text-align: center; margin: 20px 0; }
    
    /* Content */
    .content { padding: 20px 40px 40px; text-align: center; }
    .heading { font-size: 28px; font-weight: 700; margin-bottom: 15px; color: #ffffff; letter-spacing: -0.5px; }
    .subtext { font-size: 16px; line-height: 1.6; color: #a1a1aa; margin-bottom: 30px; }
    
    /* Credentials Box */
    .credentials-box { background-color: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 25px; margin: 30px 0; text-align: center; }
    .cred-item { margin-bottom: 20px; }
    .cred-item:last-child { margin-bottom: 0; }
    .cred-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #666; margin-bottom: 8px; font-weight: 600; }
    .cred-value { font-size: 18px; font-weight: 500; color: #ffffff; letter-spacing: 1px; background: #000; padding: 10px 20px; border-radius: 4px; display: inline-block; border: 1px dashed #444; font-family: 'Courier New', monospace; }
    .cred-value-lg { font-size: 24px; font-weight: 700; }
    
    /* CTA Button */
    .cta-button { 
        display: inline-block; 
        background-color: #e50914; 
        color: #ffffff !important; 
        text-decoration: none !important; 
        padding: 16px 40px; 
        border-radius: 6px; 
        font-weight: 600; 
        font-size: 16px; 
        margin: 20px 0; 
        transition: background-color 0.2s; 
    }
    .cta-button:hover { background-color: #f40612; }
    
    /* Footer */
    .footer { background-color: #0a0a0a; padding: 30px 20px; text-align: center; border-top: 1px solid #222; }
    .social-links { margin-bottom: 20px; }
    .social-icon { display: inline-block; margin: 0 10px; color: #666; text-decoration: none; font-size: 14px; }
    .copyright { color: #52525b; font-size: 12px; margin-bottom: 10px; }
    .creator-tag { color: #71717a; font-size: 12px; }
    .creator-tag strong { color: #e50914; }

    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; border-radius: 0 !important; margin: 0 !important; border: none !important; }
      .content { padding: 30px 20px; }
      .heading { font-size: 24px; }
      .cred-value { font-size: 16px; padding: 10px 15px; width: 100%; box-sizing: border-box; display: block; }
      .cred-value-lg { font-size: 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    
    <!-- Header -->
    <div class="header">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="text-decoration: none; display: inline-block;">
        <!-- Embedded SVG Logo -->
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e50914" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;">
            <path d="M18 8a2 2 0 0 0 0-4 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0 0 4"></path>
            <path d="M10 22 9 8"></path>
            <path d="m14 22 1-14"></path>
            <path d="M20 8c.5 0 .9.4.8 1l-2.6 12c-.1.5-.7 1-1.2 1H7c-.6 0-1.1-.4-1.2-1L3.2 9c-.1-.6.3-1 .8-1Z"></path>
        </svg>
        <h1 class="brand-name" style="margin-top: 10px;">OTT BOX</h1>
      </a>
    </div>

    <!-- Hero Icon (Large Popcorn) -->
    <div class="hero-icon-container">
       <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#e50914" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block;">
          <path d="M18 8a2 2 0 0 0 0-4 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0 0 4"/>
          <path d="M10 22 9 8"/>
          <path d="m14 22 1-14"/>
          <path d="M20 8c.5 0 .9.4.8 1l-2.6 12c-.1.5-.7 1-1.2 1H7c-.6 0-1.1-.4-1.2-1L3.2 9c-.1-.6.3-1 .8-1Z"/>
        </svg>
    </div>

    <!-- Content -->
    <div class="content">
      <h1 class="heading">
        ${verificationLink ? 'Confirm Your Account' : 'Welcome Aboard!'}
      </h1>
      
      <p class="subtext">
        ${verificationLink
      ? `Hi <strong>${name}</strong>,<br/>You're one click away from unlimited entertainment. Please verify your email to get started.`
      : `Hi <strong>${name}</strong>,<br/>Your account is all set. We've curated the best movies and shows just for you.`
    }
      </p>

      ${password ? `
        <!-- Credentials Box -->
        <div class="credentials-box">
          <!-- Email Field -->
          <div class="cred-item">
            <div class="cred-label">Your Email</div>
            <div class="cred-value">${email}</div>
          </div>
          
          <!-- Password Field -->
          <div class="cred-item">
            <div class="cred-label">Your Password</div>
            <div class="cred-value cred-value-lg">${password}</div>
          </div>

          <p style="font-size: 12px; color: #666; margin-top: 20px; margin-bottom: 0;">
             (Auto-generated for your security. You can change this later.)
          </p>
        </div>
      ` : ''}

      <!-- CTA -->
      <a href="${verificationLink || process.env.NEXT_PUBLIC_SITE_URL}" class="cta-button">
        ${verificationLink ? 'Verify Email Address' : 'Start Watching Now'}
      </a>
      
      <p style="font-size: 12px; color: #52525b; margin-top: 30px;">
        If you didn't request this, please ignore this email.
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="social-links">
        <a href="https://github.com/SonuPaikrao" class="social-icon">GitHub</a>
        <a href="#" class="social-icon">Twitter</a>
        <a href="#" class="social-icon">Instagram</a>
      </div>
      
      <p class="copyright">
        &copy; ${new Date().getFullYear()} OTT Box. All rights reserved.
      </p>
      
      <p class="creator-tag">
        Made with ❤️ & ☕ by <strong>Sonu Rao</strong>
      </p>
    </div>
  </div>
</body>
</html>
    `;
};
