import jwt from "jsonwebtoken";
import { ENV_VARIABLES } from "../config/constants.js";

export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({
        success: false,
        error: "Access denied. Authentication token missing.",
      });
  }

  try {
    const decodedPayload = jwt.verify(token, ENV_VARIABLES.JWT_ACCESS_SECRET);
    req.user = decodedPayload;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({
        success: false,
        error: "Authentication credentials invalid or expired.",
      });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access Denied: Unauthorized role context clearance [${req.user?.role || "GUEST"}]`,
      });
    }
    next();
  };
};
