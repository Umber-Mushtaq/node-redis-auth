export const ENV_VARIABLES = Object.freeze({
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  EMAIL_SERVICE: process.env.EMAIL_SERVICE,
  EMAIL_USERNAME: process.env.EMAIL_USERNAME,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  JWT_ACCESS_SECRET:
    process.env.JWT_ACCESS_SECRET || "default_fallback_access_secret_key_123",
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || "default_fallback_refresh_secret_key_456",
});

export const DB_MODELS = Object.freeze({
  USER: "User",
  OTP: "Otp",
  QUEUE_ERROR_LOG: "QueueErrorLog",
});

export const QUEUES = Object.freeze({
  EMAIL: "Email-Queue",
});

export const QUEUE_JOBS = Object.freeze({
  SEND_VERIFICATION_OTP: "sendVerificationOTP",
  SEND_WELCOME_EMAIL: "sendWelcomeEmail",
  SEND_PASSWORD_RESET_OTP: "sendPasswordResetOTP",
});

export const USER_ROLES = Object.freeze({
  BUYER: "BUYER",
  SELLER: "SELLER",
  ADMIN: "ADMIN",
});

export const ACCOUNT_STATUS = Object.freeze({
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  BANNED: "BANNED",
});
