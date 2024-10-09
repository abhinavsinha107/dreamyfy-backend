import mongoose, { Types } from "mongoose";
import { type BaseSchema } from "./index";
import {IUser} from "./user.schema";

const Schema = mongoose.Schema;

export interface ICourse extends BaseSchema {
  name: string;
  description: string;
  price: number;
  teacher: IUser;
  subject: Types.ObjectId;
  isFinished: boolean;
  startDate: Date;
  endDate: Date;
  isApproved: boolean;
}

const CourseSchema = new Schema<ICourse>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subject",
      required: true,
    },
    isFinished: { type: Boolean, default: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Course = mongoose.model<ICourse>("course", CourseSchema);

export default Course;
