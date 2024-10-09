import { Request, Response } from "express";
import User, { UserRole } from "../schema/user.schema";
import { createResponse } from "../helper/response";
import mongoose from "mongoose";

export const getChatDetails = async (req: Request, res: Response) => {
  if (req.user?.role === "TEACHER") {
    const teacherId = req.user?._id;

    const students = await User.aggregate([
      { $match: { role: UserRole.STUDENT } },
      {
        $lookup: {
          from: "courses",
          localField: "enrolledCourses",
          foreignField: "_id",
          as: "enrolledCoursesDetails",
        },
      },
      { $unwind: "$enrolledCoursesDetails" },
      {
        $match: {
          "enrolledCoursesDetails.teacher": new mongoose.Types.ObjectId(
            teacherId
          ),
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          email: { $first: "$email" },
        },
      },
    ]);
    res.send(createResponse(students, `Students fetched successfully`));
  } else {
    const studentId = req.user?._id;

    const teachers = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(studentId),
          role: UserRole.STUDENT,
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "enrolledCourses",
          foreignField: "_id",
          as: "courses",
        },
      },
      { $unwind: "$courses" },
      {
        $lookup: {
          from: "users",
          localField: "courses.teacher",
          foreignField: "_id",
          as: "teacherDetails",
        },
      },
      { $unwind: "$teacherDetails" },
      {
        $group: {
          _id: "$teacherDetails._id",
          name: { $first: "$teacherDetails.name" },
          email: { $first: "$teacherDetails.email" },
        },
      },
    ]);
    res.send(createResponse(teachers, `Teachers fetched successfully`));
  }
};