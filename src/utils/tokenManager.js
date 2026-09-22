import jwt from "jsonwebtoken";
import { ENV_VARIABLES } from "../config/constants.js";
import { redisCache } from "../config/redisCache.js";

export const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    ENV_VARIABLES.JWT_ACCESS_SECRET,
    { expiresIn: "15m" },
  );
};

export const generateRefreshToken = async (user) => {
  console.log("Access Token", ENV_VARIABLES.JWT_REFRESH_SECRET);
  const refreshToken = jwt.sign(
    { userId: user._id, tokenVersion: user.tokenVersion },
    ENV_VARIABLES.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );

  await redisCache.set(
    `session:${user._id}`,
    user.tokenVersion,
    "EX",
    7 * 24 * 60 * 60,
  );

  return refreshToken;
};

export const revokeSession = async (userId) => {
  await redisCache.del(`session:${userId}`);
};
