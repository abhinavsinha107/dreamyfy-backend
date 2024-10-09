import express from "express";
import expressAsyncHandler from "express-async-handler";
import {
  catchError,
  validate,
  validateIdParam,
  // validateIdParam,
} from "../middleware/validation";
import {
  createClass,
  getAllClasses,
  getClassById,
  updateClassById,
  // updateClassById,
} from "../controllers/class.controller";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validate("classes:create"),
  catchError,
  expressAsyncHandler(createClass)
);

// router.get(
//   "/teacher",
//   authMiddleware,
//   catchError,
//   expressAsyncHandler(getAllClasses)
// );

router.get(
  "/:id",
  authMiddleware,
  catchError,
  expressAsyncHandler(getClassById)
);
router.get("/", authMiddleware, catchError, expressAsyncHandler(getAllClasses));

router.patch(
  "/:id",
  authMiddleware,
  validateIdParam("id"),
  validate("classes:update"),
  catchError,
  expressAsyncHandler(updateClassById)
);

export default router;
