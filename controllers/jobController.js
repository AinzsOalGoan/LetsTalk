const Job = require('../models/JobSchema');
const Recruiter = require('../models/RecruterSchema');
const Round = require('../models/RoundSchema');

const McqRound = require('../models/MCQRound');
const DsaRound = require('../models/DSARound');
const GrammarRound = require('../models/GrammarRound');
const AptiRound = require('../models/AptitudeRound');

// ... import other rounds like GrammarRound, AptiRound, etc.

exports.renderJobForm = async (req, res) => {
    res.render('jobs/create.ejs'); // You’ll design this form
};

exports.createJobWithRounds = async (req, res) => {
    try {
        const recruiterId = req.user._id;
        const recruiter = await Recruiter.findOne({ user: recruiterId });

        const { jobTitle, jobDescription, selectedRounds } = req.body;

        // Step 1: Create Job
        const job = new Job({
            title: jobTitle,
            description: jobDescription,
            recruiter: recruiter._id
        });
        await job.save();

        // Step 2: Create rounds based on selection
        const roundDocs = [];

        for (const roundType of selectedRounds) {
            let roundDoc;
            switch (roundType) {
                case 'MCQ':
                    roundDoc = new McqRound({ job: job._id });
                    break;
                case 'DSA':
                    roundDoc = new DsaRound({ job: job._id });
                    break;
                case 'Grammar':
                    // roundDoc = new GrammarRound({ job: job._id });
                    break;
                case 'Apti':
                    // roundDoc = new AptiRound({ job: job._id });
                    break;
                // Add other rounds similarly
            }

            if (roundDoc) {
                await roundDoc.save();

                // Step 3: Push into round array
                roundDocs.push({
                    roundType,
                    roundRefId: roundDoc._id
                });
            }
        }

        // Step 4: Create Round doc and link to Job
        const fullRound = new Round({
            job: job._id,
            rounds: roundDocs
        });

        await fullRound.save();

        // Link Round to Job
        job.round = fullRound._id;
        await job.save();

        res.status(201).json({ message: 'Job and Rounds created.', job });
    } catch (err) {
        console.error('Error creating job with rounds:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
