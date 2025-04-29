const mongoose = require('mongoose');

const grammarQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: String,
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  category: { type: String, enum: ['Tense', 'Preposition', 'Conjunction', 'Articles', 'Misc'], default: 'Misc' }
});

const grammarRoundSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  title: { type: String, default: 'Grammar Round' },
  questions: [grammarQuestionSchema],
  timeLimit: { type: Number, required: true }, // in minutes
  totalMarks: Number,
  passingMarks: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GrammarRound', grammarRoundSchema);
