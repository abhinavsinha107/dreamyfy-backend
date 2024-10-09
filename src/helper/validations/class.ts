import { body, checkExact } from "express-validator";

export const createClass = checkExact([
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Course name is required.")
    .isString()
    .withMessage("Course name must be a string.")
    .isLength({ min: 3 })
    .withMessage("Course name must be at least 3 characters long."),
  body("classLink")
    .isURL()
    .withMessage("Class Link must be a valid URL.")
    .notEmpty()
    .withMessage("Class Link is required."),
  // body("description")
  //   .optional()
  //   .isString()
  //   .withMessage("Description must be a string."),
  body("course")
    .trim()
    .notEmpty()
    .withMessage("Course id is required.")
    .isString()
    .withMessage("Course id must be a string."),
  body("startTime")
    .trim()
    .notEmpty()
    .withMessage("Class start time is required.")
    .isString()
    .withMessage("Class start time must be a string."),
  body("endTime")
    .trim()
    .notEmpty()
    .withMessage("Class end time is required.")
    .isString()
    .withMessage("Class end time must be a string."),
]);

export const updateClass = checkExact([
  body("name")
    .optional()
    .isString()
    .withMessage("Course name must be a string.")
    .isLength({ min: 3 })
    .withMessage("Course name must be at least 3 characters long."),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string."),
  body("isCancelled")
  .optional()
  .isBoolean()
]);
