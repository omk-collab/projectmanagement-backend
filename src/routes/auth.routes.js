import { Router } from "express";

import {
  registerUser,
  login,
  logoutUser,
  verifyEmail,
  refreshAccessToken,
  forgotPasswordRequest,
  resetForgotPassword,
  getCurrentUser,
  changeCurrentPassword,
  resendEmailverification,
  updateAvatar,
  googleLogin,
  updateAccountDetails,
} from "../controllers/auth.controllers.js";

import { upload } from "../middlewares/multer.middleware.js";

import { validate } from "../middlewares/validator.middleware.js";

import {
  userRegisterValidator,
  userLoginValidator,
  userForgotPasswordValidator,
  userChangeCurrentPasswordValidator,
  userResetPasswordValidator,
} from "../validators/index.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

// ========================================
// Rate Limiters
// ========================================

import {
  authLimiter,
  emailLimiter,
  passwordResetLimiter,
} from "../middlewares/rate-limit.middleware.js";

const router = Router();

// ========================================
// PUBLIC / UNSECURED ROUTES
// ========================================

// Register
router
  .route("/register")
  .post(authLimiter, userRegisterValidator(), validate, registerUser);

// Login
router.route("/login").post(authLimiter, userLoginValidator(), validate, login);

// Google Login
router.route("/google").post(googleLogin);

// Verify Email
router.route("/verify-email/:verificationToken").get(verifyEmail);

// Refresh Token
router.route("/refresh-token").post(authLimiter, refreshAccessToken);

// Forgot Password
router
  .route("/forgot-password")
  .post(
    emailLimiter,
    userForgotPasswordValidator(),
    validate,
    forgotPasswordRequest,
  );

// Reset Password
router
  .route("/reset-password/:resetToken")
  .post(
    passwordResetLimiter,
    userResetPasswordValidator(),
    validate,
    resetForgotPassword,
  );

// ========================================
// SECURE ROUTES
// ========================================

// Logout
router.route("/logout").post(verifyJWT, logoutUser);

// Current User
router.route("/current-user").post(verifyJWT, getCurrentUser);

// Change Password
router
  .route("/change-password")
  .post(
    verifyJWT,
    userChangeCurrentPasswordValidator(),
    validate,
    changeCurrentPassword,
  );

// Resend Email Verification
router
  .route("/resend-email-verification")
  .post(verifyJWT, emailLimiter, resendEmailverification);

// Update Account
router.patch("/update-account", verifyJWT, updateAccountDetails);

// Update Avatar
router
  .route("/update-avatar")
  .post(verifyJWT, upload.single("avatar"), updateAvatar);

export default router;
