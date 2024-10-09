import { Request, Response } from "express";
import cloudinary from "cloudinary";
import { createResponse } from "../helper/response";
import fs from "fs";
import User from "../schema/user.schema";
import {AppLogo, Brand} from "../schema/logo.schema";


cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME || "dsjohbtbs",
  api_key: process.env.CLOUD_API_KEY || "422712123516439",
  api_secret: process.env.CLOUD_API_SECRET || "bUAWopzCkc6jJHYE_GKjDsP-GuA",
});

export const uploadFile = async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File;
  const result = await cloudinary.v2.uploader.upload(file?.path, {
    resource_type: "auto",
  });
  fs.unlinkSync(file?.path);
  const imageUrl = result.secure_url;
  if (imageUrl) {
    const res = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: { profilePicture: imageUrl },
      },
      { new: true }
    );
    console.log(res);
  }
  res.send(createResponse({}, "File uploaded successfully"));
};

export const uploadAppLogo = async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File;
  console.log(file)

  if (!file) {
    return res.status(400).send(createResponse({}, "No file uploaded!"));
  }

  try {
    const result = await cloudinary.v2.uploader.upload(file.path, {
      resource_type: "auto",
    });
    fs.unlinkSync(file.path);
    const imageUrl = result.secure_url;

    await AppLogo.findOneAndUpdate(
      { logo: imageUrl },
      { new: true, upsert: true } // Create if it doesn't exist
    );

    res.send(createResponse({imageUrl}, "App logo uploaded successfully!"));
  } catch (error) {
    console.error("Error uploading app logo:", error);
    res.status(500).send(createResponse({}, "Something went wrong!"));
  }
};

export const getAppLogo = async (req: Request, res: Response) => {
  try {
    const appLogo = await AppLogo.find();
    if (!appLogo) {
      return res.status(404).send(createResponse({}, "App logo not found!"));
    }

    res.send(createResponse({ logo: appLogo[0].logo }, "App logo retrieved successfully!"));
  } catch (error) {
    console.error("Error retrieving app logo:", error);
    res.status(500).send(createResponse({}, "Something went wrong!"));
  }
};

// export const uploadBrandLogo = async (req: Request, res: Response) => {
//   const file = req.file as Express.Multer.File;
//   console.log(file)

//   if (!file) {
//     return res.status(400).send(createResponse({}, "No file uploaded!"));
//   }

//   try {
//     const result = await cloudinary.v2.uploader.upload(file.path, {
//       resource_type: "auto",
//     });
//     fs.unlinkSync(file.path);
//     const imageUrl = result.secure_url;

//     await Brand.findOneAndUpdate(
//       { logo: imageUrl },
//       { new: true, upsert: true } // Create if it doesn't exist
//     );

//     res.send(createResponse({imageUrl}, "App logo uploaded successfully!"));
//   } catch (error) {
//     console.error("Error uploading app logo:", error);
//     res.status(500).send(createResponse({}, "Something went wrong!"));
//   }
// };

// export const getBrandLogos = async (req: Request, res: Response) => {
//   try {
//     const appLogo = await AppLogo.find();
//     if (!appLogo) {
//       return res.status(404).send(createResponse({}, "App logo not found!"));
//     }

//     res.send(createResponse({ logo: appLogo[0].logo }, "App logo retrieved successfully!"));
//   } catch (error) {
//     console.error("Error retrieving app logo:", error);
//     res.status(500).send(createResponse({}, "Something went wrong!"));
//   }
// };

