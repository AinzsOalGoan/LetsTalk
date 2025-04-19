const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    roundType: { type: String, enum: ['AI', 'HR', 'Technical'], default: 'AI' },
    status: { type: String, enum: ['Scheduled', 'Completed', 'Failed'], default: 'Scheduled' },
    dateTime: { type: Date, required: true },
    duration: { type: Number, required: true }, // in minutes
    feedback: String,
    score: Number,
    questionsAsked: [String],
    answersGiven: [String]
});

module.exports = mongoose.model('Round', roundSchema);
