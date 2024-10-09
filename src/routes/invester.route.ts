import express from "express";
import expressAsyncHandler from "express-async-handler";
import { getInversterController,postInversterController} from "../controllers/inversterController";

const router = express.Router();

// POST: Filter courses based on criteria (e.g., subject ID)
router.get(
  "/", // Consider changing to a more descriptive route if needed // Optional: validate the request body (implement this if necessary)             // Error handling middleware
  expressAsyncHandler(getInversterController) // Async handler for the filter function
);
router.post(
    "/",
    expressAsyncHandler(postInversterController)
);

export default router;
