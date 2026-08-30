import { body } from "express-validator";
import { AvailableUserRole } from "../utils/constants.js";

// ========================================
// REGISTER USER
// ========================================

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),

    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username must have at least 3 characters")
      .customSanitizer((value) => value.toLowerCase()),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must have at least 6 characters"),

    // fullName frontend se optional hai
    body("fullName").optional().trim(),
  ];
};

// ========================================
// LOGIN
// ========================================

const userLoginValidator = () => {
  return [
    body("email").optional().trim().isEmail().withMessage("Email is invalid"),

    body("password").notEmpty().withMessage("Password is required"),
  ];
};

// ========================================
// CHANGE PASSWORD
// ========================================

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required"),

    body("newPassword")
      .notEmpty()
      .withMessage("New password is required")
      .isLength({ min: 6 })
      .withMessage("New password must have at least 6 characters"),
  ];
};

// ========================================
// FORGOT PASSWORD
// ========================================

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};

// ========================================
// RESET PASSWORD
// ========================================

const userResetPasswordValidator = () => {
  return [
    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("New password is required")
      .isLength({ min: 6 })
      .withMessage("New password must have at least 6 characters"),
  ];
};

// ========================================
// PROJECT
// ========================================

const createProjectValidator = () => {
  return [
    body("name").trim().notEmpty().withMessage("Name is required"),

    body("description").optional().trim(),
  ];
};

// ========================================
// ADD MEMBER
// ========================================

const addMembertoProjectValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),

    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(AvailableUserRole)
      .withMessage("Role is invalid"),
  ];
};

// ========================================
// CREATE TASK
// ========================================

const createTaskValidator = () => {
  return [
    body("title").trim().notEmpty().withMessage("Title is required"),

    body("description").optional().trim(),

    body("status")
      .optional()
      .isIn(["todo", "in_progress", "done"])
      .withMessage("Invalid status"),

    body("assignedTo").optional(),
  ];
};

// ========================================
// UPDATE TASK
// ========================================

const updateTaskValidator = () => {
  return [
    body("title").optional().trim(),

    body("description").optional().trim(),

    body("status")
      .optional()
      .isIn(["todo", "in_progress", "done"])
      .withMessage("Invalid status"),

    body("assignedTo").optional(),
  ];
};

// ========================================
// CREATE SUBTASK
// ========================================

const createSubTaskValidator = () => {
  return [body("title").trim().notEmpty().withMessage("Title is required")];
};

// ========================================
// UPDATE SUBTASK
// ========================================

const updateSubTaskValidator = () => {
  return [
    body("title").optional().trim(),

    body("isCompleted")
      .optional()
      .isBoolean()
      .withMessage("isCompleted must be true or false"),
  ];
};

// ========================================
// EXPORTS
// ========================================

export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetPasswordValidator,
  createProjectValidator,
  addMembertoProjectValidator,
  createTaskValidator,
  updateTaskValidator,
  createSubTaskValidator,
  updateSubTaskValidator,
};
