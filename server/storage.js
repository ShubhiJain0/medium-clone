import { v2 as cloudinary } from "cloudinary"; // Correct ES Module import
import { CloudinaryStorage } from "multer-storage-cloudinary"; // Correct ES Module import

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blog-banners", // Folder in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"], // Allowed file types
  },
});

export default storage; // Export as default
