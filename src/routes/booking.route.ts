import {
  approveBooking,
  createBooking,
  getBookings,
  isBookingApproved,
} from "../controllers/booking.controller";
import express from "express";
import expressAsyncHandler from "express-async-handler";

const router = express.Router();

router.post("/", expressAsyncHandler(createBooking));

router.get("/", expressAsyncHandler(getBookings));

router.patch("/:id", expressAsyncHandler(approveBooking));

router.get('/:id/approved', expressAsyncHandler(isBookingApproved));

export default router;
