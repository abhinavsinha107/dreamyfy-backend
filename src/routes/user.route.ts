import express from "express";
import expressAsyncHandler from "express-async-handler";
import {
  catchError,
  validate,
  validateIdParam,
} from "../middleware/validation";
import { getTeachers, getUserById, updateUserById } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();
router.get(
  "/tutors",
  expressAsyncHandler(getTeachers)
);
router.get(
  "/:id",
  // authMiddleware,
  // validateIdParam("id"),
  catchError,
  expressAsyncHandler(getUserById)
);

router.patch(
  "/:id",
  authMiddleware,
  validateIdParam("id"),
  validate("users:update"),
  catchError,
  expressAsyncHandler(updateUserById)
);



export default router;
