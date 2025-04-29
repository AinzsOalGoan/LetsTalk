const mongoose = require('mongoose');

const aptitudeQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: String,
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  category: {
    type: String,
    enum: ['Quantitative', 'Logical', 'Verbal', 'Data Interpretation', 'Misc'],
    default: 'Quantitative'
  }
});

const aptitudeRoundSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  title: { type: String, default: 'Aptitude Round' },
  questions: [aptitudeQuestionSchema],
  timeLimit: { type: Number, required: true }, // in minutes
  totalMarks: Number,
  passingMarks: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AptitudeRound', aptitudeRoundSchema);
