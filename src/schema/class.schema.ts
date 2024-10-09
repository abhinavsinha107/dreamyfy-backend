import mongoose, { Types } from "mongoose";
import { type BaseSchema } from "./index";

const Schema = mongoose.Schema;

export interface IClass extends BaseSchema {
  name: string;
  classLink: string;
  // description: string;
  createdBy: Types.ObjectId;
  course: Types.ObjectId;
  startTime: string;
  endTime: string;
  isCancelled: boolean;
}

const ClassSchema = new Schema<IClass>(
  {
    name: { type: String, required: true },
    classLink: { type: String, required: true },
    // description: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teacher",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isCancelled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Class = mongoose.model<IClass>("class", ClassSchema);

export default Class;
