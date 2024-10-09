import express from "express";
import expressAsyncHandler from "express-async-handler";
import { catchError } from "../middleware/validation";
import { authMiddleware } from "../middleware/auth";
import {createOnboardingSession, createPaymentSession, handleStripeWebhook} from "../controllers/payment.controller";
import bodyParser from "body-parser";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    catchError,
    expressAsyncHandler(createPaymentSession)
);
router.post(
    "/handleEvents",
    bodyParser.raw({ type: 'application/json' }),
    handleStripeWebhook
);

router.post(
    "/onBoard",
    authMiddleware,
    catchError,
    createOnboardingSession
);

export default router;
