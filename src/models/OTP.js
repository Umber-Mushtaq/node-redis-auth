import mongoose from "mongoose";
import { DB_MODELS } from "../config/constants.js";

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: DB_MODELS.USER,
    required: true,
    index: true,
  },
  code: {
    type: String,
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, //MongoDB will automatically erase this row after 300 seconds (5 minutes)!
  },
});

export const Otp = mongoose.model(DB_MODELS.OTP, otpSchema);
