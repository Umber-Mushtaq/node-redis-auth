import Redis from "ioredis";
import { ENV_VARIABLES } from "./constants.js";

export const redisCache = new Redis({
  host: ENV_VARIABLES.REDIS_HOST,
  port: ENV_VARIABLES.REDIS_PORT,
});

redisCache.on("connect", () =>
  console.log("Redis Session Cache Engine connected successfully"),
);
