export const wrapBaseLayout = (title, mainContent) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; color: #333333; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f4f7f6; padding: 40px 0; }
        .container { max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .header { background-color: #1a1a1a; padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; }
        .content { padding: 40px; line-height: 1.6; }
        .footer { background-color: #f4f7f6; padding: 20px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #eef2f1; }
        .footer a { color: #0066cc; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>🛒 ENTERPRISE MARKETPLACE</h1>
          </div>
          
          <!-- Dynamic Main Body Content -->
          <div class="content">
            ${mainContent}
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p>You received this email because you signed up on our platform.</p>
            <p>&copy; 2026 Enterprise Inc. All rights reserved.</p>
            <p><a href="#">Unsubscribe</a> | <a href="#">Support Privacy</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
