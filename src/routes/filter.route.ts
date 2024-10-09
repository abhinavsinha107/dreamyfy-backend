import express from "express";
import expressAsyncHandler from "express-async-handler";
import { filterCourses } from "../controllers/filter.controller";

const router = express.Router();

router.post(
  "/courses",
  expressAsyncHandler(filterCourses)
);


export default router;
