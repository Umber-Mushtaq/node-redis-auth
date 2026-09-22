import { Otp } from "../models/OTP.js";

export const create = async (userId, code) => {
  return await Otp.create({ userId, code });
};

export const findLatestByUserId = async (userId) => {
  return await Otp.findOne({ userId }).sort({ createdAt: -1 });
};

export const incrementAttempts = async (otpId) => {
  return await Otp.findByIdAndUpdate(
    otpId,
    { $inc: { attempts: 1 } },
    { new: true },
  );
};

export const deleteByUserId = async (userId) => {
  return await Otp.deleteMany({ userId });
};
