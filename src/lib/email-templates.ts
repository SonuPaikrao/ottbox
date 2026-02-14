
export const getWelcomeEmailHtml = (name: string, password?: string, verificationLink?: string) => {
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
    .logo { display: block; margin: 0 auto; max-width: 150px; height: auto; }
    .content { padding: 40px 30px; }
    .greeting { font-size: 24px; font-weight: 700; margin-bottom: 20px; color: #ffffff; }
    .text { font-size: 16px; line-height: 1.6; color: #cccccc; margin-bottom: 20px; }
    .credentials-box { background-color: #1f1f1f; border: 1px solid #333; border-radius: 8px; padding: 25px; margin: 30px 0; text-align: center; }
    .cred-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 10px; }
    .cred-value { font-size: 24px; font-family: monospace; font-weight: 700; color: #ffffff; letter-spacing: 2px; background: #000; padding: 10px 20px; border-radius: 4px; display: inline-block; border: 1px dashed #444; }
    .cta-button { display: block; width: 100%; max-width: 280px; margin: 40px auto 0; background-color: #e50914; color: #ffffff; text-align: center; padding: 18px 0; border-radius: 4px; font-weight: 700; font-size: 16px; text-decoration: none; transition: background-color 0.3s; text-transform: uppercase; letter-spacing: 0.5px; }
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
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="text-decoration: none;">
        <!-- Using absolute path for logo -->
        <img src="https://ott-box-weld.vercel.app/logo.svg" alt="OTT BOX" class="logo" width="40" height="40" style="width: 40px; height: 40px;" />
        <div style="color: #e50914; font-size: 24px; font-weight: 800; letter-spacing: -1px; margin-top: 10px;">OTT BOX</div>
      </a>
    </div>

    <!-- Main Content -->
    <div class="content">
      <h1 class="greeting">Welcome to the Club, ${name}.</h1>
      
      <p class="text">
        ${verificationLink
      ? "You're just one step away from unlimited entertainment. Please confirm your account below."
      : "Your journey into unlimited entertainment starts here. We've curated the best movies and series just for you."
    }
      </p>

      ${password ? `
        <!-- Credentials Section -->
        <div class="credentials-box">
          <div class="cred-label">Your Account Credentials</div>
          <div class="cred-value">${password}</div>
          <p style="font-size: 12px; color: #666; margin-top: 15px; margin-bottom: 0;">
             Keep this safe. You can use this to login to your OTT Box account.
          </p>
        </div>
      ` : ''}

      <p class="text">
        Sit back, relax, and start streaming in high quality. No ads, just pure cinematic experience.
      </p>

      <!-- CTA Button -->
      <a href="${verificationLink || process.env.NEXT_PUBLIC_SITE_URL}" class="cta-button">
        ${verificationLink ? 'Confirm Account' : 'Start Watching Now'}
      </a>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="social-links">
        <a href="https://instagram.com" class="social-link">Instagram</a> • 
        <a href="https://twitter.com" class="social-link">Twitter</a> • 
        <a href="https://github.com/SonuPaikrao" class="social-link">Github</a>
      </div>
      <p>&copy; ${new Date().getFullYear()} OTT Box. All rights reserved.</p>
      <p style="margin-top: 10px; font-size: 12px; color: #888;">
        Made with ❤️ & ☕ by <strong style="color: #ccc;">Sonu Rao</strong>
      </p>
    </div>
  </div>
</body>
</html>
    `;
};
