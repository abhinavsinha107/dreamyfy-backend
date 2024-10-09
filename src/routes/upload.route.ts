import express from "express";
import expressAsyncHandler from "express-async-handler";
import multer from "multer";
// import { uploadAppLogo, getAppLogo, uploadBrandLogo, getBrandLogos, uploadProfilePicture } from "../controllers/upload.controller";
import { authMiddleware } from "../middleware/auth"; // Only used for POST requests
import { catchError } from "../middleware/validation"; // Assuming you have a validation middleware
import { getAppLogo, uploadAppLogo, uploadFile } from "../controllers/upload.controller";

const router = express.Router();

const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  catchError,
  expressAsyncHandler(uploadFile)
);

// Route for uploading the main app logo
router.post(
  "/app-logo",
  authMiddleware,
  upload.single("logo"), // Field name should match the one you use in your form
  catchError,
  uploadAppLogo
);

// Route for getting the main app logo
router.get( 
  "/app-logo",
  getAppLogo
);

// // Route for uploading a brand logo
// router.post(
//   "/brand-logo",
//   authMiddleware,
//   upload.single("logo"), // Field name should match the one you use in your form
//   catchError,
//   uploadBrandLogo
// );

// // Route for getting all brand logos
// router.get(
//   "/brand-logos",
//   getBrandLogos
// );

export default router;
