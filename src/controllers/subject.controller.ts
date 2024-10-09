import { Request, Response } from "express";
import Subject, { ISubject } from "../schema/subject.schema";
import { createResponse } from "../helper/response";
import createHttpError from "http-errors";

export const createSubject = async (req: Request, res: Response) => {
  if (req.user?.role !== "ADMIN") {
    throw createHttpError(401, {
      message: "Unauthorized to create subject",
    });
  }
  const subjectData: ISubject = req.body;
  const subject = new Subject({ ...subjectData, createdBy: req.user._id });
  await subject.save();
  const { _id, name, description } = subject;
  const responseSubject = { _id, name, description };
  res.send(
    createResponse(responseSubject, `New subject ${req.body.name} created`)
  );
};

export const getAllSubjects = async (req: Request, res: Response) => {
  if (req.user?.role === "STUDENT") {
    throw createHttpError(401, {
      message: "Unauthorized to get subjects",
    });
  }
  const subjects = await Subject.find().select("name description");
  res.send(createResponse(subjects, `All subjects fetched successfully`));
};

export const getSubjectById = async (req: Request, res: Response) => {
  if (req.user?.role === "STUDENT") {
    throw createHttpError(401, {
      message: "Unauthorized to get subject details",
    });
  }
  const subject = await Subject.findById(req.params.id).select(
    "name description"
  );
  if (!subject) {
    throw createHttpError(404, {
      message: "Subject not found!",
    });
  }
  res.send(createResponse(subject, "Subject fetched successfully"));
};

export const updateSubject = async (req: Request, res: Response) => {
  if (req.user?.role !== "ADMIN") {
    throw createHttpError(401, {
      message: "Unauthorized to update subject details",
    });
  }
  const subjectData = req.body;
  const subject = await Subject.findById(req.params.id).lean();
  if (!subject) {
    throw createHttpError(404, {
      message: "Subject not found!",
    });
  }
  const updatedSubject = await Subject.findOneAndUpdate(
    { _id: req.params.id },
    { ...subjectData, createdBy: req.user._id },
    {
      new: true,
      projection: "name description",
    }
  );
  res.send(createResponse(updatedSubject, "Subject updated successfully!"));
};

export const deleteSubject = async (req: Request, res: Response) => {
  if (req.user?.role !== "ADMIN") {
    throw createHttpError(401, {
      message: "Unauthorized to delete subject",
    });
  }
  const subject = await Subject.findByIdAndDelete(req.params.id).lean();
  if (!subject) {
    throw createHttpError(404, {
      message: "Subject not found!",
    });
  }
  const { _id, name, description } = subject;
  const deletedSubject = { _id, name, description };
  res.send(createResponse(deletedSubject, "Subject deleted successfully!"));
};
