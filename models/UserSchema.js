const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema(
	{
		// 🔐 Auth details
		username: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			index: true,
		}, // email
		password: {
			type: String,
			required: [true, "Password is required"],
		}, // Passport-local-mongoose handles this

		// 👥 Role
		role: {
			type: String,
			enum: ["user", "hr"],
			default: "user",
		},

		// 🧑 Basic Info
		fullName: {
			type: String,
			required: true,
			trim: true,
			index: true,
		},
		phone: {
			type: String,
			trim: true,
		},
		country: {
			type: String,
			default: "India",
			trim: true,
		},
		profileImage: {
			type: String, // optional profile pic
		},

		// 📄 Resume
		resumeFile: { type: String }, // file path or cloud link
		resumeExtractedData: {
			college: { type: String, trim: true },
			degree: { type: String, trim: true },
			stream: { type: String, trim: true },
			graduationYear: { type: String, trim: true },
			skills: [String],
			experience: [
				{
					company: { type: String, trim: true },
					position: { type: String, trim: true },
					duration: { type: String, trim: true },
					description: { type: String, trim: true },
				},
			],
		},

		// 🌐 Portfolio links
		portfolioLinks: {
			github: { type: String, trim: true },
			linkedin: { type: String, trim: true },
			portfolio: { type: String, trim: true },
		},

		// 🧾 Applied jobs
		appliedJobs: [
			{
				jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
				status: {
					type: String,
					enum: ["Applied", "Shortlisted", "Rejected", "Selected"],
					default: "Applied",
				},
				appliedAt: { type: Date, default: Date.now },
			},
		],

		// 🧑‍💼 HR Fields
		companyDetails: {
			name: { type: String, trim: true },
			website: { type: String, trim: true },
			description: { type: String, trim: true },
		},
		jobsPosted: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Job",
			},
		],

		// 🤖 AI Round
		Rounds: [
			{
				jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
				score: Number,
				transcript: { type: String, trim: true },
				audioFile: { type: String, trim: true },
			},
		],
	},
	{
		timestamps: true, // Adds createdAt and updatedAt automatically
	}
);

// ✨ Passport plugin
userSchema.plugin(passportLocalMongoose, {
	// Optional configuration for passport-local-mongoose
	usernameField: "username",
	// Don't use these fields in the DB - Passport handles them
	selectFields: "-password -salt",
});

module.exports = mongoose.model("User", userSchema);
