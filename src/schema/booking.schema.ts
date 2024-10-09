import mongoose from "mongoose";
import { type BaseSchema } from "./index";

const Schema = mongoose.Schema;

export interface IBooking extends BaseSchema {
    name: string;
    email: string;
    date: string;
    time: string;
    comments: string;
    approved: boolean;
}

const BookingSchema = new Schema<IBooking>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        comments: { type: String, default: '' },
        approved: { type: Boolean, default: false },
    }, { timestamps: true }
);

const Booking = mongoose.model<IBooking>("booking", BookingSchema);

export default Booking;
