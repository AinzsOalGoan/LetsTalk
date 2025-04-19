// const cloudinary = require("cloudinary").v2;
// const fs = require("fs");

// // Configure Cloudinary with environment variables
// cloudinary.config({
// 	cloud_name: process.env.COULDINARY_API_NAME, // Ensure these env vars are correctly set
// 	api_key: process.env.COULDINARY_API_KEY,
// 	api_secret: process.env.COULDINARY_API_SECRET,
// });

// const uploadOnCloudinary = async (localFilePath) => {
// 	try {
// 		if (!localFilePath) return null;

// 		// Check if file exists before proceeding with upload
// 		if (!fs.existsSync(localFilePath)) {
// 			console.error("File does not exist:", localFilePath);
// 			return null;
// 		}

// 		// Uploading file to Cloudinary
// 		const response = await cloudinary.uploader.upload(localFilePath, {
// 			resource_type: "auto", // Automatically determine file type
// 		});

// 		// Delete file from local storage after successful upload
// 		fs.unlinkSync(localFilePath);

// 		return response;
// 	} catch (error) {
// 		// Attempt to delete local file even on error, if it exists
// 		try {
// 			if (fs.existsSync(localFilePath)) {
// 				fs.unlinkSync(localFilePath);
// 			}
// 		} catch (unlinkErr) {
// 			console.error("Error deleting local file:", unlinkErr.message);
// 		}

// 		// Log the full error for better debugging
// 		console.error("Cloudinary Upload Error:", error);

// 		return null;
// 	}
// };

// // CommonJS export
// module.exports = { uploadOnCloudinary };
