import { Request, Response } from "express";
import Booking from "../schema/booking.schema";
import { createResponse } from "../helper/response";
import createHttpError from "http-errors";

export const createBooking = async (req: Request, res: Response) => {
  const booking = new Booking(req.body);
  await booking.save();
  res.send(createResponse(booking, `New session ${booking._id} created`));
};

export const getBookings = async (req: Request, res: Response) => {
  const bookings = await Booking.find();
  res.send(createResponse(bookings, `Sessions fetched successfully`));
};

export const approveBooking = async (req: Request, res: Response) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    throw createHttpError(404, {
      message: "No booking found for this user",
    });
  }

  booking.approved = true;
  await booking.save();
  res.send(createResponse(booking, `Booking approved successfully`));
};

export const isBookingApproved = async (req: Request, res: Response) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    throw createHttpError(404, {
      message: "No booking found for this user",
    });
  }
  res.send(
    createResponse(booking.approved, `Booking status fetched successfully`)
  );
};
