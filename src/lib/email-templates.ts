
export const getWelcomeEmailHtml = (name: string, password?: string) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to OTT Box</title>
  <style>
    body { margin: 0; padding: 0; background-color: #000000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff; }
    .container { max-width: 600px; margin: 0 auto; background-color: #141414; overflow: hidden; }
    .header { padding: 40px 20px; text-align: center; background: linear-gradient(180deg, rgba(229,9,20,0.1) 0%, rgba(20,20,20,0) 100%); border-bottom: 1px solid #333; }
    .logo { color: #e50914; font-size: 32px; font-weight: 800; letter-spacing: -1px; text-decoration: none; display: inline-block; }
    .content { padding: 40px 30px; }
    .greeting { font-size: 24px; font-weight: 700; margin-bottom: 20px; color: #ffffff; }
    .text { font-size: 16px; line-height: 1.6; color: #cccccc; margin-bottom: 20px; }
    .credentials-box { background-color: #1f1f1f; border: 1px solid #333; border-radius: 8px; padding: 25px; margin: 30px 0; text-align: center; }
    .cred-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 10px; }
    .cred-value { font-size: 24px; font-family: monospace; font-weight: 700; color: #ffffff; letter-spacing: 2px; background: #000; padding: 10px 20px; border-radius: 4px; display: inline-block; border: 1px dashed #444; }
    .cta-button { display: block; width: 100%; max-width: 250px; margin: 40px auto 0; background-color: #e50914; color: #ffffff; text-align: center; padding: 16px 0; border-radius: 4px; font-weight: 700; font-size: 16px; text-decoration: none; transition: background-color 0.3s; }
    .footer { padding: 30px 20px; text-align: center; font-size: 12px; color: #666666; border-top: 1px solid #222; background-color: #0a0a0a; }
    .social-links { margin-bottom: 15px; }
    .social-link { color: #999; text-decoration: none; margin: 0 10px; }
    
    @media only screen and (max-width: 600px) {
      .content { padding: 30px 20px; }
      .greeting { font-size: 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header with Logo -->
    <div class="header">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}" class="logo">OTT BOX</a>
    </div>

    <!-- Main Content -->
    <div class="content">
      <h1 class="greeting">Welcome, ${name}.</h1>
      
      <p class="text">
        Your journey into unlimited entertainment starts here. We've curated the best movies and series just for you.
      </p>

      ${password ? `
        <!-- Credentials Section -->
        <div class="credentials-box">
          <div class="cred-label">Your Secure Password</div>
          <div class="cred-value">${password}</div>
          <p style="font-size: 12px; color: #666; margin-top: 15px; margin-bottom: 0;">
            We automatically generated this secure password for you. <br>You can change it anytime in your account settings.
          </p>
        </div>
      ` : ''}

      <p class="text">
        Sit back, relax, and start streaming in high quality. No ads, just pure cinematic experience.
      </p>

      <!-- CTA Button -->
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}" class="cta-button">Start Watching Now</a>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="social-links">
        <a href="#" class="social-link">Instagram</a> • 
        <a href="#" class="social-link">Twitter</a> • 
        <a href="#" class="social-link">Help Center</a>
      </div>
      <p>&copy; ${new Date().getFullYear()} OTT Box. All rights reserved.</p>
      <p>This is an automated message, please do not reply.</p>
    </div>
  </div>
</body>
</html>
    `;
};
