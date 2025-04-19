const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    // 🔐 Auth details
    username: { type: String, required: true, unique: true }, // usually email
    password: String,

    // 👥 Role
    role: { type: String, enum: ['user', 'recruiter'], default: 'user' },

    // 🧑 Basic Info
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dob: { type: Date },
    gender: { type: String },
    phone: { type: String },
    location: {
        city: String,
        state: String,
        country: String
    },
    profileImage: { type: String },

    // 📄 Resume Info
    resumeFile: { type: String },
    resumeExtractedData: {
        collegeDetails: {
            collegeName: String,
            degree: String,
            startYear: String,
            endYear: String,
            cgpa: String
        },
        skills: [String],
        experience: [{
            company: String,
            position: String,
            duration: String,
            description: String,
            startDate: String,
            endDate: String,
            type: { type: String, enum: ['Internship', 'Full-time'], default: 'Internship' },
            mode: { type: String, enum: ['Remote', 'On-site'], default: 'Remote' },
            role: String
        }],
        projects: [{
            title: String,
            description: String,
            technologies: [String],
            links: {
                github: String,
                liveSite: String
            }
        }],
        certifications: [{
            title: String,
            link: String
        }],
        awardsAndHobbies: [{
            title: String,
            description: String,
            link: String
        }]
    },

    // 🌐 Links
    portfolioLinks: {
        github: String,
        linkedin: String,
        portfolio: String,
    },

    // 🧾 Applications
    appliedJobs: [{
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
        status: { type: String, enum: ['Applied', 'Shortlisted', 'Rejected', 'Selected'], default: 'Applied' },
        appliedAt: { type: Date, default: Date.now }
    }],

    createdAt: { type: Date, default: Date.now }
});

// ✨ Plugin for handling hashed passwords
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
