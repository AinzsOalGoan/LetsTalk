const Recruiter = require('../models/RecruterSchema');
const User = require('../models/UserSchema');
const Job = require('../models/JobSchema');
const Round = require('../models/RoundSchema');

exports.renderRecruiterForm = (req, res) => {
    res.render('recruiter/recruiterForm.ejs');
}

exports.createOrUpdateRecruiter = async (req, res) => {
    try {
        const userId = req.user._id; // assuming the user is logged in and Passport adds `req.user`
        const user = req.user;
        if(user.role !== 'recruiter'){
            return res.status(403).json({ message: 'Access denied. Only recruiters can create or update profiles.' });
        }
        const {
            companyDetails,
            designation
        } = req.body;

        // Check if recruiter already exists
        let recruiter = await Recruiter.findOne({ user: userId });

        if (recruiter) {
            // Update existing recruiter
            recruiter.companyDetails = companyDetails;
            recruiter.designation = designation;
            await recruiter.save();
            return res.status(200).json({ message: 'Recruiter profile updated.', recruiter });
        } else {
            // Create new recruiter profile
            recruiter = new Recruiter({
                user: userId,
                companyDetails,
                designation
            });
            await recruiter.save();
            return res.status(201).json({ message: 'Recruiter profile created.', recruiter });
        }
    } catch (err) {
        console.error('Recruiter create/update error:', err);
        return res.status(500).json({ message: 'Server error.' });
    }
};

exports.getRecruiterProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const recruiter = await Recruiter.findOne({ user: userId }).populate('user');
        if (!recruiter) {
            return res.status(404).json({ message: 'Recruiter profile not found.' });
        }
        return res.status(200).json(recruiter);
    } catch (err) {
        console.error('Fetch recruiter profile error:', err);
        return res.status(500).json({ message: 'Server error.' });
    }
};
