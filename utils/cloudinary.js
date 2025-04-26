require("dotenv").config();
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload helper: sends file to Cloudinary then removes local copy
const uploadOnCloudinary = async (localFilePath) => {
	try {
		if (!localFilePath || !fs.existsSync(localFilePath)) return null;

		const result = await cloudinary.uploader.upload(localFilePath, {
			resource_type: "auto",
		});

		// Clean up local file after successful upload
		// fs.unlinkSync(localFilePath);
		return result;
	} catch (err) {
		// Clean up local file if upload fails
		if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
		console.error(`Cloudinary Upload Error for ${localFilePath}:`, err);
		return null;
	}
};

module.exports = { cloudinary, uploadOnCloudinary };
