const mongoose = require('mongoose');

const interviewRoundSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },

  roundType: { type: String, default: 'Interview' },
  meetingRoomId: { type: String, required: true }, // e.g., Socket.io room ID or unique token
  scheduledAt: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
  status: { type: String, enum: ['Scheduled', 'Completed', 'Missed'], default: 'Scheduled' },

  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    notes: String
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InterviewRound', interviewRoundSchema);
