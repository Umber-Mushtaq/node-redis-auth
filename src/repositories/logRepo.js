import { QueueErrorLog } from "../models/QueueErrorLog.js";

export const logPermanentFailure = async (logData) => {
  return await QueueErrorLog.create(logData);
};
