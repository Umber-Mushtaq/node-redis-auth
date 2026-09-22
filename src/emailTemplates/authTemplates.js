import { wrapBaseLayout } from "./baseLayout.js";

export const getOtpEmailTemplate = (otp) => {
  const content = `
    <h2 style="color: #1a1a1a; margin-top: 0;">Verify Your New Account</h2>
    <p>Thank you for registering on our platform! To finalize your account setup, please use the 6-digit verification code below:</p>
    
    <div style="background-color: #f0f4f8; border: 1px dashed #0066cc; border-radius: 6px; padding: 20px; text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0066cc;">${otp}</span>
    </div>
    
    <p style="color: #666666; font-size: 14px;">🚨 This OTP code token is strictly single-use and will automatically expire in 5 minutes. If you did not make this request, please ignore this email safely.</p>
  `;

  return wrapBaseLayout("Verify Your Account", content);
};

export const getWelcomeEmailTemplate = (email) => {
  const username = email.split("@")[0];

  const content = `
    <h2 style="color: #1a1a1a; margin-top: 0;">Welcome Aboard, ${username}! 🎉</h2>
    <p>Your e-commerce account has been successfully verified and is now completely <b>ACTIVE</b>.</p>
    <p>You now have full credentials access to our global marketplace ecosystem. Start managing your store parameters or browsing curated items right away!</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="http://localhost:3000/login" style="background-color: #0066cc; color: #ffffff; padding: 14px 30px; text-align: center; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
        Log In To Your Dashboard
      </a>
    </div>
    
    <p>If you have any integration configuration questions or profile difficulties, our engineering support lines are always open to assist you.</p>
  `;

  return wrapBaseLayout("Welcome to Our Platform!", content);
};

export const getForgotPasswordEmailTemplate = (otp) => {
  const content = `
    <h2 style="color: #1a1a1a; margin-top: 0; color: #d9534f;">Password Reset Request</h2>
    <p>We received a request to reset the password for your e-commerce account. Please use the 6-digit security verification code below to authorize this change:</p>
    
    <div style="background-color: #fff5f5; border: 1px dashed #d9534f; border-radius: 6px; padding: 20px; text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #d9534f;">${otp}</span>
    </div>
    
    <p style="color: #666666; font-size: 14px;">🚨 This code will automatically expire in 5 minutes. <b>If you did not request a password reset, please ignore this email immediately.</b> Your account remains secure.</p>
  `;

  return wrapBaseLayout("Reset Your Password", content);
};
