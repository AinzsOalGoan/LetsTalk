const mongoose = require('mongoose');

const mcqQuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true }
    }
  ],
  explanation: { type: String }, // optional explanation for answer
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  tags: [String] // optional tags like "HTML", "OOP", etc.
});

const mcqRoundSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  title: { type: String, default: 'MCQ Round' },
  questions: [mcqQuestionSchema],
  timeLimit: { type: Number, default: 30 }, // in minutes
  totalMarks: { type: Number }, // optional, calculate based on questions if needed
  passingMarks: { type: Number }
});

module.exports = mongoose.model('MCQRound', mcqRoundSchema);
