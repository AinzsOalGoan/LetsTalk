const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    // 🔐 Auth details
    username: { type: String, required: true, unique: true }, // email
    password: String,

    // 👥 Role
    role: { type: String, enum: ['user', 'hr'], default: 'user' },

    // 🧑 Basic Info
    fullName: { type: String, required: true },
    phone: { type: String },
    country: { type: String, default: 'India' },
    profileImage: { type: String }, // optional profile pic

    // 📄 Resume
    resumeFile: { type: String }, // file path or cloud link
    resumeExtractedData: {
        college: String,
        degree: String,
        stream: String,
        graduationYear: String,
        skills: [String],
        experience: [
            {
                company: String,
                position: String,
                duration: String,
                description: String
            }
        ]
    },

    // 🌐 Portfolio links
    portfolioLinks: {
        github: String,
        linkedin: String,
        portfolio: String,
    },

    // 🧾 Applied jobs
    appliedJobs: [
        {
            jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
            status: { type: String, enum: ['Applied', 'Shortlisted', 'Rejected', 'Selected'], default: 'Applied' },
            appliedAt: { type: Date, default: Date.now }
        }
    ],

    // 🧑‍💼 HR Fields
    companyDetails: {
        name: String,
        website: String,
        description: String
    },
    jobsPosted: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        }
    ],

    // 🤖 AI Round
    Rounds: [
        {
            jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
            score: Number,
            transcript: String,
            audioFile: String
        }
    ],

    createdAt: { type: Date, default: Date.now }
});

// ✨ Passport plugin
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
