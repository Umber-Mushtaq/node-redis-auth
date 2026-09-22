import express from "express";
import * as authController from "../controllers/authController.js";
import {
  registerUserSchema,
  loginUserSchema,
} from "../validations/user.validations.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post("/signup", validate(registerUserSchema), authController.signup);

router.post("/login", validate(loginUserSchema), authController.login);

router.post("/verify-otp", authController.verifyOtp);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password", authController.resetPassword);

export default router;
