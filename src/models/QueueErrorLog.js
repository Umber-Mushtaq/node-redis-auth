import mongoose from "mongoose";
import { DB_MODELS } from "../config/constants.js";

const queueErrorLogSchema = new mongoose.Schema({
  jobId: { type: String, required: true },
  queueName: { type: String, required: true },
  jobName: { type: String, required: true },
  payload: { type: Object, required: true },
  errorMessage: { type: String, required: true },
  failedAt: { type: Date, default: Date.now },
});

export const QueueErrorLog = mongoose.model(
  DB_MODELS.QUEUE_ERROR_LOG,
  queueErrorLogSchema,
);
