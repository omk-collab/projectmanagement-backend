import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";

export const validate = (req, res, next) => {
  console.log("Request Body:", req.body);

  const errors = validationResult(req);

  console.log("Validation Errors:", errors.array());

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];

  errors.array().forEach((err) => {
    extractedErrors.push({
      [err.path]: err.msg,
    });
  });

  throw new ApiError(422, "Received data is not valid", extractedErrors);
};
