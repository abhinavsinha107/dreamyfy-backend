import { body, check, checkExact } from "express-validator";
import User from "../../schema/user.schema";
import createHttpError from "http-errors";

export const userLogin = checkExact([
  body("email")
    .exists({ values: "falsy" })
    .notEmpty()
    .bail()
    .withMessage("Email is required")
    .isEmail()
    .bail()
    .withMessage("Enter valid email"),
  body("password")
    .exists({ values: "falsy" })
    .notEmpty()
    .bail()
    .withMessage("Password is required"),
]);

export const userLoginWithOAuth = checkExact([
  body("name")
    .exists()
    .withMessage("Name is required")
    .bail()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
  body("email")
    .exists({ values: "falsy" })
    .notEmpty()
    .bail()
    .withMessage("Email is required")
    .isEmail()
    .bail()
    .withMessage("Enter valid email"),
]);

export const password = check("password")
  .exists({ values: "falsy" })
  .bail()
  .withMessage("Password is required")
  .notEmpty()
  .bail()
  .withMessage("Password is required")
  .isStrongPassword({
    minLength: 7,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  .bail()
  .withMessage(
    "Password must be at least 8 characters long and contain at least 1 lowercase, 1 uppercase, 1 number and 1 symbol"
  );

export const createUser = checkExact([
  body("name")
    .exists()
    .withMessage("Name is required")
    .bail()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
  body("email")
    .exists()
    .notEmpty()
    .bail()
    .withMessage("Email is required")
    .isEmail()
    .bail()
    .withMessage("Enter valid email")
    .custom(async (value: string, { req }) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw createHttpError(409, {
          message: "Email already registered",
        });
      }
      return true;
    }),
  password,
  body("role")
    .optional()
    .isString()
    .withMessage("Role must be a string")
    .isIn(["ADMIN", "STUDENT", "TEACHER"])
    .withMessage('Role must be one of "ADMIN", "STUDENT", or "TEACHER"'),
]);

export const otpLogin = checkExact([
  body("email")
    .exists({ values: "falsy" })
    .notEmpty()
    .bail()
    .withMessage("Email is required")
    .isEmail()
    .bail()
    .withMessage("Enter valid email"),
]);

export const userUpdate = checkExact([
  body("name")
    .exists()
    .withMessage("Name is required")
    .bail()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
  body("email")
    .exists({ values: "falsy" })
    .notEmpty()
    .bail()
    .withMessage("Email is required")
    .isEmail()
    .bail()
    .withMessage("Enter valid email"),
  body("phoneNumber")
    .optional()
    .isString()
    .withMessage("Phone number must be a string")
    .isLength({ min: 10, max: 14 })
    .withMessage("Phone number must be at least 10 characters long")
    .matches(/^\+?[0-9]{7,15}$/)
    .withMessage("Phone number must be valid"),
  body("dateOfBirth")
    .optional()
    .isDate()
    .withMessage("Date of Birth must be a valid date"),
  body("bio")
    .optional()
    .isString()
    .withMessage("Bio must be a string")
    .isLength({ max: 100 })
    .withMessage("Bio must be at most 100 characters long"),
]);

export const checkOtp = checkExact([
  body("email")
    .exists({ values: "falsy" })
    .notEmpty()
    .bail()
    .withMessage("Email is required")
    .isEmail()
    .bail()
    .withMessage("Enter valid email"),
  body("otp")
    .exists()
    .withMessage("OTP is required")
    .bail() // Stop running validations if any of the previous ones have failed
    .notEmpty()
    .withMessage("OTP cannot be empty"),
]);

export const resetPassword = checkExact([
  body("passwordResetTokenId")
    .exists({ values: "falsy" })
    .bail()
    .withMessage("Password reset token ID is required")
    .isString()
    .bail()
    .withMessage("Password reset token ID must be a string"),
  password,
]);

export const changePassword = checkExact([
  body("oldPassword")
    .exists({ values: "falsy" })
    .withMessage("Old password is required")
    .bail()
    .isString()
    .withMessage("Old password must be a string")
    .bail(),
  password,
]);

export const createTecaher = checkExact([
  // Name validation
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),

  // Email validation
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  // Password validation
  password,

  // Phone number validation
  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[0-9]{10,}$/)
    .withMessage("Phone number must be valid with at least 10 digits"),

  // Date of birth validation
  body("dateOfBirth")
    .notEmpty()
    .withMessage("Date of Birth is required")
    .isISO8601()
    .withMessage("Date of Birth must be a valid date")
    .custom((value) => {
      const date = new Date(value);
      if (date > new Date()) {
        throw new Error("Date of Birth cannot be in the future");
      }
      return true;
    }),

  // Bio validation
  body("bio")
    .notEmpty()
    .withMessage("Bio is required")
    .isLength({ max: 500 })
    .withMessage("Bio must be at most 500 characters"),

  // Role validation
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["TEACHER"])
    .withMessage("Invalid role"),
]);
