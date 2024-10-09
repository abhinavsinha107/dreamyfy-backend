import { Request, Response } from "express";
import Course, { ICourse } from "../schema/course.schema";
import { createResponse } from "../helper/response";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import User from "../schema/user.schema";

export const createCourse = async (req: Request, res: Response) => {
  if (req.user?.role !== "TEACHER") {
    throw createHttpError(401, {
      message: "Unauthorized to create course",
    });
  }
  const courseData: ICourse = req.body;
  const course = new Course({ ...courseData, teacher: req.user._id });
  await course.save();
  const {
    _id,
    name,
    description,
    price,
    teacher,
    startDate,
    endDate,
    isFinished,
    isApproved,
  } = course;
  const responseCourse = {
    _id,
    name,
    description,
    price,
    teacher,
    startDate,
    endDate,
    isFinished,
    isApproved,
  };
  res.send(
    createResponse(responseCourse, `New course ${req.body.name} created`)
  );
};

export const getAllCourses = async (req: Request, res: Response) => {
  let queryObject = {};
  if (req.user?.role === "STUDENT") {
    queryObject = { isApproved: true };
  } else if (req.user?.role === "TEACHER") {
    queryObject = { teacher: new mongoose.Types.ObjectId(req.user._id) };
  }
  const courses = await Course.find(queryObject)
    .select(
      "name description price teacher startDate endDate isApproved isFinished"
    )
    .populate({
      path: "teacher",
      select: "name profilePicture",
    });
  res.send(createResponse(courses, `All courses fetched successfully`));
};

export const getCourseById = async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.id)
    .select(
      "name description price startDate endDate isFinished isApproved updatedAt"
    )
    .populate({
      path: "teacher",
      select: "name profilePicture phoneNumber bio",
    });
  if (!course) {
    throw createHttpError(404, {
      message: "Course not found!",
    });
  }
  res.send(createResponse(course, "Course fetched successfully"));
};

export const getstudentEnrolledCourses = async (
  req: Request,
  res: Response
) => {
  const id = req.user?._id;
  const user = await User.findOne({ _id: id });
  const courseIds = user?.enrolledCourses;

  const courses = await Course.find({
    _id: { $in: courseIds },
  });

  res.send(createResponse(courses, "Courses fetched successfully"));
};

export const approveCourse = async (req: Request, res: Response) => {
  if (req.user?.role !== "ADMIN") {
    throw createHttpError(401, {
      message: "Unauthorized to approve course",
    });
  }
  const course = await Course.findById(req.params.id).lean();
  if (!course) {
    throw createHttpError(404, {
      message: "Course not found!",
    });
  }
  const approvedCourse = await Course.findOneAndUpdate(
    { _id: req.params.id },
    { isApproved: !course.isApproved },
    {
      new: true,
      projection:
        "name description price startDate endDate isFinished isApproved",
    }
  );
  res.send(
    createResponse(approvedCourse, "Course status updated successfully!")
  );
};

// export const updateCourse = async (req: Request, res: Response) => {
//   if (req.user?.role !== "ADMIN") {
//     throw createHttpError(401, {
//       message: "Unauthorized to update course details",
//     });
//   }
//   const courseData = req.body;
//   const course = await Course.findById(req.params.id).lean();
//   if (!course) {
//     throw createHttpError(404, {
//       message: "Course not found!",
//     });
//   }
//   const updatedCourse = await Course.findOneAndUpdate(
//     { _id: req.params.id },
//     { ...courseData, createdBy: req.user._id },
//     {
//       new: true,
//       projection: "name description isFinished",
//     }
//   );
//   res.send(createResponse(updatedCourse, "Course updated successfully!"));
// };
