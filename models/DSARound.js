const mongoose = require('mongoose');

const dsaQuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  inputFormat: String,
  outputFormat: String,
  constraints: String,
  sampleInput: String,
  sampleOutput: String,
  testCases: [
    {
      input: String,
      expectedOutput: String,
      hidden: { type: Boolean, default: true }
    }
  ],
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  tags: [String]
});

const dsaRoundSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  title: { type: String, default: 'DSA Round' },
  questions: [dsaQuestionSchema],
  timeLimit: { type: Number, required: true }, // in minutes
  totalMarks: Number,
  passingMarks: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DSARound', dsaRoundSchema);
