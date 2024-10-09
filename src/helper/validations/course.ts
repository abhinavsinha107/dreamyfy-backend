import { body, checkExact } from "express-validator";

export const createCourse = checkExact([
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Course name is required.")
    .isString()
    .withMessage("Course name must be a string.")
    .isLength({ min: 3 })
    .withMessage("Course name must be at least 3 characters long."),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Course description is required.")
    .isString()
    .withMessage("Course description must be a string."),
  body("price")
    .notEmpty()
    .withMessage("Course price is required.")
    .isFloat({ min: 0 })
    .withMessage("Course price must be a number and at least 0."),
  body("startDate")
    .notEmpty()
    .withMessage("Start Date is required")
    .isISO8601()
    .toDate()
    .withMessage("Start Date must be a valid date"),
  body("endDate")
    .notEmpty()
    .withMessage("End Date is required")
    .isISO8601()
    .toDate()
    .withMessage("End Date must be a valid date"),
  body("subject")
    .notEmpty()
    .withMessage("Subject is required.")
    .isMongoId()
    .withMessage("Subject must be a valid MongoId."),
]);

export const updateCourse = checkExact([
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Course name is required.")
    .isString()
    .withMessage("Course name must be a string.")
    .isLength({ min: 3 })
    .withMessage("Course name must be at least 3 characters long."),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Course description is required.")
    .isString()
    .withMessage("Description must be a string."),
  body("isFinished")
    .optional()
    .isBoolean()
    .withMessage("isFinished must be a boolean."),
]);
