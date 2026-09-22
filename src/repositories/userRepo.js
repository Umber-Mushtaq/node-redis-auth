import { User } from "../models/Users.js";

export const findByEmail = async (email) => {
  return await User.findOne({ email });
};

export const create = async (userData) => {
  return await User.create(userData);
};

export const updateStatus = async (userId, status) => {
  return await User.findByIdAndUpdate(userId, { status }, { new: true });
};

export const updatePassword = async (userId, hashedPassword) => {
  return await User.findByIdAndUpdate(
    userId,
    { password: hashedPassword, $inc: { tokenVersion: 1 } },
    { new: true },
  );
};
