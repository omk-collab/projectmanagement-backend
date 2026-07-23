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
} from "../controllers/auth.controllers.js";

import { validate } from "../middlewares/validator.middleware.js";

import {
  userRegisterValidator,
  userLoginValidator,
  userForgotPasswordValidator,
  userChangeCurrentPasswordValidator,
} from "../validators/index.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Unsecured routes
router.route("/register").post(userRegisterValidator(), validate, registerUser);

router.route("/login").post(userLoginValidator(), validate, login);

router.route("/verify-email/:verificationToken").get(verifyEmail);

router.route("/refresh-token").post(refreshAccessToken);

router
  .route("/forgot-password")
  .post(userForgotPasswordValidator(), validate, forgotPasswordRequest);

router
  .route("/reset-password/:resetToken")
  .post(userForgotPasswordValidator(), validate, resetForgotPassword);

// Secure routes
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/current-user").post(verifyJWT, getCurrentUser);

router
  .route("/change-password")
  .post(
    verifyJWT,
    userChangeCurrentPasswordValidator(),
    validate,
    changeCurrentPassword,
  );

router
  .route("/resend-email-verification")
  .post(verifyJWT, resendEmailverification);

export default router;
