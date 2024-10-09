import { Request, Response } from 'express';
import { MongoClient } from 'mongodb'; // Import MongoDB client

// MongoDB URI
const uri: string = "mongodb+srv://abhinavsinha135:abhinavsinha135@cluster0.uomle9n.mongodb.net/eduApp?retryWrites=true&w=majority&appName=Cluster0"; 
const client = new MongoClient(uri);

// Controller to get investor details
export const getInversterController = async (req: Request, res: Response): Promise<void> => {
    try {
        await client.connect();
        const db = client.db('eduApp'); // Use your database name
        const investorsCollection = db.collection('investors'); // Assuming the collection name is 'investors'

        const investors = await investorsCollection.find({}).toArray(); // Fetch all investors
        res.status(200).json(investors);
    } catch (error) {
        console.error("Error in getInversterController:", error);
        res.status(500).json({ message: "Internal server error." });
    } finally {
        await client.close();
    }
};

// Controller to post investor details
export const postInversterController = async (req: Request, res: Response): Promise<void> => {
    const { name, phoneNumber, email, notes } = req.body; // Extract fields from the request body
    console.log(req.body)
    // Check if all required fields are provided
    if (!name || !phoneNumber || !email) {
        res.status(400).json({ message: "Name, phone number, and email are required." });
        return;
    }

    try {
        await client.connect();
        const db = client.db('eduApp'); // Use your database name
        const investorsCollection = db.collection('investors'); // Assuming the collection name is 'investors'

        // Create new investor document
        const newInvestor = { name, phoneNumber, email, notes };
        await investorsCollection.insertOne(newInvestor);

        res.status(201).json({ message: "Investor details added successfully." });
    } catch (error) {
        console.error("Error in postInversterDetail:", error);
        res.status(500).json({ message: "Internal server error." });
    } finally {
        await client.close();
    }
};
