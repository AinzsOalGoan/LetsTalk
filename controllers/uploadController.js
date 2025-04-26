const fs = require("fs");
const User = require("../models/UserSchema");
const { uploadOnCloudinary } = require("../utils/cloudinary");

module.exports.handleFileUpload = async (req, res) => {
	try {
		if (!req.file) {
			return res
				.status(400)
				.json({ success: false, message: "No file uploaded" });
		}

		// Ensure file exists before uploading
		if (!fs.existsSync(req.file.path)) {
			return res
				.status(400)
				.json({ success: false, message: "File not found" });
		}

		const result = await uploadOnCloudinary(req.file.path);
		if (!result) {
			return res
				.status(500)
				.json({ success: false, message: "Cloud upload failed" });
		}

		const user = await User.findById(req.user._id);
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		// Determine field name and save accordingly
		if (req.file.fieldname === "profileImage") {
			user.profileImage = {
				url: result.secure_url,
				filename: result.public_id,
			};
		} else if (req.file.fieldname === "resumeFile") {
			user.resumeFile = {
				url: result.secure_url,
				filename: result.public_id,
			};
		} else {
			return res
				.status(400)
				.json({ success: false, message: "Invalid file field name" });
		}

		await user.save();

		return res.status(200).json({
			success: true,
			message: "Upload successful",
			data: {
				[req.file.fieldname]: {
					url: result.secure_url,
					filename: result.public_id,
				},
			},
		});
	} catch (err) {
		console.error("Error during file upload:", err);
		return res
			.status(500)
			.json({ success: false, message: "Server error during upload" });
	}
};
