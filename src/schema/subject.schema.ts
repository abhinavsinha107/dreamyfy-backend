import mongoose, { Types } from "mongoose";
import { type BaseSchema } from "./index";

const Schema = mongoose.Schema;

export interface ISubject extends BaseSchema {
  name: string;
  description: string;
  createdBy: Types.ObjectId;
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const Subject = mongoose.model<ISubject>("subject", SubjectSchema);

export default Subject;
