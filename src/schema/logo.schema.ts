// src/schema/logo.schema.ts
import mongoose from "mongoose";

// Schema for the main app logo
const appLogoSchema = new mongoose.Schema({
  logo: {
    type: String,
    required: true,
  },
});

// Schema for brand logos
const brandSchema = new mongoose.Schema({
  logo: {
    type: [String],
    required: true,
  },
});

const AppLogo = mongoose.model("AppLogo", appLogoSchema);
const Brand = mongoose.model("Brand", brandSchema);

export { AppLogo, Brand };
