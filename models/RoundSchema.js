const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    roundType: {
        type: String,
        enum: ['MCQ', 'DSA', 'Grammar', 'Aptitude', 'Voice', 'Interview'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    instructions: {
        type: String,
        default: ''
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    roundContentType: {
        type: String,
        enum: ['MCQRound', 'DSARound', 'GrammarRound', 'VoiceRound', 'InterviewRound'],
        required: true
    },
    roundContent: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'roundContentType'
    },
    order: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Round', roundSchema);
