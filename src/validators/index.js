import {body}from "express-validator"
import {AvailableUserRole} from "../utils/constants.js"

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
        .withMessage("username is required")
        .isLowercase()
        .withMessage("Username must be in lower case")
        .isLength({min:3})
        .withMessage("username must have 3 characters"),

        body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required"),

        body("fullName")
        .optional()
        .trim()
        
        
        
    ]
}

const userLoginValidator = ()=>{
    return[
        body("email")
        .optional()
        .isEmail()
        .withMessage("Email is invalid"),
        body("password")
        .notEmpty()
        .withMessage("Password is required"),
        
    ];
};

const userChangeCurrentPasswordValidator = ()=>{
    return[
        body("oldPassword").notEmpty().withMessage("Old password is required"),
        body("newPassword").notEmpty().withMessage("Old password is required"),
    ];
};

const userForgotPasswordValidator = ()=>{
    return[
        body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid")
    ]
}

const userResetPasswordValidator = () => {
  return [
    body("newPassword").notEmpty().withMessage("New password is required"),
  ];
};

const createProjectValidator = () => {
    return[
        body("name")
        .notEmpty()
        .withMessage("Name is required"),
        body("description").optional(),
    ];
};

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
        .withMessage("Role is invalid")
    ];
};

const createTaskValidator = () => {
  return [
    body("title").trim().notEmpty().withMessage("Title is required"),

    body("description").optional(),

    body("status")
      .optional()
      .isIn(["todo", "in_progress", "done"])
      .withMessage("Invalid status"),

    body("assignedTo").optional(),
  ];
};

const updateTaskValidator = () => {
  return [
    body("title").optional().trim(),

    body("description").optional(),

    body("status")
      .optional()
      .isIn(["todo", "in_progress", "done"])
      .withMessage("Invalid status"),

    body("assignedTo").optional(),
  ];
};

const createSubTaskValidator = () => {
  return [body("title").trim().notEmpty().withMessage("Title is required")];
};

const updateSubTaskValidator = () => {
  return [
    body("title").optional().trim(),

    body("isCompleted")
      .optional()
      .isBoolean()
      .withMessage("isCompleted must be true or false"),
  ];
};

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