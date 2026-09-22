import { Worker } from "bullmq";
import nodemailer from "nodemailer";
import { ENV_VARIABLES, QUEUES, QUEUE_JOBS } from "../config/constants.js";
import * as authEmailTemplates from "../emailTemplates/authTemplates.js";
import * as logRepository from "../repositories/logRepo.js";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "umber22j@gmail.com",
    pass: "cliqyhgfspvyzeoa",
  },
});

console.log(`⏳ Email worker process actively listening to ${QUEUES.EMAIL}...`);

export const emailWorker = new Worker(
  QUEUES.EMAIL,
  async (job) => {
    const { email, otp } = job.data;

    if (job.name === QUEUE_JOBS.SEND_VERIFICATION_OTP) {
      console.log(`[Worker] Executing OTP email delivery for ${email}`);

      const mailOptions = {
        from: `"Enterprise Auth" <${ENV_VARIABLES.EMAIL_USERNAME}>`,
        to: email,
        subject: "Verify Your New Account 🔑",
        text: `Your account verification OTP code is: ${otp}.`,
        html: authEmailTemplates.getOtpEmailTemplate(otp), // 🟢 UPDATED: Calls your template function
      };

      await transporter.sendMail(mailOptions);
      console.log(`[Worker] 🎉 OTP Email successfully delivered!`);
    } else if (job.name === QUEUE_JOBS.SEND_WELCOME_EMAIL) {
      console.log(
        `[Worker] Executing Welcome Email payload delivery for ${email}`,
      );

      const mailOptions = {
        from: `"Enterprise Auth" <${ENV_VARIABLES.EMAIL_USERNAME}>`,
        to: email,
        subject: "Welcome to Our Platform! 🎉",
        text: `Welcome aboard! Your account is now fully verified and active.`,
        html: authEmailTemplates.getWelcomeEmailTemplate(email),
      };

      await transporter.sendMail(mailOptions);
      console.log(
        `[Worker] 🎉 Welcome Email successfully delivered to ${email}!`,
      );
    } else if (job.name === QUEUE_JOBS.SEND_PASSWORD_RESET_OTP) {
      console.log(
        `[Worker] Executing Forgot Password OTP delivery for ${email}`,
      );

      const mailOptions = {
        from: `"Enterprise Auth" <${ENV_VARIABLES.EMAIL_USERNAME}>`,
        to: email,
        subject: "Reset Your Account Password 🔒",
        text: `Your password reset code is: ${otp}.`,
        html: authEmailTemplates.getForgotPasswordEmailTemplate(otp),
      };

      await transporter.sendMail(mailOptions);
      console.log(
        `[Worker] 🎉 Password reset email successfully delivered to ${email}!`,
      );
    }
  },
  {
    connection: {
      host: ENV_VARIABLES.REDIS_HOST || "127.0.0.1",
      port: parseInt(ENV_VARIABLES.REDIS_PORT || "6379", 10),
    },
    concurrency: 2,
  },
);

emailWorker.on("failed", async (job, err) => {
  if (job.attemptsMade >= job.opts.attempts) {
    console.error(
      `\n[🚨 DEAD LETTER QUEUE] Job ID ${job.id} failed after max retries! Saving to Mongo...`,
    );

    try {
      await logRepository.logPermanentFailure({
        jobId: job.id,
        queueName: job.queueName,
        jobName: job.name,
        payload: job.data,
        errorMessage: err.message,
      });

      console.log(
        `[Database Log] 💾 Successfully saved failure record for Job ID ${job.id} to MongoDB.`,
      );
    } catch (dbError) {
      console.error(
        `❌ CRITICAL: Failed to write queue error to MongoDB: ${dbError.message}`,
      );
    }
  }
});
