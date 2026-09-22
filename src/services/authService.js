import * as userRepository from "../repositories/userRepo.js";
import * as otpRepository from "../repositories/otpRepo.js";
import { emailQueue } from "../queues/email-queue.js";
import {
  QUEUE_JOBS,
  ENV_VARIABLES,
  ACCOUNT_STATUS,
} from "../config/constants.js";
import bcrypt from "bcrypt";
import * as tokenManager from "../utils/tokenManager.js";

export const registerUser = async (email, password, role) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) throw new Error("Email is already registered");

  const saltRounds = parseInt(ENV_VARIABLES.SALT_ROUNDS || "10", 10);
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = await userRepository.create({
    email,
    password: hashedPassword,
    role,
  });

  const generatedOtp = Math.floor(100000 + Math.random() * 900000);
  await otpRepository.create(newUser._id, generatedOtp);

  await emailQueue.add(
    QUEUE_JOBS.SEND_VERIFICATION_OTP,
    { userId: newUser._id, email: newUser.email, otp: generatedOtp },
    { attempts: 3, backoff: { type: "exponential", delay: 5000 } },
  );
  return { id: newUser._id, email: newUser.email, role: newUser.role };
};

export const loginUser = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new Error("Invalid email or password credentials");

  if (user.status === ACCOUNT_STATUS.PENDING) {
    throw new Error(
      "Account has not been verified yet. Please submit your registration OTP.",
    );
  }
  if (user.status === ACCOUNT_STATUS.BANNED) {
    throw new Error(
      "This account has been suspended by administration handles.",
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password credentials");

  const accessToken = tokenManager.generateAccessToken(user);
  const refreshToken = await tokenManager.generateRefreshToken(user);

  return {
    user: { id: user._id, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  };
};

export const verifyOtp = async (userId, userSubmittedCode) => {
  const latestOtpRecord = await otpRepository.findLatestByUserId(userId);

  if (!latestOtpRecord) {
    throw new Error("OTP code has expired or was never requested.");
  }

  if (latestOtpRecord.attempts >= 5) {
    await otpRepository.deleteByUserId(userId);
    throw new Error(
      "Too many failed verification attempts. Please request a new OTP.",
    );
  }

  if (latestOtpRecord.code !== userSubmittedCode.toString()) {
    await otpRepository.incrementAttempts(latestOtpRecord._id);
    throw new Error("Invalid OTP code. Please try again.");
  }

  await userRepository.updateStatus(userId, ACCOUNT_STATUS.ACTIVE);

  await otpRepository.deleteByUserId(userId);

  return { success: true, message: "Account verified successfully!" };
};

export const initiateForgotPassword = async (email) => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new Error("No account found with this email address.");

  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

  await otpRepository.create(user._id, generatedOtp);

  await emailQueue.add(
    QUEUE_JOBS.SEND_PASSWORD_RESET_OTP,
    { userId: user._id, email: user.email, otp: generatedOtp },
    { attempts: 3, backoff: { type: "exponential", delay: 5000 } },
  );

  return { userId: user._id };
};

export const resetPassword = async (userId, userSubmittedCode, newPassword) => {
  const latestOtpRecord = await otpRepository.findLatestByUserId(userId);
  if (!latestOtpRecord)
    throw new Error("Reset token has expired or was never requested.");

  if (latestOtpRecord.attempts >= 5) {
    await otpRepository.deleteByUserId(userId);
    throw new Error(
      "Too many failed verification attempts. Please request a new code.",
    );
  }

  if (latestOtpRecord.code !== userSubmittedCode.toString()) {
    await otpRepository.incrementAttempts(latestOtpRecord._id);
    throw new Error("Invalid password reset code.");
  }

  const saltRounds = parseInt(ENV_VARIABLES.SALT_ROUNDS || "10", 10);
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  await userRepository.updatePassword(userId, hashedPassword);

  await tokenManager.revokeSession(userId);

  await otpRepository.deleteByUserId(userId);

  return {
    success: true,
    message: "Your password has been reset successfully.",
  };
};
