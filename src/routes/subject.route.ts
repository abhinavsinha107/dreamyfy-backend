import express from "express";
import expressAsyncHandler from "express-async-handler";
import {
  catchError,
  validate,
  validateIdParam,
} from "../middleware/validation";
import {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject
} from "../controllers/subject.controller";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validate("subject:create"),
  catchError,
  expressAsyncHandler(createSubject)
);

router.get(
  "/",
  catchError,
  expressAsyncHandler(getAllSubjects)
);

router.get(
  "/:id",
  authMiddleware,
  validateIdParam("id"),
  catchError,
  expressAsyncHandler(getSubjectById)
);

router.patch(
  "/:id",
  authMiddleware,
  validateIdParam("id"),
  validate("subject:update"),
  catchError,
  expressAsyncHandler(updateSubject)
);

router.delete(
  "/:id",
  authMiddleware,
  validateIdParam("id"),
  catchError,
  expressAsyncHandler(deleteSubject)
);

export default router;
