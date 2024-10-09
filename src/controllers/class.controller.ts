import { Request, Response } from "express";
import { createResponse } from "../helper/response";
import createHttpError from "http-errors";
import Class, { IClass } from "../schema/class.schema";
import mongoose from "mongoose";

export const createClass = async (req: Request, res: Response) => {
  if (req.user?.role !== "TEACHER") {
    throw createHttpError(401, {
      message: "Unauthorized to create class",
    });
  }
  const classData: Partial<IClass> = req.body;

  const classes = new Class({
    ...classData,
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });
  await classes.save();
  res.send(createResponse({}, `New course ${req.body.name} created`));
};

export const getAllClasses = async (req: Request, res: Response) => {
  const classes = await Class.find().select(
    "name description startTime endTime"
  );
  res.send(createResponse(classes, `All classes fetched successfully`));
};

export const getClassById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (id === "teacher") {
    const classes = await Class.find({ createdBy: req.user?._id })
      .populate({
        path: "course",
        select: "name",
      })
      .select("name description startTime endTime classDate isCancelled _id")
      .exec();
    console.log(classes);

    if (!classes || classes.length === 0) {
      throw createHttpError(404, {
        message: "No classes found for this user",
      });
    }

    res.send(
      createResponse(classes, "All teacher classes fetched successfully")
    );
    return;
  }
  const classes = await Class.findById(req.params.id).select(
    "name description startTime endTime"
  );
  if (!classes) {
    throw createHttpError(404, {
      message: "Class not found!",
    });
  }
  res.send(createResponse(classes, "Class fetched successfully"));
};

export const updateClassById = async (req: Request, res: Response) => {

  const courseData = req.body;
  const course = await Class.findById(req.params.id).lean();
  if (!course) {
    throw createHttpError(404, {
      message: "Course not found!",
    });
  }
  await Class.findOneAndUpdate(
    { _id: req.params.id },
    { ...courseData},
    {
      new: true,
    }
  );
  res.send(createResponse({}, "Class updated successfully!"));
};
