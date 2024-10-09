import express from "express";
import expressAsyncHandler from "express-async-handler";
import {
  catchError,
  validate,
  validateIdParam,
} from "../middleware/validation";
import {
  approveCourse,
  createCourse,
  getAllCourses,
  getCourseById,
  getstudentEnrolledCourses,
} from "../controllers/course.controller";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validate("courses:create"),
  catchError,
  expressAsyncHandler(createCourse)
);

router.get("/", authMiddleware, catchError, expressAsyncHandler(getAllCourses));
router.get("/enrolled-classes", authMiddleware, catchError, expressAsyncHandler(getstudentEnrolledCourses));

router.get(
  "/:id",
  authMiddleware,
  validateIdParam("id"),
  catchError,
  expressAsyncHandler(getCourseById)
);

router.patch(
  "/:id",
  authMiddleware,
  validateIdParam("id"),
  catchError,
  expressAsyncHandler(approveCourse)
);

// router.put(
//   "/:id",
//   authMiddleware,
//   validateIdParam("id"),
//   validate("courses:update"),
//   catchError,
//   expressAsyncHandler(updateCourse)
// );

export default router;
