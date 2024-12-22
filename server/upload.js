import multer from "multer";
import storage from "./storage.js";
// Initialize Multer with Cloudinary storage
const upload = multer({ storage });

export default upload;
