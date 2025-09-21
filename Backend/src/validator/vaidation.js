import { body } from "express-validator";

const registrationValidator = () => {
  return [
    body("username")
      .notEmpty().withMessage("Username is required")
      .isString().withMessage("Username must be a string")
      .isLength({ min: 3 }).withMessage("Username requires minimum 3 characters")
      .isLength({ max: 13 }).withMessage("Username cannot exceed 13 characters")
      .trim(),

    body("avatar")
      .optional()
      .isURL().withMessage("Avatar must be a valid URL")
      .trim(),

    body("email")
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Email is invalid")
      .normalizeEmail(),

    body("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 6 }).withMessage("Password requires minimum 6 characters")
      .isLength({ max: 20 }).withMessage("Password cannot exceed 20 characters")
      .trim()
  ];
};

const loginValidator = () => {
  return [
    body("email")
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Email is invalid")
      .normalizeEmail(),

    body("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 6 }).withMessage("Password requires minimum 6 characters")
      .isLength({ max: 20 }).withMessage("Password cannot exceed 20 characters")
  ];
};

const verifyEmailOTPValidator = () => {
  return [
    body("verifyOTP")
      .notEmpty().withMessage("OTP is required")
      .isNumeric().withMessage("OTP must be numeric")
      .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits long")
  ];
};

const resetPasswordOTPValidator = () => {
  return [
    body("resetPasswordOTP")
      .notEmpty().withMessage("Reset password OTP is required")
      .isNumeric().withMessage("OTP must be numeric")
      .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits long")
  ];
};

const createNoteValidator = () => {
  return [
    body("title")
      .notEmpty().withMessage("Title is required")
      .isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters")
      .trim(),

    body("description")
      .notEmpty().withMessage("Description is required")
      .isLength({ max: 1000 }).withMessage("Description cannot exceed 1000 characters")
      .trim(),

    body("color")
      .optional()
      .isHexColor().withMessage("Color must be a valid hex code"),

    body("mediaUpload")
      .optional()
      .isURL().withMessage("Media upload must be a valid URL")
  ];
};

export {
  registrationValidator,
  loginValidator,
  resetPasswordOTPValidator,
  verifyEmailOTPValidator,
  createNoteValidator
};
