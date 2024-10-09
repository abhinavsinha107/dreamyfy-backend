// controllers/filter.controller.ts
import { Request, Response } from "express";
import { MongoClient, ObjectId } from "mongodb"; 
import dotenv from 'dotenv';

dotenv.config(); 

const uri: string = "mongodb+srv://abhinavsinha135:abhinavsinha135@cluster0.uomle9n.mongodb.net/eduApp?retryWrites=true&w=majority&appName=Cluster0"; 
const client = new MongoClient(uri);
  
export async function filterCourses(req: Request, res: Response): Promise<void> {
  const { id } = req.body; 

  // Check if ID is provided
  if (!id) {
    res.status(400).json({ message: "Invalid or missing ObjectId" });
    return; // Return to avoid further processing
  }

  try {
    await client.connect();
    const db = client.db('eduApp');
    const coursesCollection = db.collection('courses');

    // Create ObjectId from ID
    const objectId = ObjectId.createFromHexString(id);

    // Query the courses collection for documents with the specified subject
    const courses = await coursesCollection.find({
      subject: objectId
    }).toArray();


    res.status(200).json(courses); // Send the found courses
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  } finally {
    await client.close();
  }
}
