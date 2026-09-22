import * as authService from "../services/authService.js";

export const signup = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password fields are required",
      });
    }

    const registeredUser = await authService.registerUser(
      email,
      password,
      role,
    );

    return res.status(201).json({
      success: true,
      message:
        "Account creation initiated. Your verification OTP has been routed to the queue.",
      user: registeredUser,
    });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        error: "User ID and OTP code are both required parameters.",
      });
    }

    const verificationResult = await authService.verifyOtp(userId, otp);

    return res.status(200).json({
      success: true,
      message: verificationResult.message,
    });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email and password are required" });
    }

    const { user, accessToken, refreshToken } = await authService.loginUser(
      email,
      password,
    );

    console.log("login access and refresh tokesn", accessToken, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful. Session established.",
      accessToken,
      user,
    });
  } catch (error) {
    return res.status(401).json({ success: false, error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, error: "Email field is required." });
    }

    const result = await authService.initiateForgotPassword(email);

    return res.status(200).json({
      success: true,
      message: "Password reset code successfully dispatched to the queue.",
      userId: result.userId,
    });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body;

    if (!userId || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        error:
          "User ID, OTP code, and new password are all required parameters.",
      });
    }

    const result = await authService.resetPassword(userId, otp, newPassword);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};
