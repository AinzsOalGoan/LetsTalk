const multer = require("multer");
const { uploadOnCloudinary } = require("../utils/cloudinary"); // Assuming you already have this function to upload to Cloudinary
const User = require("../models/UserSchema"); // Assuming this is where the user schema is defined
const fs = require("fs");

// Multer storage configuration
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/temp"); // Save file temporarily in public/temp folder
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + "-" + uniqueSuffix); // Generate a unique filename
	},
});

// Multer middleware to handle file upload
const upload = multer({ storage: storage });

// File upload route handler
const handleFileUpload = async (req, res) => {
	try {
		if (!req.file) {
			return res
				.status(400)
				.json({ success: false, message: "No file uploaded" });
		}

		// Upload file to Cloudinary
		const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

		// If Cloudinary upload failed, send error response
		if (!cloudinaryResponse) {
			return res
				.status(500)
				.json({
					success: false,
					message: "Failed to upload file to Cloudinary",
				});
		}

		// Save the Cloudinary URL to MongoDB (assuming this is a user's profile)
		const user = await User.findById(req.user._id); // Assuming `req.user._id` has the logged-in user's ID
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		// Save the Cloudinary image URL to the user's profile
		user.profileImage = cloudinaryResponse.secure_url;
		await user.save();

		// Delete the local file after uploading to Cloudinary
		fs.unlinkSync(req.file.path);

		// Respond with the updated user info (or just the Cloudinary URL if you prefer)
		res.status(200).json({
			success: true,
			message: "File uploaded successfully",
			data: {
				profileImage: cloudinaryResponse.secure_url,
			},
		});
	} catch (error) {
		console.error("Error during file upload:", error);
		res.status(500).json({
			success: false,
			message: "Server error during file upload",
		});
	}
};

module.exports = { upload, handleFileUpload };

//user chobi upload korbe
//chobi ta multer die public/temp te save hobe
//die multer seta ke cloudinary te upload korbe link pabe akta pherot
//sei link ta mongodb te save hobe
//temp file theke chobi ta unlink hoe jabe nije nije
