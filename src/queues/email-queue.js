import { Queue } from "bullmq";
import { ENV_VARIABLES, QUEUES } from "../config/constants.js";

export const emailQueue = new Queue(QUEUES.EMAIL, {
  connection: {
    host: ENV_VARIABLES.REDIS_HOST || "127.0.0.1",
    port: parseInt(ENV_VARIABLES.REDIS_PORT || "6379", 10),
  },
});
