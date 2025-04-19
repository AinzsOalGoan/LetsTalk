const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },

    responsibilities: {
        skills: [String],
        tasks: [String]
    },

    requirements: [String],

    company: { type: String, required: true },
    location: { type: String, required: true },
    salaryRange: { type: String, required: true },

    jobType: { type: String, enum: ['Internship', 'Full-time', 'Part-time'], default: 'Internship' },
    mode: { type: String, enum: ['Remote', 'On-site'], default: 'Remote' },

    skillsRequired: [String],
    experienceRequired: { type: String, default: 'Fresher' },

    datePosted: { type: Date, default: Date.now },
    deadlineDate: { type: String },

    rounds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Round'
    }]
});

module.exports = mongoose.model('Job', jobSchema);
