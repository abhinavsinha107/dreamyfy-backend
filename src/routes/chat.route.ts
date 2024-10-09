import { getChatDetails } from "../controllers/chat.controller";
import express from "express";
import expressAsyncHandler from "express-async-handler";
import { authMiddleware } from "../middleware/auth";
import { catchError } from "../middleware/validation";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  catchError,
  expressAsyncHandler(getChatDetails)
);

export default router;
