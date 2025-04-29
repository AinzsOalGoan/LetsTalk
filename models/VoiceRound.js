const mongoose = require('mongoose');

const voiceQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  sampleAnswer: String, // For reference if needed
  maxDuration: { type: Number, default: 120 } // in seconds
});

const aiVoiceRoundSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  title: { type: String, default: 'AI Voice Round' },
  questions: [voiceQuestionSchema],
  totalQuestions: Number,
  timeLimit: { type: Number }, // in minutes
  analysisCriteria: {
    fluency: { type: Boolean, default: true },
    pronunciation: { type: Boolean, default: true },
    confidence: { type: Boolean, default: true },
    tone: { type: Boolean, default: true },
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AIVoiceRound', aiVoiceRoundSchema);
