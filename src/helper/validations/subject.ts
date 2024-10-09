import { body, checkExact } from "express-validator";

export const createSubject = checkExact([
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Subject name is required.")
    .isString()
    .withMessage("Subject name must be a string.")
    .isLength({ min: 3 })
    .withMessage("Subject name must be at least 3 characters long."),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Subject description is required.")
    .isString()
    .withMessage("Subject description must be a string."),
]);

export const updateSubject = checkExact([
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Subject name is required.")
    .isString()
    .withMessage("Subject name must be a string.")
    .isLength({ min: 3 })
    .withMessage("Subject name must be at least 3 characters long."),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Subject description is required.")
    .isString()
    .withMessage("Description must be a string."),
]);
