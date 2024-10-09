import mongoose, { Types } from "mongoose";
import { type BaseSchema } from "./index";

export enum UserRole {
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
  ADMIN = "ADMIN",
}

const Schema = mongoose.Schema;

export interface IUser extends BaseSchema {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phoneNumber: string;
  dateOfBirth: Date;
  bio: string;
  profilePicture: string;
  stripe_id: string;
  enrolledCourses?: Array<Types.ObjectId>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: UserRole, default: UserRole.STUDENT },
    phoneNumber: { type: String },
    dateOfBirth: { type: Date },
    bio: { type: String },
    profilePicture: { type: String },
    stripe_id: { type: String },
    enrolledCourses: {
      type: Array<mongoose.Schema.Types.ObjectId>,
      ref: "course",
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("user", UserSchema);

export default User;
