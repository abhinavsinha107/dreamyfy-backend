import express from "express";
import expressAsyncHandler from "express-async-handler";
import { catchError, validate } from "../middleware/validation";
import {
  createUser,
  loginUser,
  loginWithOAuth,
} from "../controllers/auth.controller";

const router = express.Router();

router.post(
  "/register",
  validate("users:create"),
  catchError,
  expressAsyncHandler(createUser)
);

router.post(
  "/login",
  validate("users:login"),
  catchError,
  expressAsyncHandler(loginUser)
);

router.post(
  "/oauth",
  validate("users:loginWithOAuth"),
  catchError,
  expressAsyncHandler(loginWithOAuth)
);

router.post(
  "/register-tutor",
  validate("teacher:create"),
  catchError,
  expressAsyncHandler(createUser)
);

export default router;
