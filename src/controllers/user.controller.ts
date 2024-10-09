import { Request, Response } from "express";
import User from "../schema/user.schema";
import { createResponse } from "../helper/response";
import createHttpError from "http-errors";
import Course from "../schema/course.schema";

export const getUserById = async (req: Request, res: Response) => {
  // Find the user by ID, excluding sensitive fields
  const user = await User.findById(req.params.id).select(
    "-password -stripe_id -createdAt -updatedAt -__v"
  );

  // If user is not found, throw a 404 error
  if (!user) {
    throw createHttpError(404, {
      message: "User not found!",
    });
  }

  // Start building the response object
  const responseData: any = { 
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    bio: user.bio,
    phoneNumber: user.phoneNumber,
    profilePicture: user.profilePicture,
    courses: [] // Initialize with an empty array for courses
  };

  // If the user is a teacher, fetch their courses
  if (user.role === "TEACHER") {
    // Fetch courses where the teacher ID matches the user's ID
    const courses = await Course.find({ teacher: user._id }).select(
      "-createdAt -updatedAt -__v"
    ); // Exclude unnecessary fields

    // Include the courses in the response
    responseData.courses = courses; // Set the courses into the courses field
  }

  // Send the response back with user data
  res.send(createResponse({ user: responseData }, "User data fetched successfully"));
};


export const updateUserById = async (req: Request, res: Response) => {
  if (req.user?._id !== req.params.id && req.user?.role !== "ADMIN") {
    throw createHttpError(401, {
      message: "Unauthorized to update user details",
    });
  }
  const userData = req.body;
  const user = await User.findById(req.params.id).lean();
  if (!user) {
    throw createHttpError(404, {
      message: "User not found!",
    });
  }
  const newUser = await User.findOneAndUpdate({ _id: user._id }, userData, {
    new: true,
  });
  res.send(createResponse({}, "User updated successfully!"));
};

export const getTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await User.find({ role: "TEACHER" }).select(
      "-password -stripe_id -createdAt -updatedAt -__v"
    );
    
    if (!teachers.length) {
      throw createHttpError(404, {
        message: "No teachers found!",
      });
    }

    res.send(createResponse(teachers, "Teachers data fetched successfully"));
  } catch (error) {
    throw createHttpError(500, {
      message: "Error fetching teachers data",
    });
  }
};